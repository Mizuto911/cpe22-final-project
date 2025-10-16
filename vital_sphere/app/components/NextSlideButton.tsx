'use client'
import React from 'react'
import { useSwiper } from 'swiper/react' 

interface NextSlideButtonProps {
    username: string
    password: string
    confirmPassword: string
    setErrorMsg: (message: string) => void
}

export default function NextSlideButton({username, password, confirmPassword, setErrorMsg}: NextSlideButtonProps) {
    const swiper = useSwiper()

    const handleClick = () => {
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
        swiper.slideNext()
    }

  return (
    <div className='w-full flex justify-center'>
        <button onClick={handleClick} type='button' className='btn btn-primary w-full rounded-lg size-lg max-w-sm mt-10 mb-20'>
        Next
        </button>
    </div>
    
  )
}