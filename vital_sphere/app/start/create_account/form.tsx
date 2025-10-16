'use client';
import { stringify } from 'querystring';
import React from 'react'
import { useState, useContext } from 'react'
import AuthContext from '@/app/context/AuthContext';

const RegistrationForm = () => {
    const { register } = useContext(AuthContext)

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPass] = useState('')
    const [birthday, setBirthday] = useState<Date>(new Date())
    const [isFemale, setFemale] = useState<boolean>(false)
    const [errorMsg, setErrorMsg] = useState('')

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!username || !password){
            console.log('Blank forms detected')
            setErrorMsg('Please fill in the form!')
            return
        }

        if(password != confirmPassword){
            console.log('Passwords don\'t match')
            setErrorMsg('Passwords don\'t match!')
            return
        }

        setErrorMsg('')

        try{
            await register(username, password, birthday, isFemale)
        }catch (error){
            console.log('There is an Error: ', error)
        }

        console.log('Register Clicked!' + stringify({username, password}));
    }

  return (
    <form onSubmit={onSubmit} className='space-y-8 w-full flex flex-col justify-center item-center'>
        <div className='flex flex-col items-center'>
            <h2 className='grid w-full max-w-sm items-center gap-1.5'>User Name</h2>
            <input 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className='input w-full input-primary input-md font-medium max-w-sm' 
                type='text' 
                id='username'/>
        </div>
        <div className='flex flex-col items-center'>
            <h2 className='grid w-full max-w-sm items-center gap-1.5'>Password</h2>
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='input w-full input-primary input-md font-medium max-w-sm' 
                type="password" 
                id='password' />
        </div>
        <div className='flex flex-col items-center'>
            <h2 className='grid w-full max-w-sm items-center gap-1.5'>Confirm Password</h2>
            <input
                value={confirmPassword}
                onChange={(e) => setConfirmPass(e.target.value)}
                className='input w-full input-primary input-md font-medium max-w-sm' 
                type="password" 
                id='confirm_password' />
        </div>
        <div className='flex flex-col items-center'>
            <button className='btn btn-primary w-full rounded-lg size-lg max-w-sm mt-5'>Next</button>
        </div>
        {errorMsg && <h1 className='text-red-600 font-bold text-center p-2 border border-red-300 bg-red-300 rounded 
        max-w-sm mx-auto w-full'>{errorMsg}</h1>}
    </form>
  )
}

export default RegistrationForm