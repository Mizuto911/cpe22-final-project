import React from 'react'
import Image from 'next/image'
import SignInForm from './components/SignInForm'

const page = () => {
  return (
    <div className='w-screen h-screen flex flex-row bg-base-300 max-md:justify-center justify-between items-center'>
      <section className='max-md:w-full max-lg:w-[60%] w-[45vw] h-[95%] m-6 flex flex-col justify-center items-center'>
        <div className='mt-[-3rem] mb-[3rem] flex flex-col justify-center items-center'>
          <Image src='/images/app_logo.png' alt='Vital Sphere Logo' width={100} height={100} />
          <h1 className='text-center font-bold max-md:text-3xl text-5xl text-primary my-5'>Vital Sphere</h1>
          <p className='text-[0.9rem] text-gray-400'>Athlete Health Monitoring System</p>
        </div>
        <SignInForm />
      </section>
      <section className='max-md:hidden shrink-4 overflow-hidden grow-1 h-[95%] m-6 w-auto'>
        <Image src="/images/welcome_bg.jpg" alt="Welcome Background" width={1920} height={1080} 
          className='w-[100%] h-[100%] object-cover object-right max-lg:object-[80%] rounded-2xl'
        />
      </section>
    </div>
  )
}

export default page