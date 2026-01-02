import { useContext } from 'react'
import AuthContext from '@/app/context/AuthContext';
import { BiExport } from "react-icons/bi";
import { RiDeleteBin6Fill } from "react-icons/ri";

interface DataProps {
  showErrorMessage: Function
  setLoading: Function
}

const Data = (props: DataProps) => {

  const { deleteUserLogs } = useContext(AuthContext);

  async function handleDataExport() {
    //TODO: Implement this Function
  }
  
  //TODO: Put This Function in a Delete Confirm Dialog
  async function handleLogDelete() {
    props.setLoading(true);
    const deleteResponse = await deleteUserLogs();
    props.setLoading(false);

    if (deleteResponse === true) {
      props.showErrorMessage('User Logs Cleared Successfully', true);
    }
    else {
      if (deleteResponse.detail.msg)
        props.showErrorMessage(deleteResponse.detail.msg, false);
      else
        props.showErrorMessage(deleteResponse.detail, false);
    }
  }

  return (
    <section className='bg-base-300 shadow-2xl h-auto mt-16 mb-[75px] rounded-xl w-full max-w-[1000px] mx-auto p-8 py-6'>

      <h2 className="text-[clamp(1.8rem,3vw,2.25rem)] font-bold mx-auto text-primary w-fit">Data</h2>

      <button className='w-full btn btn-primary text-xl font-bold rounded-xl shadow-xl max-w-[700px] mx-auto block mt-12 h-14'>
        <BiExport className='inline-block mb-1' /> Export Data to CSV
      </button>

      <button className='w-full btn btn-primary text-xl font-bold rounded-xl shadow-xl max-w-[700px] mx-auto block mt-8 mb-8 h-14'
        onClick={handleLogDelete}>
        <RiDeleteBin6Fill className='inline-block mb-1' /> Clear Logs
      </button>

    </section>
  )
}

export default Data