import { RiDashboardHorizontalFill } from 'react-icons/ri';
import { FaRunning } from "react-icons/fa";
import { MdBluetoothConnected } from "react-icons/md";
import { CiWavePulse1 } from "react-icons/ci";
import { FaGear } from "react-icons/fa6";

export type RegisterResponseData = {
    ok: boolean,
    message: string,
    data: object | string
}

export type LoginResponseData = {
    success: boolean,
    message: string
}

export type UserData = {
    id: number,
    name: string,
    birthday: Date,
    is_female: boolean
}

export enum Tabs {
    DASHBOARD, TRAINING_SESSION, CONNECT_DEVICE, VITALS_SUMMARY, SETTINGS
}

export enum TrainingState {
    IDLE, MEASURING_REST, TRAINING, HR_RECOVERY_WAIT, MEASURING_HR_RECOVERY, STOPPED
}

export const TabList = [
    { id: Tabs.DASHBOARD, name: 'Dashboard', icon: <RiDashboardHorizontalFill className='text-3xl me-6' />},
    { id: Tabs.TRAINING_SESSION, name: 'Training Session', icon: <FaRunning className='text-3xl me-6' />},
    { id: Tabs.CONNECT_DEVICE, name: 'Connect Device', icon: <MdBluetoothConnected className='text-3xl me-6' />},
    { id: Tabs.VITALS_SUMMARY, name: 'Vitals Summary', icon: <CiWavePulse1 className='text-3xl me-6' />},
    { id: Tabs.SETTINGS, name: 'Settings', icon: <FaGear className='text-3xl me-6' />}
]