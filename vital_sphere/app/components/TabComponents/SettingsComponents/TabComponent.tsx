import { useState } from 'react'
import { SettingTabs } from '@/app/modules/DataTypes'

interface TabComponentProps {
    activeTab: SettingTabs
    setActiveTab: Function
}

const TabComponent = (props: TabComponentProps) => {
    
    const indicatorClassName = props.activeTab == SettingTabs.PROFILE ? 
        'border-b-2 border-primary w-[50%] absolute bottom-0 left-0 translate-x-0 transition-all duration-150':
        'border-b-2 border-primary w-[50%] absolute bottom-0 left-0 translate-x-full transition-all duration-150';
    
  return (
    <nav className='flex flex-row border-b-1 border-black mx-6 relative'>
        <div className='w-[50%] flex flex-row justify-center p-2 text-lg hover:bg-base-300 cursor-pointer'
            onClick={() => props.setActiveTab(SettingTabs.PROFILE)}>Profile</div>
        <div className='w-[50%] flex flex-row justify-center p-2 text-lg hover:bg-base-300 cursor-pointer'
            onClick={() => props.setActiveTab(SettingTabs.DATA)}>Data</div>
        <div className={indicatorClassName}></div>
    </nav>
  )
}

export default TabComponent