'use client';

import { ReactNode, useState } from "react"
import { useRouter } from "next/navigation";
import AuthContext from "./AuthContext";
import { RegisterResponseData, LoginResponseData, UserPassUpdateData, 
    UserUpdateData, DataFetchError, UserData, UserUpdateDataResponse } from "../modules/DataTypes";

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
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'ngrok-skip-browser-warning': 'true' },
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
                headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
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
                {method: 'GET', headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'ngrok-skip-browser-warning': 'true'
                }});
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

    const updateUserData = async (userData: UserUpdateData): Promise<UserUpdateDataResponse | DataFetchError> => {
        try {
            const response = await fetch('http://localhost:8000/auth/data', 
                {method: 'PUT', headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'ngrok-skip-browser-warning': 'true',
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });
            
            if (response.ok) {
                const userData = await response.json();
                console.log('Data Update Successful!');
                return userData;
            }
            else {
                const error = await response.json();
                console.log(`Data Update Failed: ${error.detail}`);
                return error
            }
        }
        catch (e) {
            console.log(`Data Update Failed: ${String(e)}`);
            return {detail: {msg: 'Unable to Connect to Server'}}
        }
    }

    const updateUserPassword = async (passwordData: UserPassUpdateData): Promise<UserUpdateDataResponse | DataFetchError> => {
        try {
            const response = await fetch('http://localhost:8000/auth/password', 
                {method: 'PUT', headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'ngrok-skip-browser-warning': 'true',
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(passwordData)
                });
            
            if (response.ok) {
                const userData = await response.json();
                console.log('Password Update Successful!');
                return userData;
            }
            else {
                const error = await response.json();
                console.log(`Password Update Failed: ${error.detail}`);
                return error
            }
        }
        catch (e) {
            console.log(`Data Update Failed: ${String(e)}`);
            return {detail: {msg: 'Unable to Connect to Server'}}
        }
    }

    const deleteUserLogs = async (): Promise<true | DataFetchError> => {
        try {
            const response = await fetch('http://localhost:8000/auth/clear-data', {
                method: 'DELETE',
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            if (response.ok) {
                console.log('User Logs Deleted Successfully!');
                return true;
            }
            else {
                const error = await response.json();
                console.log(`Log Delete Failed: ${error.detail}`);
                return error;
            }
        }
        catch (e) {
            console.log(`Log Delete Failed: ${String(e)}`)
            return {detail: {msg: 'Unable to Connect to Server'}}
        }
    }

    const logOut = () => {
        setUser(null);
        localStorage.removeItem('token');
        router.push('/');
    }

    const authProviderValue = { user, isAuthenticated, login, register, getUserData, updateUserData, updateUserPassword, deleteUserLogs, logOut }

    return (
        <AuthContext.Provider value={authProviderValue}>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthProvider;