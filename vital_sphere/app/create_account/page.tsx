import React from 'react'
import RegistrationForm from '../components/RegistrationForm'

const page = () => {
  return (
    <div className='h-screen w-screen bg-base-300 flex flex-col justify-start items-center overflow-y-scroll'>
      <header>
        <h1 className='text-center my-4 font-bold max-md:text-3xl text-3xl text-primary'>Vital Shere</h1>
      </header>
      <section className='bg-white rounded-2xl w-full max-w-[700px] shadow-lg mb-5 max-md:w-[95%]'>
        <div className='bg-primary p-4 rounded-t-2xl shadow-lg'>
          <h2 className='text-2xl text-white text-center font-bold'>Create New Account</h2>
          <p className='text-center text-white text-sm'>Fill out the information down below.</p>
        </div>
        <RegistrationForm />
      </section>
    </div>
  )
}

export default page