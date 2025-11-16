'use client'

import Image from "next/image"
import { RiRestartFill } from "react-icons/ri";
import { MdCancel } from "react-icons/md";

const DeviceConnect = () => {
  return (
    <div className="p-8 flex flex-col items-center gap-20 w-full">
        <h1 className="font-bold text-4xl w-full">Connect Device</h1>
        <section className="p-5 rounded-xl flex flex-col justify-center items-center 
                            min-h-[150px] gap-4 shadow-xl bg-base-100">
            <h2 className=" font-bold">Insert ESP32 device to connect...</h2>
            <button className="btn btn-primary rounded-md">Connect</button>
        </section>

        <section className="flex flex-row justify-center gap-12 mt-[-2rem]">
            <button className="btn btn-soft btn-error rounded-md"><span className="text-xl"><MdCancel/></span> Cancel</button>
            <button className="btn btn-soft btn-success rounded-md"><span className="text-xl"><RiRestartFill /></span> Retry</button>
        </section>
    </div>
  )
}

export default DeviceConnect