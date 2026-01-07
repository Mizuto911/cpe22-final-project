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
    name: string,
    birthday: Date,
    is_female: boolean
}

export type UserUpdateFormData = {
    userName: string,
    birthDay: Date,
    isFemale: boolean
}

export type UserUpdateData = {
    name: string,
    birthday: string,
    password: string
    is_female: boolean
}

export type UserUpdateDataResponse = {
    name: string,
    birthday: Date,
    is_female: boolean
}

export type UserPassUpdateData = {
    password: string,
    old_password: string
}

export type DataFetchError = {
    detail: {msg: string}
}

export type MeasurementData = {
    id: number,
    bpm: number,
    temperature: number,
    timestamp: Date,
    user_id: number
}

type MeasurementAverage = {
    bpm: number,
    temperature: number
}

export type MeasurementResponseData = {
    data: MeasurementData[],
    average: MeasurementAverage
}

type StatisticsData = {
    mean: number,
    median: number,
    mode: number,
    variance: number,
    std: number
}

export type OccurenceData = {
    [key: string]: number,
}

export type StatisticsResponse = {
    statistics: {
        bpm: StatisticsData,
        temp: StatisticsData
    }
    occurence: {
        bpm: OccurenceData
        temp: OccurenceData
    }
}

export type FatigueData = {
    id: number,
    rhh: number,
    hrr: number,
    train_time: number,
    user_id: number
}

type FatigueAverage = {
    rhh: number,
    hrr: number,
    train_time: number
}

export type FatigueResponseData = {
    data: FatigueData[],
    average: FatigueAverage
}

export type WindowSize = {
    width: number | undefined,
    height: number | undefined
}

export enum Tabs {
    DASHBOARD, TRAINING_SESSION, CONNECT_DEVICE, VITALS_SUMMARY, SETTINGS
}

export enum TrainingState {
    IDLE, MEASURING_REST, TRAINING, HR_RECOVERY_WAIT, MEASURING_HR_RECOVERY, STOPPED
}

export enum SettingTabs {
    PROFILE, DATA
}

export const TabList = [
    { id: Tabs.DASHBOARD, name: 'Dashboard', icon: <RiDashboardHorizontalFill className='text-3xl me-6 inline-block' />},
    { id: Tabs.TRAINING_SESSION, name: 'Training Session', icon: <FaRunning className='text-3xl me-6 inline-block' />},
    { id: Tabs.CONNECT_DEVICE, name: 'Connect Device', icon: <MdBluetoothConnected className='text-3xl me-6 inline-block' />},
    { id: Tabs.VITALS_SUMMARY, name: 'Vitals Summary', icon: <CiWavePulse1 className='text-3xl me-6 inline-block' />},
    { id: Tabs.SETTINGS, name: 'Settings', icon: <FaGear className='text-3xl me-6 inline-block' />}
]