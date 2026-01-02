import React from 'react'
import clsx from 'clsx'
import AuthContext from '../context/AuthContext'
import { useContext } from 'react'
import style from "./dashboard.module.css";

interface LogOutConfirmProps {
    setLogOutConfirm: Function
}

const LogOutConfirm = (props: LogOutConfirmProps) => {

    const { logOut } = useContext(AuthContext);

  return (
    <section className={clsx('fixed top-0 left-0 w-screen h-screen grid place-content-center bg-[rgba(0,0,0,0.5)] z-60', style.fadeIn)}>
        <div className="min-w-[250px] w-[25vw] h-auto rounded-xl bg-base-200 p-4 flex flex-col items-center justify-between">
            <div className="flex flex-col items-center">
                <h2 className="font-bold text-xl text-primary mb-3">
                    Log Out 
                </h2>
                <p>Are you sure you want to log out?</p>
            </div>
            <div className='mt-5'>
                <button onClick={() => props.setLogOutConfirm(false)} className="btn btn-outline p-2 rounded-lg me-6" >Cancel</button> 
                <button onClick={logOut} className="btn btn-outline btn-error p-2 rounded-lg">Log Out</button>
            </div>
        </div>
    </section>
  )
}

export default LogOutConfirm