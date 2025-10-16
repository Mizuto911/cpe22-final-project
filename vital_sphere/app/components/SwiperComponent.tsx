'use-client'
import React from 'react'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import NextSlideButton from '@/app/components/NextSlideButton'

interface SwiperComponentProps {
    username: string
    password: string
    confirmPassword: string
    isFemale: boolean
    birthday: Date
    errorMsg: string
    setErrorMsg: (message: string) => void
    setUsername: (username: string) => void
    setPassword: (password: string) => void
    setConfirmPass: (confirmPassword: string) => void
    setBirthday: (birthday: Date) => void
    setFemale: (isFemale: boolean) => void
}

export default function SwiperComponent({
    username, password, confirmPassword, isFemale, birthday, errorMsg, setErrorMsg, setUsername, setPassword, setConfirmPass, setBirthday, setFemale
}: SwiperComponentProps){
  return (
    <Swiper modules={[Pagination]} effect='creative' allowTouchMove={false} pagination={true} slidesPerView={1} className='w-full y-full bg-white'>
            <SwiperSlide>
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
                        type="password"                             id='confirm_password' />
                </div>
                <NextSlideButton username={username} password={password} confirmPassword={confirmPassword} setErrorMsg={setErrorMsg}/>
                {errorMsg && <h1 className='text-red-600 font-bold text-center p-2 border border-red-300 bg-red-300 rounded 
                max-w-sm mx-auto w-full'>{errorMsg}</h1>}
            </SwiperSlide>
            <SwiperSlide>
                <div className='flex flex-col items-center'>
                    <h2 className='grid w-full max-w-sm items-center gap-1.5'>Gender</h2>
                    <select>
                        {/* TO DO: Gender Drop Down Menu*/}
                    </select>
                </div>
                <div className='flex flex-col items-center'>
                    <h2 className='grid w-full max-w-sm items-center gap-1.5'>Birth Day</h2>
                    <input> {/* TO DO: BirthDay Date Picker*/}</input>
                </div>
                <NextSlideButton username={username} password={password} confirmPassword={confirmPassword} setErrorMsg={setErrorMsg}/>
                {errorMsg && <h1 className='text-red-600 font-bold text-center p-2 border border-red-300 bg-red-300 rounded 
                max-w-sm mx-auto w-full'>{errorMsg}</h1>}
            </SwiperSlide>
        </Swiper>
  )
}