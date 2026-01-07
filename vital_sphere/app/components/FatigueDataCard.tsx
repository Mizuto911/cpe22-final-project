import React from 'react'
import clsx from 'clsx'

interface FatigueDataCardProps {
    summaryTimeContent: string
    rhhContent: number | null
    hrrContent: number | null
    fatigueRisk: boolean | null
    analyzing: boolean | null
}

const FatigueDataCard = (props: FatigueDataCardProps) => {
  return (
    <article className='w-[30%] min-w-[350px] max-w-[400px] bg-base-200 shadow-xl rounded-xl border-gray-200 border-1 max-lg:w-full max-lg:max-w-none'>
        <h2 className='text-accent text-xl font-bold text-center p-2 border-b-accent border-b-2'>Session Summary</h2>
        <ul className='mt-5 mb-8'>
            <li className='flex flex-row justify-between px-6 mb-2'>
                <span className='text-xl'>Training Time:</span>
                <span className='text-xl text-accent'>{props.summaryTimeContent}</span>
            </li>
            <li className='flex flex-row justify-between px-6 mb-2'>
                <span className='text-xl'>Resting Heart Rate:</span>
                <span className='text-xl text-accent'>{props.rhhContent !== null ? props.rhhContent : '--'} BPM</span>
            </li>
            <li className='flex flex-row justify-between px-6 mb-2'>
                <span className='text-xl'>Heart Rate Recovery:</span>
                <span className='text-xl text-accent'>{props.hrrContent !== null ? props.hrrContent : '--'} BPM</span>
            </li>
        </ul>
        <p className='text-lg text-start mb-5 px-6 flex flex-row justify-between'>
            <span>Fatigue Risk:</span> 
            <span className={clsx('font-bold', props.fatigueRisk === null ? 'text-black' : props.fatigueRisk ? 'text-error' : 'text-success')}>
                {props.analyzing ? <span className="loading loading-spinner text-primary"></span> : 
                    props.fatigueRisk === null ? '----' : props.fatigueRisk ? 'DETECTED' : 'NONE'}
            </span>
        </p>
    </article>
  )
}

export default FatigueDataCard