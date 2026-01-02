import MenuList from './MenuList'
import UserMenuItem from './UserMenuItem'
import Image from 'next/image'
import { UserData } from '../modules/DataTypes'
import { Tabs } from '../modules/DataTypes'
import { useRef } from 'react'
import { useOutsideAlerter } from '../modules/CustomHooks'
import clsx from 'clsx'

interface NavDrawerProps {
    userData: UserData
    setActiveTab: Function
    activeTab: Tabs
    training: boolean
    setLogOutConfirm: Function
    showDrawer: boolean
    setShowDrawer: Function
}

const NavDrawer = (props: NavDrawerProps) => {

    const drawerRef = useRef<HTMLElement | null>(null);

    const drawerClassName = props.showDrawer ? 
        "bg-primary-content w-[300px] h-screen rounded-tr-2xl rounded-br-2xl shadow-xl overflow-y-auto max-h-screen max-md:left-0 absolute z-50":
        "bg-primary-content w-[300px] h-screen rounded-tr-2xl rounded-br-2xl shadow-xl overflow-y-auto max-h-screen max-md:left-[-100%] absolute z-2";

    let drawerBGClassName = props.showDrawer ?
        'bg-[rgba(0,0,0,0.5)] fixed top-0 left-0 w-screen h-screen opacity-100 z-40':
        'bg-[rgba(0,0,0,0.5)] fixed top-0 left-0 w-screen h-screen opacity-0 z-[-1]';

    const transformClassName = 'duration-300 transition-all';

    useOutsideAlerter(drawerRef, () => props.setShowDrawer(false));

  return (
    <section>
        <section className={clsx(drawerClassName, transformClassName, 'min-md:hidden')} ref={drawerRef}>
            <div className="flex flex-row gap-3 items-center p-4.5 mb-10">
                <Image src="/images/app_logo.png" alt="Vital Sphere Logo" width={64} height={64} /> 
                <h2 className="font-bold text-2xl text-primary">Vital Sphere</h2>
            </div>
                <UserMenuItem userData={props.userData} />
                <MenuList setActive={props.setActiveTab} activeTab={props.activeTab} training={props.training}
                    setLogOutConfirm={props.setLogOutConfirm} setShowDrawer={props.setShowDrawer} />
        </section>
        <div className={clsx(drawerBGClassName, transformClassName, 'min-md:hidden')}></div>
    </section>
    
  )
}

export default NavDrawer