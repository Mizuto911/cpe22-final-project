'use client';
import { stringify } from 'querystring';
import React from 'react'
import {useState} from 'react'

const RegistrationForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try{
            const res = await fetch('/api/register', {
                method:'POST',
                body: JSON.stringify({email, password}),
                headers: {'Content-Type': 'application/json'}
            })
            if(res.ok){
                //redirect
            }
        }catch(error) {
            console.log(error);
        }

        console.log('Register Clicked!' + stringify({email, password}));
    }

  return (
    <form onSubmit={onSubmit} className='space-y-12 w-[400px]'>
        <div>
            <h2 className='grid w-full max-w-sm items-center gap-1.5'>Email</h2>
            <input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className='input w-full input-primary input-md font-medium' 
                type="email" 
                id='email'/>
        </div>
        <div>
            <h2 className='grid w-full max-w-sm items-center gap-1.5'>Password</h2>
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='input w-full input-primary input-md font-medium' 
                type="password" 
                id='password' />
        </div>
        <div>
            <button className='btn btn-primary w-full rounded-lg size-lg'>Register</button>
        </div>
    </form>
  )
}

export default RegistrationForm