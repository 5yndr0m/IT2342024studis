import { MdOutlineFileOpen } from "react-icons/md";
import moment from "moment";
import Button from '../Button';
import PropTypes from 'prop-types';
import { useState } from "react";
import FileDialog from "./FileDialog";
import { useDeleteFileMutation } from "../../redux/slices/api/filesApiSlice";
import { toast } from "sonner";
import AddFile from "./AddFiles";
import ConfirmatioDialog from "../Dialogs";

//renders files to view
const FileView = ({ files }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [selected, setSelected] = useState(null);

    //delete file mutation
    const [deleteFIle] = useDeleteFileMutation();

    const deleteClicks = (id) => {
      setSelected(id);
      setOpenDialog(true);
    };
  
    const editFileHandler = (file) => {
      setSelected(file);
      setOpenEdit(true);
    };

    //handles delete function
    const deleteHandler = async () => {
      try {
        const res = await deleteFIle({
          id: selected,
          isTrashed: "trash",
        }).unwrap();
  
        toast.success(res?.message);
  
        setTimeout(() => {
          setOpenDialog(false),
          window.location.reload();
        }, 500);
      } catch (err) {
        console.log(err);
        toast.error(err?.data?.message || err.error);
      }
    };

    //table structure
    const TableHeader = () => (
        <thead className='border-b border-[#F8F9FA]'>
          <tr className='text-[#343A40]  text-left'>
            <th className='py-2'> </th>
            <th className='py-2'>File Name</th>
            <th className='py-2'> </th>
            <th className='py-2'>Date Added</th>
          </tr>
        </thead>
      );

    const TableRow = ({ file }) => (
        <tr className='border-b border-[#F8F9FA] text-[#495057] hover:bg-[#E9ECEF]'>
          <td className='py-2'>
            <div className='flex items-center gap-3'>
              <a href={file.file} target="_blank" rel="noopener noreferrer">
                <div className='w-9 h-9 rounded-full text-[#E9ECEF] flex items-center justify-center text-sm bg-[#1C6B31]'>
                  <span className='text-center'><MdOutlineFileOpen /></span>
                </div>
              </a>
            </div>
          </td>
          <td className='py-2'>
            <div className='flex items-center gap-3'>    
              <div>
                <p> {file.fileName}</p>
              </div>
            </div>
          </td>
          <td className='py-2'>
            <div className='flex items-center gap-3'>    
              <div>
                <FileDialog file={file} />
              </div>
            </div>
          </td>
    
          <td className='py-2 text-sm'>{moment(file?.dateAdded).format('YYYY-MM-DD')}</td>
          <td className='py-2 flex gap-2 md:gap-4 justify-end'>
            <Button
                className='text-[#C79100] hover:text-[#FFC107] sm:px-0 text-sm md:text-base'
                label='Edit'
                type='button'
                onClick={() => editFileHandler(file)}
            />

            <Button
                className='text-[#A71D2A] hover:text-[#DC3545] sm:px-0 text-sm md:text-base'
                label='Delete'
                type='button'
                onClick={() => deleteClicks(file._id)}
            />
        </td>
    </tr>
);

    
      return (
        <>
        <div className='w-full bg-[#F8F9FA] px-2 md:px-4 pt-4 pb-4 shadow-md rounded'>
          <table className='w-full mb-5'>
            <TableHeader />
            <tbody>
              {files?.map((file, index) => (
                <TableRow key={index + file?._id} file={file} />
              ))}
            </tbody>
          </table>
        </div>
        <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
      <AddFile
        open={openEdit}
        setOpen={setOpenEdit}
        fileData={selected}
        key={new Date().getTime()}
      />
        </>
      );
};

//propTypes for this file
FileView.propTypes = {
  files: PropTypes.array,
  file: PropTypes.shape({
    _id: PropTypes.string,
    file: PropTypes.string,
    fileName: PropTypes.string,
    dateAdded: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
  }),
};

export default FileView