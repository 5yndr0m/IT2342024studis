import { DialogTitle } from "@headlessui/react";
import clsx from "clsx";
import { FaQuestion } from "react-icons/fa";
import ModalWrapper from "./ModalWrapper";
import PropTypes from 'prop-types';
import Button from "./Button";

//confirm dialog function
export default function ConfirmatioDialog({
  open,
  setOpen,
  msg,
  setMsg = () => {},
  onClick = () => {},
  type = "delete",
  setType = () => {},
}) {
  const closeDialog = () => {
    setType("delete");
    setMsg(null);
    setOpen(false);
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={closeDialog}>
        <div className='py-4 w-full flex flex-col gap-4 items-center justify-center'>
          <DialogTitle as='h3' className=''>
            <p
              className={clsx(
                "p-3 rounded-full ",
                type === "restore" || type === "restoreAll"
                  ? "text-[#FFE082] bg-[#C79100]"
                  : "text-[#F28B93] bg-[#A71D2A]"
              )}
            >
              <FaQuestion size={60} />
            </p>
          </DialogTitle>

          <p className='text-center text-[#495057]'>
            {msg ?? "Are you sure you want to delete the selected record?"}
          </p>

          <div className='bg-[#F8F9FA] py-3 sm:flex sm:flex-row-reverse gap-4'>
            <Button
              type='button'
              className={clsx(
                " px-8 text-sm font-semibold text-white sm:w-auto",
                type === "restoreAll" || type === "restore"
                ? "text-[#F8F9FA] bg-[#FFC107] hover:bg-[#C79100]"
                : "text-[#F8F9FA] bg-[#DC3545] hover:bg-[#A71D2A]"
              )}
              onClick={onClick}
              label={type === "restore" ? "Restore" : "Delete"}
            />

            <Button
              type='button'
              className='bg-[#6C757D] px-8 text-sm font-semibold text-[#F8F9FA] hover:bg-[#495057] sm:w-auto'
              onClick={() => closeDialog()}
              label='Cancel'
            />
          </div>
        </div>
      </ModalWrapper>
    </>
  );
}

ConfirmatioDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  msg: PropTypes.string,
  setMsg: PropTypes.func,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['delete', 'restore', 'restoreAll']),
  setType: PropTypes.func,
};

//user action function
export function UserAction({ open, setOpen, onClick = () => {} }) {
  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={closeDialog}>
        <div className='py-4 w-full flex flex-col gap-4 items-center justify-center'>
          <DialogTitle as='h3' className=''>
            <p className={clsx("p-3 rounded-full ", "text-[#A71D2A] bg-[#F28B93]")}>
              <FaQuestion size={60} />
            </p>
          </DialogTitle>

          <p className='text-center text-[#495057]'>
            {"Are you sure you want to activate or deactive this account?"}
          </p>

          <div className='bg-[#F8F9FA] py-3 sm:flex sm:flex-row-reverse gap-4'>
            <Button
              type='button'
              className={clsx(
                " px-8 text-sm font-semibold text-[#F8F9FA] sm:w-auto",
                "bg-[#DC3545] hover:bg-[#A71D2A]"
              )}
              onClick={onClick}
              label={"Yes"}
            />

            <Button
              type='button'
              className='bg-[#6C757D] px-8 text-sm font-semibold text-[#F8F9FA] hover:bg-[#495057] sm:w-auto border'
              onClick={() => closeDialog()}
              label='No'
            />
          </div>
        </div>
      </ModalWrapper>
    </>
  );
}

UserAction.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  onClick: PropTypes.func,
};
