import React from 'react'
import RegistrationForm from './form'
import Link from 'next/link'
const Register = () => {
  return (
    <div className='h-screen w-screen flex justify-center items-center bg-[url(/images/welcome_bg.jpg)] 
    bg-cover bg-center text-black'>
      <div className='px-8 pt-8 pb-12 h-fit bg-white rounded-xl shadow-xl font-bold'>
        <h1 className='text-xl font-extrabold mb-8 text-center'>Create Account</h1>
        <RegistrationForm/>
        <p className='text-center pt-5 font-normal'>
          Have an Account? <Link className='text-blue-600 underline' href='/sign_in'>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default Register