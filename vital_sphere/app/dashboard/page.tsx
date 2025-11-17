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

const defaultUserDisplay: UserData = {
  id: 0,
  name: '',
  birthday: new Date(),
  is_female: false
}

const page = () => {
  const [activeTab, setActiveTab] = useState(Tabs.DASHBOARD);
  const [userData, setUserData] = useState(defaultUserDisplay);
  const [isLoading, setLoading] = useState(true);
  const [hasBluetooth, setHasBluetooth] = useState(false);
  const [monitorDevice, setMonitorDevice] = useState<BluetoothDevice | null>(null);
  const [heartRateChar, setHeartRateChar] = useState<BluetoothRemoteGATTCharacteristic | null>(null);
  const [bodyTempChar, setBodyTempChar] = useState<BluetoothRemoteGATTCharacteristic | null>(null);
  const { logOut, getUserData } = useContext(AuthContext);

  useEffect(() => {
    async function bluetooth() {
      setHasBluetooth(await supportsBluetooth());
    }
    bluetooth();
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchUserData = async () => {
      setUserData(await getUserData());
    }
    fetchUserData();
    setLoading(false);
  }, []);

  function getActiveTab() {
    switch (activeTab){

      case Tabs.DASHBOARD:
        return <Dashboard userData={userData} setActive={setActiveTab} />

      case Tabs.TRAINING_SESSION:
        return <TrainingSession />

      case Tabs.CONNECT_DEVICE:
        return <DeviceConnect hasBluetooth={hasBluetooth} device={monitorDevice} setDevice={setMonitorDevice} 
            setLoading={setLoading} setHeartRateChar={setHeartRateChar} setBodyTempChar={setBodyTempChar} />

      case Tabs.VITALS_SUMMARY:
        return <VitalSummary />

      case Tabs.SETTINGS:
        return <Settings />

    }
  }

  return (
    <ProtectedRoute>
      <main className="flex flex-row max-w-screen max-h-screen overflow-y-hidden">
          <section className="bg-primary-content min-w-[300px] w-[450px] h-screen rounded-tr-2xl rounded-br-2xl shadow-xl overflow-y-auto max-h-screen">
            <div className="flex flex-row gap-3 items-center p-4.5 mb-10">
                <Image src="/images/app_logo.png" alt="Vital Sphere Logo" width={64} height={64} /> 
                <h2 className="font-bold text-2xl text-primary">Vital Sphere</h2>
              </div>
              <UserMenuItem userData={userData} />
              <MenuList setActive={setActiveTab} activeTab={activeTab} logOut={logOut}/>
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
      </main>
    </ProtectedRoute>
  )
}

export default page