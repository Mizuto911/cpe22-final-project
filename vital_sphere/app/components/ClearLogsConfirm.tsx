import { useContext } from 'react'
import clsx from 'clsx'
import style from "./dashboard.module.css";
import AuthContext from '../context/AuthContext';

interface ClearLogsConfirmProps {
  showErrorMessage: Function
  setLoading: Function
  setClearLogsConfirm: Function
}

const ClearLogsConfirm = (props: ClearLogsConfirmProps) => {

    const { deleteUserLogs } = useContext(AuthContext);

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
        props.setClearLogsConfirm(false);
      }

  return (
    <section className={clsx('fixed top-0 left-0 w-screen h-screen grid place-content-center bg-[rgba(0,0,0,0.5)] z-5', style.fadeIn)}>
        <div className="min-w-[250px] w-[25vw] h-auto rounded-xl bg-base-200 p-4 flex flex-col items-center justify-between">
            <div className="flex flex-col items-center">
                <h2 className="font-bold text-xl text-primary mb-3">
                    Clear All User Data 
                </h2>
                <p>Are you sure you want to delete all your logs?</p>
            </div>
            <div className='mt-6'>
                <button onClick={() => props.setClearLogsConfirm(false)} className="btn btn-outline btn-error p-2 rounded-lg me-6 min-w-16" >No</button> 
                <button onClick={handleLogDelete} className="btn btn-outline btn-success p-2 rounded-lg min-w-16">Yes</button>
            </div>
        </div>
    </section>
  )
}

export default ClearLogsConfirm