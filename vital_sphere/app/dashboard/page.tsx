'use client';
import DeviceConnect from "../components/TabComponents/DeviceConnect"
import TrainingSession from "../components/TabComponents/TrainingSession";
import VitalSummary from "../components/TabComponents/VitalSummary";
import Settings from "../components/TabComponents/Settings";
import Dashboard from "../components/TabComponents/Dashboard";
import Image from "next/image"
import { IoIosNotifications } from "react-icons/io";
import UserMenuItem from "../components/UserMenuItem";
import MenuList from "../components/MenuList";
import { useState, useContext, useEffect } from 'react';
import { Tabs, TabList } from "../modules/DataTypes";
import AuthContext from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import { UserData } from "../modules/DataTypes";
import { supportsBluetooth } from "@/app/modules/UtilityModules";
import style from "./dashboard.module.css";
import clsx from 'clsx';

const defaultUserDisplay: UserData = {
  id: 0,
  name: '',
  birthday: new Date(),
  is_female: false
}

const page = () => {
  const [activeTab, setActiveTab] = useState(Tabs.DASHBOARD);
  const [userData, setUserData] = useState(defaultUserDisplay);
  const [training, setTraining] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [logOutConfirm, setLogOutConfirm] = useState(false);
  const [hasBluetooth, setHasBluetooth] = useState(false);
  const [monitorDevice, setMonitorDevice] = useState<BluetoothDevice | null>(null);
  const [monitorData, setMonitorData] = useState<BluetoothRemoteGATTCharacteristic | null>(null);
  const [commandSend, setCommandSend] = useState<BluetoothRemoteGATTCharacteristic | null>(null);
  const [summaryData, setSummaryData] = useState<BluetoothRemoteGATTCharacteristic | null>(null);
  const { logOut, getUserData } = useContext(AuthContext);

  useEffect(() => {
    setLoading(true);
    async function bluetooth() {
      setHasBluetooth(await supportsBluetooth());
    }
    const fetchUserData = async () => {
      setUserData(await getUserData());
    }
    fetchUserData();
    bluetooth();
    setLoading(false);
  }, []);

  function getActiveTab() {
    switch (activeTab){

      case Tabs.DASHBOARD:
        return <Dashboard userData={userData} setActive={setActiveTab} device={monitorDevice} setLoading={setLoading} />

      case Tabs.TRAINING_SESSION:
        return <TrainingSession device={monitorDevice} monitorData={monitorData} training={training}
            setTraining={setTraining} commandSend={commandSend} summaryData={summaryData} setActive={setActiveTab} />

      case Tabs.CONNECT_DEVICE:
        return <DeviceConnect hasBluetooth={hasBluetooth} device={monitorDevice} setDevice={setMonitorDevice} setActive={setActiveTab}
            setMonitorData={setMonitorData} setCommandSend={setCommandSend} setSummaryData={setSummaryData} />

      case Tabs.VITALS_SUMMARY:
        return <VitalSummary />

      case Tabs.SETTINGS:
        return <Settings />

    }
  }

  return (
    <ProtectedRoute>
      <main className="flex flex-row max-w-screen max-h-screen overflow-y-hidden">
          <section className="bg-primary-content min-w-[300px] max-md:min-w-0 h-screen rounded-tr-2xl rounded-br-2xl shadow-xl overflow-y-auto max-h-screen">
            <div className="flex flex-row gap-3 items-center p-4.5 mb-10">
                <Image src="/images/app_logo.png" alt="Vital Sphere Logo" width={64} height={64} /> 
                <h2 className="font-bold text-2xl text-primary max-md:hidden">Vital Sphere</h2>
            </div>
              <UserMenuItem userData={userData} />
              <MenuList setActive={setActiveTab} activeTab={activeTab} training={training}
                  setLogOutConfirm={setLogOutConfirm}/>
          </section>
          <section className="w-full min-h-screen bg-base-200">
              <header className="flex flex-row justify-between items-center p-4 shadow-sm shadow-gray-200 w-full h-16">
                  <h2 className="font-bold text-xl ms-3 text-primary">{TabList[activeTab].name}</h2>
                  <div className="flex flex-row gap-4 items-center">
                    <span className="text-2xl text-gray-600"><IoIosNotifications /></span>
                    <Image src="/images/default_user.jpg" alt="User Profile" width={40} height={40}
                      className="rounded-[50%]" />
                  </div>
              </header>
              {getActiveTab()}
          </section>
          {isLoading && <div className="fixed top-0 bottom-0 w-screen h-screen grid place-content-center bg-[rgba(0,0,0,0.5)]">
                    <div className={`loading loading-spinner loading-xl text-primary mb-4`}></div>
                </div>}
          {logOutConfirm && <section className={clsx('fixed top-0 bottom-0 w-screen h-screen grid place-content-center bg-[rgba(0,0,0,0.5)]', style.fadeIn)}>
            <div className="min-w-[250px] w-[25vw] h-[160px] rounded-xl bg-base-200 p-4 flex flex-col items-center justify-between">
              <div className="flex flex-col items-center">
                <h2 className="font-bold text-xl text-primary mb-3">
                  Log Out 
                </h2>
                <p>Are you sure you want to log out?</p>
              </div>
              <div>
                <button onClick={() => setLogOutConfirm(false)} className="btn btn-outline p-2 rounded-lg me-6" >Cancel</button> 
                <button onClick={logOut} className="btn btn-outline btn-error p-2 rounded-lg">Log Out</button>
              </div>
            </div>
          </section>}
      </main>
    </ProtectedRoute>
  )
}

export default page