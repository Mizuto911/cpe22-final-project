'use client';
import { stringify } from 'querystring';
import React from 'react'
import { useState, useContext } from 'react'
import AuthContext from '@/app/context/AuthContext';
import SwiperComponent from '@/app/components/SwiperComponent';

const RegistrationForm = () => {
    const { register } = useContext(AuthContext)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPass] = useState('')
    const [birthday, setBirthday] = useState<Date>(new Date())
    const [isFemale, setFemale] = useState<boolean>(false)
    const [errorMsg, setErrorMsg] = useState('')


    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try{
            await register(username, password, birthday, isFemale)
        }catch (error){
            console.log('There is an Error: ', error)
        }

        console.log('Register Clicked!' + stringify({username, password}));
    }

  return (
    <form onSubmit={onSubmit} className='w-full flex flex-col justify-center item-center'>
        <SwiperComponent
            username={username}
            password={password}
            confirmPassword={confirmPassword}
            birthday={birthday}
            isFemale={isFemale}
            errorMsg={errorMsg}
            setUsername={setUsername}
            setPassword={setPassword}
            setConfirmPass={setConfirmPass}
            setBirthday={setBirthday}
            setFemale={setFemale}
            setErrorMsg={setErrorMsg}
        />
    </form>
  )
}

export default RegistrationForm