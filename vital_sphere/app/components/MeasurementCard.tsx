import React from 'react'
import clsx from 'clsx'

interface MeasurementCardProps {
    bpmContent: number | null
    tempContent: number | null
    overworked: boolean | null
    trainingTimeContent: string
}

const MeasurementCard = (props: MeasurementCardProps) => {
  return (
    <article className='w-[30%] min-w-[350px] max-w-[400px] bg-base-200 shadow-xl rounded-xl border-gray-200 border-1 max-lg:w-full max-lg:max-w-none'>
                  <h2 className='text-secondary text-xl font-bold text-center p-2 border-b-secondary border-b-2'>Live</h2>
        <ul className='mt-5 mb-8'>
            <li className='flex flex-row justify-between px-6 mb-2'>
                <span className='text-xl'>Heart Rate:</span>
                <span className='text-xl text-secondary'>{props.bpmContent !== null ? props.bpmContent : '--'} BPM</span>
            </li>
            <li className='flex flex-row justify-between px-6 mb-2'>
                <span className='text-xl'>Body Temperature:</span>
                <span className='text-xl text-secondary'>{props.tempContent !== null ? props.tempContent : '--'}&deg;C</span>
            </li>
            <li className='flex flex-row justify-between px-6 mb-2'>
                <span className='text-xl'>Training Time:</span>
                <span className='text-xl text-secondary'>{props.trainingTimeContent}</span>
            </li>
        </ul>
        <p className='text-lg text-start mb-5 px-6 flex flex-row justify-between'>
            <span>Assessment:</span> 
            <span className={clsx('font-bold', props.overworked === null ? 'text-black' : props.overworked ? 'text-error' : 'text-success')}>
                {props.overworked === null ? '----' : props.overworked ? 'OVERWORKED' : 'NORMAL'}
            </span>
        </p>
    </article>
  )
}

export default MeasurementCard