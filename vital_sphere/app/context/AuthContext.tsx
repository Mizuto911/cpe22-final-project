"use client";

import { createContext, useState, ReactNode } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

interface AuthProviderProps {
    children: ReactNode
}

interface AuthContextType {
    user: any | null
    isAuthenticated: boolean
    login: (username: string, password: string) => Promise<void>
    register: (username: string, password: string, birthday: Date, isFemale: boolean) => Promise<void>
    logout: () => void
}

const initialAuthContext: AuthContextType = {
    user: null,
    isAuthenticated: false,
    login: async() => {},
    register: async() => {},
    logout: () => {}
}

const AuthContext = createContext<AuthContextType>(initialAuthContext)

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState(null);
    const router = useRouter()

    const isAuthenticated = !!user

    const login = async (username: string, password: string) => {
        try {
            const formData = new FormData()
            formData.append('username', username)
            formData.append('password', password)
            const response = await axios.post('http://localhost:8000/auth/token', formData, {
                headers:{ 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + String(response.data.access_token)
            localStorage.setItem('token', response.data.access_token)
            setUser(response.data)
            router.push('/dashboard')
        } catch (error) {
            console.log('Sign-in Failed: ', error)
        }
    }

    const register = async (username: string, password: string, birthday: Date, isFemale: boolean) => {
        try {
            const registrationPayload = {
                username: username,
                password: password,
                birthday: birthday.toISOString().split('T')[0],
                is_female: isFemale
            }
            const response = await axios.post('http://localhost:8000/auth/', registrationPayload, {
                headers: {'Content-Type': 'application/json'}
            })
            
            if(response.status == 201 || response.status == 200) {
                console.log('Registration Successful: ', response.data)
                router.push('/start/sign_in')
            } else {
                console.log(response.status)
            }
        } catch (error) {
            console.log('Registration Failed: ', error)
        }
    }

    const logout = () => {
        setUser(null)
        delete axios.defaults.headers.common['Authorization']
        router.push('/')
    }

    return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
        { children }
    </AuthContext.Provider>
    )
}

export default AuthContext