'use client';

import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";

interface ClientProviderProps {
    children: ReactNode;
}

export default function ClientProviders({children}: ClientProviderProps) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    )
}