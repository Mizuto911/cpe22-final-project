"use client"

import { useContext, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import AuthContext from '../context/AuthContext'

interface ProtectedRouteProps {
    children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user } = useContext(AuthContext)
    const router = useRouter()

    useEffect(() => {
        if(!user){
            router.push('/')
        }
    }, [user, router])

    return user ? children : null
}

export default ProtectedRoute