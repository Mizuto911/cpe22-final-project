import DeviceConnect from "./DeviceConnect"
import Image from "next/image"
import { IoIosNotifications } from "react-icons/io";

const page = () => {
  return (
    <main className="flex flex-row max-w-screen">
        <section className="bg-primary-content w-[450px] h-screen rounded-tr-2xl rounded-br-2xl shadow-xl">
           <div className="flex flex-row gap-3 items-center p-4.5">
                <Image src="/images/app_logo.png" alt="Vital Sphere Logo" width={64} height={64} /> 
                <h2 className="font-bold text-2xl text-primary">Vital Sphere</h2>
            </div> 
        </section>
        <section className="w-full h-screen bg-base-200">
             <header className="flex flex-row justify-between items-center p-4 shadow-sm shadow-gray-200 w-full">
                <h2 className="font-bold text-lg ms-3 text-primary">Welcome John!</h2>
                <div className="flex flex-row gap-4 items-center">
                    <span className="text-2xl text-gray-600"><IoIosNotifications /></span>
                    <Image src="/images/default_user.jpg" alt="User Profile" width={40} height={40}
                        className="rounded-[50%]" />
                </div>
            </header>
            <DeviceConnect />
        </section>
    </main>
  )
}

export default page