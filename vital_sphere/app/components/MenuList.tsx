'use client'
import { Dispatch, SetStateAction } from 'react'
import { RiDashboardHorizontalFill } from 'react-icons/ri';
import { FaRunning } from "react-icons/fa";
import { MdBluetoothConnected, MdLogout } from "react-icons/md";
import { CiWavePulse1 } from "react-icons/ci";
import { FaGear } from "react-icons/fa6";
import { TabList, Tabs } from '../modules/DataTypes';
import clsx from 'clsx';

interface MenuListProps {
    activeTab: Tabs
    setActive: Function
    logOut: Function
}

const MenuList = (props: MenuListProps) => {

    const tabListElements = TabList.map((tab, index) => {
        const className = clsx(
            'flex flex-row items-center mx-8 mb-1 p-2 rounded-2xl font-bold',
            index == props.activeTab ? 'bg-primary text-white' : 'hover:bg-info hover:cursor-pointer transition-[300ms]'
        );

        return <li key={tab.id} className={className} onClick={() => props.setActive(tab.id)}>
            {tab.icon} {tab.name}
        </li>
    });

  return (
    <ul className='mt-12'>
        {tabListElements}
        <li className='flex flex-row items-center mx-8 mb-1 p-2 text-red-800 rounded-2xl hover:bg-error hover:cursor-pointer transition-[300ms] font-bold mt-7'
            onClick={() => props.logOut()}>
            <MdLogout className='text-3xl me-6' /> Log Out
        </li>
    </ul>
  )
}

export default MenuList