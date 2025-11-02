import { createContext } from "react";

type AuthDetailsType = {
    user: object | null,
    isAuthenticated: boolean,
    login: (formData: FormData) => Promise<boolean>,
    register: (formData: FormData) => void,
    logOut: () => void
}

const authDetails: AuthDetailsType = {
    user: null,
    isAuthenticated: false,
    login: async() => false,
    register: async() => {},
    logOut: () => {}
}

const AuthContext = createContext(authDetails);

export default AuthContext;