import { response } from "express";
import User from "../models/user.js";
import { createJWT } from "../utils/index.js";
import Notice from "../models/notification.js";
import nodemailer from 'nodemailer';
import { transporter } from "../utils/index.js";

export const registerUser = async (req, res) => {
    try {
      const { name, email, password, isAdmin, role, title, regNumber, degree } = req.body;
  
      const userExist = await User.findOne({ email });
  
      if (userExist) {
        return res.status(400).json({
          status: false,
          message: "User already exists",
        });
      }
  
      const user = await User.create({
        name,
        email,
        password,
        regNumber,
        degree,
        isAdmin,
        role,
        title,
      });
  
      if (user) {
        isAdmin ? createJWT(res, user._id) : null;
  
        user.password = undefined;
  
        res.status(201).json(user);
      } else {
        return res
          .status(400)
          .json({ status: false, message: "Invalid user data" });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
  };
  
  export const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(401)
          .json({ status: false, message: "Invalid email or password." });
      }
  
      if (!user?.isActive) {
        return res.status(401).json({
          status: false,
          message: "User account has been deactivated, contact the administrator",
        });
      }

      const isMatch = await user.matchPassword(password);

      if (user && isMatch) {
        createJWT(res, user._id);
  
        user.password = undefined;
  
        res.status(200).json(user);
      } else {
        return res
          .status(401)
          .json({ status: false, message: "Invalid password" });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: false, message: error.message });
    }
  };

export const logoutUser = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0),
        });

        res.status(200).json({ message: "Logout successfull."});
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const getUserList = async (req, res) => {
    try {
        const users = await User.find().select("name title role email isActive");

        res.status(200).json(users);
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const getNotificationsList = async (req, res) => {
    try {
        const { userId } = req.user;

        const notice = await Notice .find({
            owner: userId,
            isRead: false,
        }).populate("task", "title")
        .populate("owner","name");

        res.status(201).json(notice);
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { userId, isAdmin } = req.user
        const { _id } = req.body;

        const id = 
            isAdmin && userId === _id 
                ? userId 
                : isAdmin && userId !== _id
                ? _id
                : userId;

        const user = await User.findById(id)

        if (user) {
            user.name = req.body.name || user.name;
            user.role = req.body.role || user.role;
            user.regNumber = req.body.regNumber || user.regNumber;
            user.degree = req.body.degree || user.degree;

            const updateUser = await user.save();

            user.password = undefined;

            res.status(201).json({
                status: true,
                message: "Profile Update Successfully.",
                user: updateUser,
            });
        } else {
            res.status(404).json({ status: false, message: "User not found" });
        }
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const markNotificationRead = async (req, res) => {
    try {
        const { userId } = req.user;
        const { isReadType, id } = req.query;

        if (isReadType === "all") {
            await Notice.updateMany(
                { owner: userId, isRead: false },
                { isRead: true }
            );
        } else {
            await Notice.findOneAndUpdate(
                { _id: id, owner: userId, isRead: false },
                { isRead: true }
            );
        }

        res.status(201).json({ status: true, message: "Done" });
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { userId } = req.user;

        const user = await User.findById(userId);

        if (user) {
            user.password = req.body.password;

            await user.save();

            user.password = undefined;

            res.status(201).json({
                status: true,
                message: `Password changed successfully`,
            });
        } else {
            res.status(404).json({ status: false, message: "User not found" });
        }
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const activateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (user) {
            user.isActive = req.body.isActive; //!user.isActive

            await user.save();

            res.status(201).json({
                status: true,
                message: `User account has been ${
                    user?.isActive ? "activated" : "disabled"
                }`,
            });
        } else {
            res.status(404).json({ status: false, message: "User not found" });
        }
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const deleteUserProfile = async (req, res) => {
    try {
        const { id } = req.params;

        await User.findByIdAndDelete(id);

        res
            .status(200)
            .json({ status: true, message: "User deleted successfully" });
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const updateMyProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, contact, birthday, profilePic } = req.body;

        const user = await User.findById(id)

            user.name = name || user.name;
            user.email = email || user.email;
            user.contact = contact || user.contact;
            user.birthday = birthday || user.birthday;
            user.profilePic = profilePic || user.profilePic;

            await user.save();

            user.password = undefined;

            res
            .status(200)
            .json({ status: true, message: "Profile updated successfully." });
    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
};

export const passResetRequest = async (req, res) => {
    try {
        const { name, email, regNumber } = req.body;

        const mailOptions = {
            from: process.env.SUPPORTMAIL,
            to: process.env.SYSADMINMAIL, 
            subject: 'Password Reset Request',
            text: `Name: ${name}\nEmail: ${email}\nRegistration Number: ${regNumber}\n\nPlease reset the password for this user.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
                console.error(error);
                res.status(500).json({ message: 'Error sending email'});
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ message: 'Password reset request sent successfully'});
            }
        })

    } catch (error) {
        return res.status(400).json({ status: false, message: error.message });
    }
};