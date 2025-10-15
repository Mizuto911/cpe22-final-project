import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import app_logo from '../public/images/app_logo.png'

const page = () => {
  return (
    <div className='h-screen w-screen flex justify-start items-end lg:items-center bg-[url(/images/welcome_bg.jpg)] bg-contain lg:bg-cover 
    bg-top lg:bg-right'>
        <div className='h-[80%] lg:h-full w-full lg:w-3xl bg-white rounded-tr-3xl lg:rounded-br-3xl rounded-tl-3xl lg:rounded-tl-none
        text-[#682BD7] p-10 flex flex-col justify-start items-center shadow-2xl overflow-scroll'>
            <Image src={app_logo} alt='app_logo' className='w-25 md:w-30 lg:w-50 h-25 md:h-30 lg:h-50 mt-5 md:mt-10 lg:mt-20 mb-5'/>
            <h1 className='text-2xl md:text-3xl lg:text-5xl font-extrabold text-center'>Vital Sphere</h1>
            <p className='text-xs lg:text-sm w-full lg:w-120 text-center mt-10 mb-8 md:mb-20 font-extralight text-gray-400'>
                Welcome to Vital Sphere!
                <br/>Athlete Health Monitoring Application to ensure your safety! 
                <br/>Start by Creating an Account or Signing in if you have an Account already.
            </p>
            <Link href='/start/sign_in' className='btn btn-outline btn-primary w-full md:w-md h-8 md:h-15 mb-5 rounded-xl 
            text-sm md:text:md lg:text-l'>Sign-In</Link>
            <Link href='/start/create_account' className='btn btn-outline btn-primary w-full md:w-md h-8 md:h-15 
            rounded-xl text-sm md:text:md lg:text-l'>Register</Link>
        </div>
    </div>
  )
}

export default page