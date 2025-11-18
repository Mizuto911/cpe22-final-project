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
    training: boolean
}

const MenuList = (props: MenuListProps) => {

    const logOutClassName = clsx(
        'flex flex-row items-center max-md:block mx-8 mb-1 p-2 text-red-800 rounded-2xl font-bold mt-7 transition-[300ms]',
        !props.training && 'hover:bg-error hover:cursor-pointer',
        props.training && 'opacity-50'
    )

    const tabListElements = TabList.map((tab, index) => {
        const className = clsx(
            'flex flex-row items-center max-md:block mx-8 mb-1 p-2 rounded-2xl font-bold transition-[300ms]',
            index == props.activeTab ? 'bg-primary text-white' : !props.training && 'hover:bg-info hover:cursor-pointer',
            props.training && 'opacity-50'
        );

        return <li key={tab.id} className={className} onClick={() => handleTabChange(tab.id)}>
            {tab.icon} <span className='max-md:hidden'>{tab.name}</span>
        </li>
    });

    function handleTabChange(tab: Tabs) {
        if (!props.training)
            props.setActive(tab);
    }

  return (
    <ul className='mt-12'>
        {tabListElements}
        <li className={logOutClassName}
            onClick={props.training ? () => {} : () => props.logOut()}>
            <MdLogout className='text-3xl me-6' /> <span className='max-md:hidden'>Log Out</span>
        </li>
    </ul>
  )
}

export default MenuList