'use client'
import { RiRestartFill } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import { requestDevice, connectDevice } from '@/app/modules/UtilityModules'

interface DeviceConnectProps {
  hasBluetooth: boolean
  device: BluetoothDevice | null
  setDevice: Function
  setLoading: Function
  setHeartRateChar: Function
  setBodyTempChar: Function
}

const DeviceConnect = (props: DeviceConnectProps) => {

  async function handleConnect() {
    const device = await requestDevice();
    const chars = await connectDevice(device);
    props.setDevice(device);
    props.setHeartRateChar(chars?.heartRate);
    props.setBodyTempChar(chars?.bodyTemp);
  }

  return (
    <div className="p-8 flex flex-col items-center gap-20 w-full">
        <p className="text-xl w-full">Connect your Monitoring Device through Bluetooth.</p>
        <section className="p-5 rounded-xl flex flex-col justify-center items-center 
                            w-[50%] min-w-[250px] max-w-[1000px] h-[250px] gap-4 shadow-xl bg-base-100">
            <h2 className=" font-bold text-center text-[clamp(1rem,1.5vw,1.3rem)]">Select Monitoring device to connect...</h2>
            <button className="btn btn-primary rounded-md" onClick={handleConnect}>Connect</button>
        </section>

        <section className="flex flex-row justify-center gap-12 mt-[-2rem]">
            <button className="btn btn-soft btn-error rounded-md"><span className="text-xl"><MdCancel/></span> Cancel</button>
            <button className="btn btn-soft btn-success rounded-md"><span className="text-xl"><RiRestartFill /></span> Retry</button>
        </section>

        {!props.hasBluetooth && <p className="text-error-content p-4 bg-error rounded-xl font-bold">
          ⚠️ This Browser doesn't support the Web Bluetooth API, Please Try a different Browser.
          </p>}
    </div>
  )
}

export default DeviceConnect