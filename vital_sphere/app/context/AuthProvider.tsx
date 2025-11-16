'use client';

import { ReactNode, useState } from "react"
import { useRouter } from "next/navigation";
import AuthContext from "./AuthContext";
import { RegisterResponseData, LoginResponseData } from "../modules/DataTypes";

type AuthProviderProps = {
    children: ReactNode
}

type User = [object | null, Function]

const AuthProvider = ({ children }: AuthProviderProps) => {
    const router = useRouter();
    const [user, setUser]: User = useState(null);

    const isAuthenticated = user != null;

    async function login(formData: FormData): Promise<LoginResponseData> {
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
                setUser(loginToken);
                router.push('/dashboard');
                return {success: true, message: 'Login Successful!'};
            }
            else {
                const errorData = await response.json();
                console.log(`Log In Failed: ${String(errorData.message)}`);
                return {success: false, message: 'Incorrect User Name or Password!'};
            }
        }
        catch (e) {
            console.log(`Login Failed: ${String(e)}`);
            return {success: false, message: 'Unable to Connect to Server'};
        }
    }

    async function register(formData: FormData): Promise<RegisterResponseData> {
        try {
            const data = {
                username: formData.get('username'),
                password: formData.get('password'),
                birthday: formData.get('birthday'),
                is_female: formData.get('gender') === 'female' ? true : false
            }
            const response = await fetch('http://localhost:8000/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (response.ok) {
                const registerData = await response.json();
                if (registerData.ok) {
                    console.log('Register Successful!');
                    router.push('/?registered=true');
                }
                return registerData;
            }
            else {
                const errorData = await response.json();
                console.log(`Log In Failed: ${String(errorData.message)}`);
                return errorData;
            }
        }
        catch (e) {
            console.log(`Login Failed: ${String(e)}`);
            return {data: 'None', message: 'Unable to Connect to Server!', ok: false};
        }
    }

    const getUserData = async () => {
        try {
            const response = await fetch('http://localhost:8000/auth/data', 
                {method: 'GET', headers:{Authorization: `Bearer ${localStorage.getItem('token')}`}});
            const userData = await response.json();
            console.log('User Data get Complete!');
            console.log(userData);
            return userData;
        }
        catch (e) {
            console.log(`User Data Failed to Get: ${String(e)}`);
            return null;
        }
    }

    const logOut = () => {
        setUser(null);
        localStorage.removeItem('token');
        router.push('/');
    }

    const authProviderValue = { user, isAuthenticated, login, register, getUserData, logOut }

    return (
        <AuthContext.Provider value={authProviderValue}>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthProvider;