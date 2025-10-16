import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import app_logo from '../../../public/images/app_logo.png'
import RegistrationForm from './form'

const page = () => {
  return (
    <div className='h-screen w-screen flex justify-start items-end lg:items-center bg-[url(/images/welcome_bg.jpg)] bg-contain lg:bg-cover 
    bg-top lg:bg-right'>
        <div className='h-[80%] lg:h-full w-full lg:w-3xl bg-white rounded-tr-3xl lg:rounded-br-3xl rounded-tl-3xl lg:rounded-tl-none
        text-[#682BD7] p-10 flex flex-col justify-center items-center shadow-2xl overflow-y-scroll'>
            <h1 className='text-2xl md:text-3xl lg:text-5xl font-extrabold text-center md:mb-10'>Sign Up</h1>
            <RegistrationForm/>
        </div>
    </div>
  )
}

export default page