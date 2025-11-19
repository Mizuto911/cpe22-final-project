'use client'
import { MdBluetoothDisabled } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import { Tabs, TrainingState } from "@/app/modules/DataTypes";
import { startMonitoring, stopMonitoring, changeTrainingState } from "@/app/modules/UtilityModules";
import clsx from "clsx";

interface TrainingSessionProps {
  device: BluetoothDevice | null
  monitorData: BluetoothRemoteGATTCharacteristic | null
  commandSend: BluetoothRemoteGATTCharacteristic | null
  summaryData: BluetoothRemoteGATTCharacteristic | null
  setActive: Function
  training: boolean
  setTraining: Function
}

const TrainingSession = (props: TrainingSessionProps) => {

  const [trainingState, setTrainingState] = useState(TrainingState.IDLE);
  const [bpmContent, setBpmContent] = useState(0);
  const [tempContent, setTempContent] = useState(0);
  const [timer, setTimer] = useState(30);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const indicatorContent = props.training ? getTrainingContent() : 'Bluetooth device is connected. You may start your training session.'

  const buttonContent = props.training ? 'Stop Training Session' : 'Start Training Session';
  const buttonClassName = clsx('btn mt-15 rounded-lg', props.training ? 'btn-error' : 'btn-info');

  useEffect(() => {
    if (props.monitorData)
      props.monitorData.addEventListener('characteristicvaluechanged', handleMonitorNotifs);
  
  }, [props.monitorData, props.summaryData])

  useEffect(() => {
    const removeInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    if (trainingState === TrainingState.MEASURING_REST) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    }
    else if (trainingState === TrainingState.TRAINING) {
      removeInterval();
    }

    return () => {
      removeInterval();
    };
  }, [trainingState]);

  function getTrainingContent() {
    switch (trainingState) {

      case TrainingState.IDLE:
        return 'Bluetooth device is connected. You may start your training session.';

      case TrainingState.MEASURING_REST:
        if (timer <= 0) {
          setTimer(60);
          setTrainingState(TrainingState.TRAINING);
        }
        return `Measuring your Resting Heart Rate, Please wait ${timer} seconds.`;

      case TrainingState.TRAINING:
        return <>
          Training Started. Live Data of your Vitals will be updated every 10 seconds.&nbsp;
          <span className="loading loading-spinner text-primary"></span>
        </>;
    }
  }

  async function handleTraining() {
    if (trainingState === TrainingState.IDLE) {
      props.setTraining(true);
      setTrainingState(TrainingState.MEASURING_REST);

      if (props.monitorData){
        await startMonitoring(props.monitorData);
        console.log('Subscribed to Monitor Notifications');
      }

      if (props.summaryData){
        await startMonitoring(props.summaryData);
        console.log('Subscribed to Monitor Notifications');
      }
        
      if(props.commandSend){
        await changeTrainingState(props.commandSend, 'START');
        console.log('Start Command Sent');
      }
    }
  }

  function handleMonitorNotifs(event: Event) {
    const decoder = new TextDecoder();
    const char = event.target as BluetoothRemoteGATTCharacteristic | null;
    const value = char?.value;
    
    console.log(value);
    
    if (!value) return;

    const dataArray = new Uint8Array(value?.buffer);
    const dataString = decoder.decode(dataArray);

    try {
      const dataObj = JSON.parse(dataString);
      setBpmContent(dataObj.bpm);
      setTempContent(dataObj.temp_c);
    }
    catch (e) {
      console.log(`Error Parsing Data: ${e}`)
    }
  }

  return (
    <section className='p-8 flex flex-col items-center max-h-[calc(100vh-4rem)] overflow-y-auto'>

      {props.device ? 
        <>
          <p className='w-full mb-8 text-[clamp(1rem,1.5vw,1.25rem)]'>{indicatorContent}</p>

          <section className='w-full flex flex-row gap-5 justify-evenly mt-16 max-lg:flex-col max-lg:items-center max-lg:mt-8'>
            <article className='w-[30%] min-w-[300px] max-w-[400px] bg-base-200 shadow-xl rounded-xl border-gray-200 border-1 max-lg:w-full max-lg:max-w-none'>
              <h2 className='text-secondary text-xl font-bold text-center p-2 border-b-secondary border-b-2'>Live</h2>
              <ul className='mt-5 mb-8'>
                <li className='flex flex-row justify-between px-6 mb-2'>
                  <span className='text-xl'>Heart Rate:</span>
                  <span className='text-xl text-secondary'>{bpmContent} BPM</span>
                </li>
                <li className='flex flex-row justify-between px-6 mb-2'>
                  <span className='text-xl'>Body Temperature:</span>
                  <span className='text-xl text-secondary'>{tempContent}&deg;C</span>
                </li>
                <li className='flex flex-row justify-between px-6 mb-2'>
                  <span className='text-xl'>Training Time:</span>
                  <span className='text-xl text-secondary'>00:00:00</span>
                </li>
              </ul>
              <p className='text-lg text-center mb-5'>All readings are updated<br/>in real time.</p>
            </article>

            <article className='w-[30%] min-w-[300px] max-w-[400px] bg-base-200 shadow-xl rounded-xl border-gray-200 border-1 max-lg:w-full max-lg:max-w-none'>
              <h2 className='text-accent text-xl font-bold text-center p-2 border-b-accent border-b-2'>Session Summary</h2>
              <ul className='mt-5 mb-8'>
                <li className='flex flex-row justify-between px-6 mb-2'>
                  <span className='text-xl'>Training Time:</span>
                  <span className='text-xl text-accent'>00:00:00</span>
                </li>
                <li className='flex flex-row justify-between px-6 mb-2'>
                  <span className='text-xl'>Max Heart Rate:</span>
                  <span className='text-xl text-accent'>0 BPM</span>
                </li>
                <li className='flex flex-row justify-between px-6 mb-2'>
                  <span className='text-xl'>Body Temp Range:</span>
                  <span className='text-xl text-accent'>0&deg;C</span>
                </li>
              </ul>
              <p className='text-lg text-center mb-5'>All readings are updated<br/>in real time.</p>
            </article>

          </section>

          <button className={buttonClassName} onClick={handleTraining}>{buttonContent}</button>
        </> :
        <div className="w-full h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
          <MdBluetoothDisabled className="text-gray-400 text-[clamp(10rem,20vw,15rem)]" />
          <p className='mb-8 text-gray-500 text-[clamp(1rem,1.5vw,1.2rem)]'>
            No Device Currently Connected.
          </p>
          <button className='btn btn-outline btn-success rounded-lg' onClick={() => props.setActive(Tabs.CONNECT_DEVICE)}>Connect Device</button>
        </div>
      }

    </section>
  )
}

export default TrainingSession