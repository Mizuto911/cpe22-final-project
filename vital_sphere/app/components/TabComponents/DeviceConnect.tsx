'use client'
import { RiRestartFill } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import { useState } from 'react';
import { requestDevice, connectDevice, disconnectDevice } from '@/app/modules/UtilityModules';
import { Tabs } from "@/app/modules/DataTypes";
import clsx from "clsx";

interface DeviceConnectProps {
  hasBluetooth: boolean
  device: BluetoothDevice | null
  setDevice: Function
  setMonitorData: Function
  setCommandSend: Function
  setSummaryData: Function
  setActive: Function
  showErrorMessage: Function
}

const DeviceConnect = (props: DeviceConnectProps) => {
  const [connecting, setConnecting] = useState(false);

  const cardText = props.device ? `Device Connected: ${props.device.name}` : 'Select Monitoring device to connect...';
  const buttonText = props.device ? 'Start Training' : 
      connecting ? <><span className="loading loading-spinner text-primary-content"></span>Connecting</> : "Connect";
  const buttonClassName = clsx('rounded-md btn', props.device ? 'btn-success' : 'btn-primary');

  async function handleConnect() {
    if (props.device) {
      props.setActive(Tabs.TRAINING_SESSION);
    }
    else {
      setConnecting(true);
      try {
        const device = await requestDevice(props.setDevice);
        const chars = await connectDevice(device);
        props.setDevice(device);
        props.setMonitorData(chars?.monitor);
        props.setCommandSend(chars?.command);
        props.setSummaryData(chars?.summary);
      }
      catch (e) {
        if (e instanceof Error)
          props.showErrorMessage(e.message, false);
        else
          props.showErrorMessage(String(e), false);
      }
      finally {
        setConnecting(false);
      }
    }
  }

  function handleDisconnect() {
    if(props.device)
      disconnectDevice(props.device, props.setDevice);
  }

  return (
    <div className="p-8 flex flex-col items-center gap-20 w-full">
        <p className="text-xl w-full">Connect your Monitoring Device through Bluetooth.</p>
        <section className="p-5 rounded-xl flex flex-col justify-center items-center 
                            w-[50%] min-w-[250px] max-w-[1000px] h-[250px] gap-4 shadow-xl bg-base-100">
            <h2 className=" font-bold text-center text-[clamp(1rem,1.5vw,1.3rem)]">{cardText}</h2>
            <div className="flex flex-row flex-wrap gap-4 justify-center">
              <button className={buttonClassName} onClick={handleConnect}>{buttonText}</button>
              {props.device ? <button className='btn btn-error rounded-md' 
                  onClick={handleDisconnect}>Disconnect</button> : null}
            </div>
        </section>

        {!props.hasBluetooth && <p className="text-error-content p-4 bg-error rounded-xl font-bold">
          ⚠️ This Browser doesn't support the Web Bluetooth API, Please Try a different Browser.
          </p>}
    </div>
  )
}

export default DeviceConnect