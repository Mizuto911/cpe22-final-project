'use client'
import { useEffect } from "react"
import Image from "next/image"
import { UserData } from "@/app/modules/DataTypes"
import { FaHeart, FaTemperatureLow, FaShieldAlt, FaBluetooth } from "react-icons/fa"
import { Tabs } from "@/app/modules/DataTypes"

interface DashboardProps {
  userData: UserData
  setActive: Function
}

const Dashboard = (props: DashboardProps) => {
  return (
    <section className="p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <h2 className="text-4xl font-bold">Welcome, {props.userData.name}!</h2>
      <div className="flex flex-row gap-5 justify-center mt-12 mb-8 max-lg:flex-col max-lg:items-center">

        <div className="bg-primary w-[250px] max-lg:w-full h-auto p-4 rounded-xl">
          <div className="flex flex-row justify-between">
            <h3 className="text-md font-bold text-white">Heart Rate</h3>
            <FaHeart className="text-lg font-bold text-white mt-0.5" />
          </div>
          <p className="text-2xl font-bold text-white mt-6">75 BPM </p>
          <p className="text-sm text-white">Average Heart Rate </p>
        </div>

        <div className="bg-secondary w-[250px] max-lg:w-full h-auto p-4 rounded-xl">
          <div className="flex flex-row justify-between">
            <h3 className="text-md font-bold text-white">Body Temperature</h3>
            <FaTemperatureLow className="text-lg font-bold text-white mt-0.5" />
          </div>
          <p className="text-2xl font-bold text-white mt-6">36.5&deg;C </p>
          <p className="text-sm text-white">Average Temperature </p>
        </div>

        <div className="bg-accent w-[250px] max-lg:w-full h-auto p-4 rounded-xl">
          <div className="flex flex-row justify-between">
            <h3 className="text-md font-bold text-white">Assessment</h3>
            <FaShieldAlt className="text-lg font-bold text-white mt-0.5" />
          </div>
          <p className="text-2xl font-bold text-white mt-6 uppercase">Ready for Training</p>
          <p className="text-sm text-white">Based on Current Data</p>
        </div>

        <div className="bg-error w-[250px] max-lg:w-full h-auto p-4 rounded-xl flex flex-col justify-between">
          <div className="flex flex-row justify-between">
            <h3 className="text-md font-bold text-white">Device Status</h3>
            <FaBluetooth className="text-lg font-bold text-white mt-0.5" />
          </div>
          <p className="text-2xl font-bold text-white mt-6 uppercase">Offline</p>
          <button className="btn rounded-xl" onClick={() => props.setActive(Tabs.CONNECT_DEVICE)}>Connect Device</button>
        </div>

      </div>

      <div className="flex flex-row gap-5 justify-center mt-12 mb-8">
        <Image src={'/images/graph-placeholder.png'} alt='Graph Photo' width={800} height={300} />
      </div>
    </section>
  )
}

export default Dashboard