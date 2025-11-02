'use client';

import { ReactNode, useState } from "react"
import { useRouter } from "next/navigation";
import AuthContext from "./AuthContext";

type AuthProviderProps = {
    children: ReactNode
}

type User = [object | null, Function]

const AuthProvider = ({ children }: AuthProviderProps) => {
    const router = useRouter();
    const [user, setUser]: User = useState(null);

    const isAuthenticated = user != null;

    async function login(formData: FormData) {
        try {
            const data = new URLSearchParams({
                username: formData.get('username') as string,
                password: formData.get('password') as string
            })
            const response = await fetch('http://localhost:8000/auth/token', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: data
            })
            
            if (response.ok) {
                const loginToken = await response.json();
                console.log('Login Successful!')
                localStorage.setItem('token', loginToken.access_token);
                setUser(loginToken.data);
                router.push('/dashboard');
                return true;
            }
            else {
                const errorData = await response.json();
                console.log(`Log In Failed: ${String(errorData.message)}`);
                return false;
            }
        }
        catch (e) {
            console.log(`Login Failed: ${String(e)}`);
            return false;
        }
    }

    async function register(formData: FormData) {
        try {
            const data = {
                username: formData.get('username'),
                password: formData.get('password'),
                birthday: (new Date('September 11, 2003')).toISOString().split('T')[0],
                is_female: true
            }
            const response = await fetch('http://localhost:8000/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (response.ok) {
                console.log('Register Successful!');
                router.push('/?registered=true');
                return true;
            }
            else {
                const errorData = await response.json();
                console.log(`Log In Failed: ${String(errorData.message)}`);
                return false;
            }
        }
        catch (e) {
            console.log(`Login Failed: ${String(e)}`);
            return false;
        }
    }

    const logOut = () => {
        setUser(null);
        localStorage.removeItem('token');
        router.push('/')
    }

    const authProviderValue = { user, isAuthenticated, login, register, logOut }

    return (
        <AuthContext.Provider value={authProviderValue}>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthProvider;