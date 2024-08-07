import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../redux/slices/api/authApiSlice";
import { toast } from "sonner"
import { setCredentials } from "../redux/slices/authSlice";
import Loading from "../components/Loader";
import Request from "../components/Request";

//login page
const Login = () => {
  //select users
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //login mutation
  const [login, {isLoading}] = useLoginMutation();

  const [isRequestOpen, setIsRequestOpen] = useState(false);

  //try to login user
  //on success send to dashboard
  const submitHandler = async (data) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials(result))
      navigate("/")
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.message);
    }
  };

  //on success with activates
  useEffect(() => {
    user && navigate("/dashboard");
  }, [user, navigate]);

  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#DEE2E6]'>
      <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
        {/* left side */}
        <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
          <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
            <span className='flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base bg-[#E9ECEF] border-[#67E8CE] text-[#495057]'>
              Streamline Your Education!
            </span>
            <p className='flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-[#28A745]'>
              <span>Studius</span>
              <span>Task Manager</span>
            </p>

            <div className='cell'>
              <div className='circle rotate-in-up-left'></div>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center'>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className='form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-[#F8F9FA] px-10 pt-14 pb-14'
          >
            <div className=''>
              <p className='text-[#007BFF] text-3xl font-bold text-center'>
                Welcome back!
              </p>
              <p className='text-center text-base text-[#495057] '>
                Keep all your credentials safe!.
              </p>
            </div>

            <div className='flex flex-col gap-y-5'>
              <Textbox
                placeholder='email@example.com'
                type='email'
                name='email'
                label='Email Address'
                className='w-full rounded-full'
                register={register("email", {
                  required: "Email Address is required!",
                })}
                error={errors.email ? errors.email.message : ""}
              />
              <Textbox
                placeholder='your password'
                type='password'
                name='password'
                label='Password'
                className='w-full rounded-full'
                register={register("password", {
                  required: "Password is required!",
                })}
                error={errors.password ? errors.password.message : ""}
              />

              <span
                className='text-sm text-[#495057] hover:text-[#0056b3] hover:underline cursor-pointer'
                onClick={() => setIsRequestOpen(true)}
              >
                Forget Password?
              </span>

              {isLoading ? (
                <Loading/>
              ) : (<Button
                type='submit'
                label='Submit'
                className='w-full h-10 bg-[#28A745] text-[#F8F9FA] rounded-full hover:bg-[#1C6B31]'
                />
              )}
            </div>
          </form>
        </div>
      </div>
      <Request isOpen={isRequestOpen} onClose={() => setIsRequestOpen(false)} />
    </div>
  );
};

export default Login;
