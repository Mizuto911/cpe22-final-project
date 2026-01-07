import { useState } from 'react'
import { BiExport } from "react-icons/bi";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { downloadAsCSV } from '@/app/modules/UtilityModules';
import { getMeasurementData, getFatigueData } from '@/app/modules/DataFetching';
import ClearLogsConfirm from '../../ClearLogsConfirm';

interface DataProps {
  showErrorMessage: Function
  setLoading: Function
}

const Data = (props: DataProps) => {

  const [clearLogsConfirm, setClearLogsConfirm] = useState(false);

  async function handleDataExport() {
    props.setLoading(true);
    try {
      const measurementData = await getMeasurementData();
      const fatigueData = await getFatigueData();
      const success = downloadAsCSV(measurementData, fatigueData);
      if (!success) props.showErrorMessage('No User Data Found.');
    }
    catch (e) {
      props.showErrorMessage(`Error: ${e}`);
    }
    finally {
      props.setLoading(false);
    }
  }
  

  return (
    <section className='bg-base-300 shadow-2xl h-auto mt-16 mb-[75px] rounded-xl w-full max-w-[1000px] mx-auto p-8 py-6'>

      <h2 className="text-[clamp(1.8rem,3vw,2.25rem)] font-bold mx-auto text-primary w-fit">Data</h2>

      <button className='w-full btn btn-primary text-xl font-bold rounded-xl shadow-xl max-w-[700px] mx-auto block mt-12 h-14'
        onClick={handleDataExport}>
        <BiExport className='inline-block mb-1' /> Export Data to CSV
      </button>

      <button className='w-full btn btn-primary text-xl font-bold rounded-xl shadow-xl max-w-[700px] mx-auto block mt-8 mb-8 h-14'
        onClick={() => setClearLogsConfirm(true)}>
        <RiDeleteBin6Fill className='inline-block mb-1' /> Clear Logs
      </button>

      {clearLogsConfirm && <ClearLogsConfirm setLoading={props.setLoading} setClearLogsConfirm={setClearLogsConfirm} showErrorMessage={props.showErrorMessage} />}

    </section>
  )
}

export default Data