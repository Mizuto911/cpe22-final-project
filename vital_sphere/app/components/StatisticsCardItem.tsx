'use client'
import React from 'react'
import clsx from 'clsx'

interface StatisticsCardItemProps  {
    statName: string
    value: number | string
    unitName: string
}

const StatisticsCardItem = (props: StatisticsCardItemProps) => {
  return (
    <li className='flex flex-row justify-between items-center p-3 text-info-content border-b-1 border-gray-300'>
        <span className='font-bold text-[clamp(1rem,1.5vw,1.2rem)'>{props.statName}:</span>
        <span className='text-[clamp(1rem,1.5vw,1.2rem)]'>{props.value} {props.unitName}</span>
    </li>
  )
}

export default StatisticsCardItem