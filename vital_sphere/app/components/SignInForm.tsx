'use client'
import { useState, useContext, FormEvent } from 'react';
import { hasEmptyFields } from '@/app/modules/UtilityModules';
import AuthContext from '../context/AuthContext';
import Link from 'next/link';
import style from './Forms.module.css' 
import clsx from 'clsx';

const SignInForm = () => {

    const { login } = useContext(AuthContext);
    const [isLoading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setErrorMessage('');

        if (isLoading) {
            return;
        }

        const formData = new FormData(event.currentTarget);

        if(hasEmptyFields(formData)) {
            setErrorMessage('Please Fill in the Fields');
            return
        }
        else {
            setLoading(true);
        }
        const successfulLogin = await login(formData);

        if(!successfulLogin.success) {
            setErrorMessage(successfulLogin.message);
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}
            className='w-full flex flex-col items-center justify-center gap-6'
        >
            <div className='flex flex-col items-start max-md:max-w-[300px] max-md:w-[80%] w-[55%]'>
                <input type="text" name='username' id='username' onChange={() => setErrorMessage('')}
                    className="input input-primary w-full text-[1rem] py-5" placeholder='Enter Username'
                />
            </div>
            <div className='flex flex-col items-start max-md:max-w-[300px] max-md:w-[80%] w-[55%]'>
                <input type={clsx(showPassword ? 'text' : 'password')} name='password' id='password' onChange={() => setErrorMessage('')}
                    className="input input-primary w-full text-[1rem] py-5" placeholder='Password'
                />
            </div>
            <div className='flex flex-row gap-4 justify-end max-md:max-w-[300px] max-md:w-[80%] w-[55%]'>
                <input type="checkbox" className="checkbox checkbox-primary" onChange={() => setShowPassword(prev => !prev)} />
                <p className='max-md:text-sm text-md'>Show Password</p>
            </div>

            <button className='btn btn-primary max-md:max-w-[300px] w-[45%] rounded-[7px]'>Log In</button>
            <p className='max-md:text-sm text-md'>Don't have an account? <Link href='/create_account' 
                    className='text-primary underline hover:opacity-70 active:text-accent'>Register Here
                </Link>
            </p>
            {isLoading && <div className={`loading loading-spinner loading-xl text-primary ${style.loadingEnter}`}></div>}
            {errorMessage && <p className={`p-4 bg-error rounded-xl text-error-content font-bold ${style.errorEnter}`}>{errorMessage}</p>}
        </form>
    )
}

export default SignInForm