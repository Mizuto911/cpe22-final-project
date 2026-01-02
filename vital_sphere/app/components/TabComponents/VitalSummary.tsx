'use client'
import { useState, useEffect } from 'react'
import { FaHeart, FaTemperatureHigh } from "react-icons/fa6"
import { getStatistics } from '@/app/modules/DataFetching'
import { StatisticsResponse } from '@/app/modules/DataTypes'
import StatisticsCard from '../StatisticsCard'

interface VitalSummaryProps {
  setLoading: Function
  showErrorMessage: Function
}

const VitalSummary = (props: VitalSummaryProps) => {

  const [dataStat, setDataStat] = useState<StatisticsResponse | null>(null);

  useEffect(() => {
    try {
      async function statistics() {
        props.setLoading(true);
        setDataStat(await getStatistics());
        props.setLoading(false);
      }
      statistics();
    }
    catch (e) {
      if (e instanceof Error)
        props.showErrorMessage(e.message, false);
      else
        props.showErrorMessage(String(e), false);
    }
  }, []);

  return (
    <section className='p-8 flex flex-col items-center overflow-x-hidden max-h-[calc(100vh-4rem)] overflow-y-auto'>
      <h2 className='text-[clamp(1.8rem,3vw,2.25rem)] font-bold w-full mb-8'>Vitals Data Statistics</h2>

      <StatisticsCard 
        title='Beats Per Minute' 
        logo={<FaHeart className='text-red-500 inline mb-2 text-2xl'/>}
        unit='BPM' 
        occurenceDataset={dataStat?.occurence.bpm ?? {}}
        data={{
            mean: dataStat?.statistics.bpm.mean ?? '--',
            median: dataStat?.statistics.bpm.median ?? '--',
            mode: dataStat?.statistics.bpm.mode ?? '--',
            variance: dataStat?.statistics.bpm.variance ?? '--',
            std: dataStat?.statistics.bpm.std ?? '--',
        }} 
      />

      <StatisticsCard 
        title='Skin Temperature' 
        logo={<FaTemperatureHigh className='text-yellow-700 inline mb-2 text-2xl'/>}
        unit='°C' 
        occurenceDataset={dataStat?.occurence.temp ?? {}}
        data={{
            mean: dataStat?.statistics.temp.mean ?? '--',
            median: dataStat?.statistics.temp.median ?? '--',
            mode: dataStat?.statistics.temp.mode ?? '--',
            variance: dataStat?.statistics.temp.variance ?? '--',
            std: dataStat?.statistics.temp.std ?? '--'
        }} 
      />

    </section>
  )
}

export default VitalSummary