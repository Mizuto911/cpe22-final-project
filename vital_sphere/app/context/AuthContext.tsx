import { createContext } from "react";
import { RegisterResponseData, LoginResponseData, UserData, 
    UserUpdateData, UserPassUpdateData, DataFetchError, UserUpdateDataResponse } from "../modules/DataTypes";

type AuthDetailsType = {
    user: object | null,
    isAuthenticated: boolean,
    login: (formData: FormData) => Promise<LoginResponseData>,
    register: (formData: FormData) => Promise<RegisterResponseData>,
    getUserData: () => Promise<UserData | null>,
    updateUserData: (userData: UserUpdateData) => Promise<UserUpdateDataResponse | DataFetchError>,
    updateUserPassword: (passwordData: UserPassUpdateData) => Promise<UserUpdateDataResponse | DataFetchError>,
    deleteUserLogs: () => Promise<true | DataFetchError>
    logOut: () => void
}

const authDetails: AuthDetailsType = {
    user: null,
    isAuthenticated: false,
    login: async() =>  ({success: false, message: ''}),
    register: async() => ({ok: false, message: '', data: {}}),
    getUserData: async() => ({id: 0, name: '', birthday: new Date(), is_female: false} ),
    updateUserData: async() => ({detail: {msg: ''}}),
    updateUserPassword: async() => ({detail: {msg: ''}}),
    deleteUserLogs: async() => true,
    logOut: () => {}
}

const AuthContext = createContext(authDetails);

export default AuthContext;