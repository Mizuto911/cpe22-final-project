import { createContext } from "react";
import { RegisterResponseData, LoginResponseData } from "../modules/DataTypes";

type AuthDetailsType = {
    user: object | null,
    isAuthenticated: boolean,
    login: (formData: FormData) => Promise<LoginResponseData>,
    register: (formData: FormData) => Promise<RegisterResponseData>,
    logOut: () => void
}

const authDetails: AuthDetailsType = {
    user: null,
    isAuthenticated: false,
    login: async() => {return {success: false, message: ''}},
    register: async() => {return {ok: false, message: '', data: {}}},
    logOut: () => {}
}

const AuthContext = createContext(authDetails);

export default AuthContext;