'use client';
import DeviceConnect from "../components/TabComponents/DeviceConnect"
import TrainingSession from "../components/TabComponents/TrainingSession";
import VitalSummary from "../components/TabComponents/VitalSummary";
import Settings from "../components/TabComponents/Settings";
import Dashboard from "../components/TabComponents/Dashboard";
import LogOutConfirm from "../components/LogOutConfirm";
import NavDrawer from "../components/NavDrawer";
import Image from "next/image"
import { IoIosNotifications } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import UserMenuItem from "../components/UserMenuItem";
import MenuList from "../components/MenuList";
import { useState, useContext, useEffect } from 'react';
import { Tabs, TabList } from "../modules/DataTypes";
import AuthContext from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import { UserData } from "../modules/DataTypes";
import { supportsBluetooth } from "@/app/modules/UtilityModules";
import clsx from 'clsx';

const page = () => {
  const [activeTab, setActiveTab] = useState(Tabs.DASHBOARD);
  const [userData, setUserData] = useState<UserData>({name: '', birthday: new Date(), is_female: false});
  const [training, setTraining] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [logOutConfirm, setLogOutConfirm] = useState(false);
  const [hasBluetooth, setHasBluetooth] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [error, setError] = useState({show: false, success: false, msg: ''});
  const [monitorDevice, setMonitorDevice] = useState<BluetoothDevice | null>(null);
  const [monitorData, setMonitorData] = useState<BluetoothRemoteGATTCharacteristic | null>(null);
  const [commandSend, setCommandSend] = useState<BluetoothRemoteGATTCharacteristic | null>(null);
  const [summaryData, setSummaryData] = useState<BluetoothRemoteGATTCharacteristic | null>(null);
  const { getUserData } = useContext(AuthContext);

  const errorClassName = error.show ? 
        clsx(
          'p-4 fixed bottom-8 left-[50%] translate-x-[-50%] rounded-xl font-bold mb-4 opacity-100',
          error.success ? 'bg-success text-success-content' : 'bg-error text-error-content'
        ): 
        clsx(
          'p-4 fixed bottom-[-60px] left-[50%] translate-x-[-50%] rounded-xl bg-error text-error-content font-bold mb-4 opacity-0',
          error.success ? 'bg-success text-success-content' : 'bg-error text-error-content'
        )

    function showErrorMessage(message: string, success: boolean) {
        setError({show: true, success: success, msg: message});
        setTimeout(() => {
            setError(oldError => ({show: false, success: oldError.success, msg: oldError.msg}));
        }, 2000);
    }

  useEffect(() => {
    setLoading(true);
    async function bluetooth() {
      try {
        setHasBluetooth(await supportsBluetooth());
      }
      catch (e) {
        if (e instanceof Error)
          showErrorMessage(e.message, false);
        else
          showErrorMessage(String(e), false);
      }
    }
    const fetchUserData = async () => {
      const userDataResponse = await getUserData()
      if (userDataResponse) {
        setUserData(userDataResponse);
      }
      else {
        showErrorMessage('There was a Problem Fetching your Data.', false);
      }
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
            setMonitorData={setMonitorData} setCommandSend={setCommandSend} setSummaryData={setSummaryData} showErrorMessage={showErrorMessage} />

      case Tabs.VITALS_SUMMARY:
        return <VitalSummary setLoading={setLoading} showErrorMessage={showErrorMessage} />

      case Tabs.SETTINGS:
        return <Settings showErrorMessage={showErrorMessage} setUserData={setUserData} setLoading={setLoading} userData={userData} />

    }
  }

  return (
    <ProtectedRoute>
      <main className="flex flex-row max-w-screen max-h-screen overflow-y-hidden relative">
          <section className="bg-primary-content w-[350px] h-screen rounded-tr-2xl rounded-br-2xl shadow-xl overflow-y-auto max-h-screen max-md:hidden">
            <div className="flex flex-row gap-3 items-center p-4.5 mb-10">
                <Image src="/images/app_logo.png" alt="Vital Sphere Logo" width={64} height={64} /> 
                <h2 className="font-bold text-2xl text-primary max-md:hidden">Vital Sphere</h2>
            </div>
              <UserMenuItem userData={userData} />
              <MenuList setActive={setActiveTab} activeTab={activeTab} training={training}
                  setLogOutConfirm={setLogOutConfirm} setShowDrawer={null} />
          </section>
          <NavDrawer userData={userData} setActiveTab={setActiveTab} activeTab={activeTab} 
            training={training} setLogOutConfirm={setLogOutConfirm} showDrawer={showDrawer} setShowDrawer={setShowDrawer}/>
          <section className="w-full min-h-screen bg-base-200">
              <header className="flex flex-row justify-between items-center p-4 shadow-sm shadow-gray-200 w-full h-16">
                  <div className="flex flex-row w-auto gap-1">
                    <GiHamburgerMenu className="text-primary text-lg mt-1 min-md:hidden cursor-pointer" onClick={() => setShowDrawer(true)} />
                    <h2 className="font-bold text-xl ms-3 text-primary">{TabList[activeTab].name}</h2>
                  </div>
                  <div className="flex flex-row gap-4 items-center">
                    <span className="text-2xl text-gray-600"><IoIosNotifications /></span>
                    <Image src="/images/default_user.jpg" alt="User Profile" width={40} height={40}
                      className="rounded-[50%]" />
                  </div>
              </header>
              {getActiveTab()}
          </section>
          {isLoading && <div className="fixed top-0 bottom-0 w-screen h-screen grid place-content-center z-60 bg-[rgba(0,0,0,0.5)]">
                    <div className={`loading loading-spinner loading-xl text-primary mb-4`}></div>
                </div>}
          {logOutConfirm && <LogOutConfirm setLogOutConfirm={setLogOutConfirm} />}
      </main>
      <p className={clsx(errorClassName, 'duration-300 transition-all z-60')}>{error.msg}</p>
    </ProtectedRoute>
  )
}

export default page