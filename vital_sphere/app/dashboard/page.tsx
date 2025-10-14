import React from 'react'
import { GiHamburgerMenu } from "react-icons/gi"
import { IoGridOutline } from "react-icons/io5"
import defaultUserImage from '../images/default_user.jpg'
import Image from 'next/image'
import HeaderBox from './header_box'
import AthleteList from './athlete_list'

const page = () => {
  return (
    <div className='bg-white flex-col space-y-2 items-center justify-center p-5'>
        <header className='bg-white'>
            <div className='absolute top-0 left-0 flex justify-start items-center mt-10 ms-10'>
                <GiHamburgerMenu className='h-8 w-8 me-7 text-black'/>
                <h1 className='h-8 me-7 mb-2 font-bold text-4xl text-black'>Vital Sphere</h1>
            </div>
            <div className='absolute end-0 top-0 flex justify-end items-center mt-7 ms-10'>
                <IoGridOutline className='h-10 w-10 me-4 text-black'/>
                <Image src={defaultUserImage} alt='defaultUserImage' className='rounded-full h-15 w-15 me-8'></Image>
            </div>
        </header>
        <HeaderBox/>
        <AthleteList/>
    </div>
  )
}

export default page