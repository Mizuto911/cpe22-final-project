import React from 'react'
import Image from 'next/image'
import header_image from '../../public/images/header-image.png'

const HeaderBox = () => {
  return (
    <div className='bg-gradient-to-r from-[#682BD7] via-[#BD2E95] to-[#A37CF0] rounded-xl h-50 w-* mt-25 mx-10 p-10 relative'>
          <h1 className='ms-3 font-bold text-4xl text-white'>Athletes</h1>
          <h2 className='mt-1 mb-8 ms-3 text-l text-white'>Real-time Health Analytics for Athletes</h2>

          <div className='flex items-center ms-3'>
            <div className='flex items-center px-3'>
              <div className='bg-green-500 h-1 w-1 rounded-full'/>
              <h3 className='ms-3 text-xs text-white'>0 Athletes Monitored</h3>
            </div>
            <div className='flex items-center px-3'>
              <div className='bg-yellow-500 h-1 w-1 rounded-full'/>
              <h3 className='ms-3 text-xs text-white'>0 Alerts Active</h3>
            </div>
            <div className='flex items-center px-3'>
              <div className='bg-blue-500 h-1 w-1 rounded-full'/>
              <h3 className='ms-3 text-xs text-white'>AI Scanning Active</h3>
            </div>

            <div className='hidden lg:block absolute end-0 top-0 h-full w-150 overflow-hidden rounded-xl'>
              <Image src={header_image} alt='header_image object-cover' className='object-cover'></Image>
            </div>
          </div>
        </div>
  )
}

export default HeaderBox