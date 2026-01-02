'use client';
import React, { ReactNode } from 'react'
import StatisticsCardItem from './StatisticsCardItem'
import { OccurenceData } from '../modules/DataTypes';
import { BarChart } from '@mui/x-charts';
import { useWindowSize } from '@/app/modules/CustomHooks'

interface StatisticsCardProps {
    title: string
    logo: ReactNode
    data: {
        mean: string | number,
        median: string | number,
        mode: string | number,
        variance: string | number,
        std: string | number,
    }
    unit: string
    occurenceDataset: OccurenceData
}

const StatisticsCard = (props: StatisticsCardProps) => {

  const windowSize = useWindowSize();
  let chartHeight: number = ((windowSize.width && windowSize.width <= 992) ? 200 : 400);

  return (
    <article className='p-5 rounded-xl shadow-xl max-w-[1000px] min-w-[350px] w-[70%] mb-6 border-gray-200 border-1'>
        <h3 className='w-fit font-bold text-xl mb-5'>{props.logo} {props.title}</h3>

        <BarChart
          xAxis={[{data: Object.keys(props.occurenceDataset)}]}
          series={[{
            data: Object.values(props.occurenceDataset)
          }]}
          height={chartHeight}
        />

        <ul className='flex flex-col gap-3 mb-6'>
            <StatisticsCardItem statName='Mean' value={props.data.mean} unitName={props.unit} />
            <StatisticsCardItem statName='Median' value={props.data.median} unitName={props.unit} />
            <StatisticsCardItem statName='Mode' value={props.data.mode} unitName={props.unit} />
            <StatisticsCardItem statName='Variance' value={props.data.variance} unitName={props.unit}/>         
            <StatisticsCardItem statName='Standard Deviation' value={props.data.std} unitName={props.unit}/>
        </ul>
    </article>
  )
}

export default StatisticsCard