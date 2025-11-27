'use client'
import { MdBluetoothDisabled } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import { Tabs, TrainingState } from "@/app/modules/DataTypes";
import { startMonitoring, stopMonitoring, changeTrainingState, 
  uploadMeasurement, uploadFatigueData, decodeBluetoothData, getTimerDisplay } from "@/app/modules/UtilityModules";
import clsx from "clsx";
import style from '../Forms.module.css';

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
  const [bpmContent, setBpmContent] = useState<number | null>(null);
  const [tempContent, setTempContent] = useState<number | null>(null);
  const [rhhContent, setRhhContent] = useState<number | null>(null);
  const [hrrContent, setHrrContent] = useState<number | null>(null);
  const [totalTrainingTime, setTotalTrainingTime] = useState(0);
  const [overworked, setOverworked] = useState<boolean | null>(null);
  const [fatigueRisk, setFatigueRisk] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [timer, setTimer] = useState(30);
  const [analyzing, setAnalyzing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const trainingTimeContent = trainingState === TrainingState.TRAINING ? getTimerDisplay(timer) : getTimerDisplay(totalTrainingTime);
  const summaryTimeContent = props.training ? '00:00:00' : getTimerDisplay(totalTrainingTime);

  useEffect(() => {
    props.monitorData?.addEventListener('characteristicvaluechanged', handleMonitorNotifs);
    props.summaryData?.addEventListener('characteristicvaluechanged', handleSummaryNotifs);

    return () => {
      props.monitorData?.removeEventListener('characteristicvaluechanged', handleMonitorNotifs);
      props.summaryData?.removeEventListener('characteristicvaluechanged', handleSummaryNotifs);
    }
  }, [props.monitorData, props.summaryData]);

  useEffect(() => {
    const removeInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    const startCountdown = () => {
      if (intervalRef.current) {
        removeInterval();
      }
      intervalRef.current = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    }

    const startTrainingTimer = () => {
      if (intervalRef.current) {
        removeInterval();
      }
      intervalRef.current = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }

    switch (trainingState) {

      case TrainingState.MEASURING_REST:
      case TrainingState.HR_RECOVERY_WAIT:
      case TrainingState.MEASURING_HR_RECOVERY:
        startCountdown();
        break;

      case TrainingState.TRAINING:
        startTrainingTimer();
        break;

      case TrainingState.STOPPED:
        removeInterval();
        break;
    }

    return () => removeInterval();

  }, [trainingState]);

  function getTrainingContent() {
    switch (trainingState) {

      case TrainingState.IDLE:
        return 'Bluetooth device is connected. You may start your training session.';

      case TrainingState.MEASURING_REST:
        if (timer <= 0) {
          setTimer(0);
          setTrainingState(TrainingState.TRAINING);
        }
        return `Measuring your Resting Heart Rate, Please wait ${timer} seconds.`;

      case TrainingState.TRAINING:
        return <>
          Training Started. Live Data of your Vitals will be updated in real time.&nbsp;
          <span className="loading loading-spinner text-primary"></span>
        </>;

      case TrainingState.HR_RECOVERY_WAIT:
        if (timer <= 0) {
          setTimer(30);
          setTrainingState(TrainingState.MEASURING_HR_RECOVERY);
        }
        return `Rest for ${timer} seconds. We will measure your Heart Rate Recovery.`;

      case TrainingState.MEASURING_HR_RECOVERY:
        if (timer <= 0) {
          setTimer(30);
        }
        return <>
          Measuring your Heart Rate Recovery. Please wait {timer} seconds.&nbsp;
          <span className="loading loading-spinner text-primary"></span>
        </>;

      case TrainingState.STOPPED:
        return 'Training Session Complete. The following are the Results.';
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
        console.log('Subscribed to Summary Notifications');
      }
        
      if(props.commandSend){
        await changeTrainingState(props.commandSend, 'START');
        console.log('Start Command Sent');
      }
    }
    else if (trainingState === TrainingState.TRAINING) {
      if (props.commandSend) {
        setTotalTrainingTime(timer);
        setTimer(60);
        await changeTrainingState(props.commandSend, 'STOP');
        console.log('Stop Command Sent');
        setTrainingState(TrainingState.HR_RECOVERY_WAIT);
      }   
    }
  }

  async function handleMonitorNotifs(event: Event) {

    const data = decodeBluetoothData(event.target as BluetoothRemoteGATTCharacteristic);

    if (data.resting_bpm) {
      setTrainingState(TrainingState.TRAINING);
    }
    else {
      const assessment = await uploadMeasurement({bpm: data.bpm, temperature: data.temp_c});
      setBpmContent(data.bpm);
      setTempContent(data.temp_c);
      if (!assessment || !assessment.ok) {
        showError('There was a Problem uploading the Data');
        return;
      }
      setOverworked(assessment.overworked);
    }
  }

  async function handleSummaryNotifs(event: Event) {
    
    const data = decodeBluetoothData(event.target as BluetoothRemoteGATTCharacteristic);
    console.log(data);

    setRhhContent(data.summary.resting_hr);
    setHrrContent(data.summary.recovery);

    setAnalyzing(true);
    const assessment = await uploadFatigueData({
      train_time: data.summary.training_s / 3600,
      rhh: data.summary.resting_hr,
      hrr: data.summary.recovery
    });
    setAnalyzing(false);

    if (!assessment || !assessment.ok) {
        showError('There was a Problem uploading the Data');
        return;
    }

    setFatigueRisk(assessment.fatigue_risk);
    setTrainingState(TrainingState.STOPPED);
    props.setTraining(false);

    setTimeout(() => {
      setTrainingState(TrainingState.IDLE);
    }, 5000);

    if (props.monitorData) {
      await stopMonitoring(props.monitorData);
      console.log('Unsubscribed from Monitor Notifications.');
    } 

    if (props.summaryData) {
      await stopMonitoring(props.summaryData);
      console.log('Unsubscribed from Summary Notifications');
    }
  }

  function getButtonState() {
    switch (trainingState) {
      case TrainingState.IDLE:
      case TrainingState.STOPPED:
        return 'btn-info';
      case TrainingState.MEASURING_REST:
        return 'btn-info opacity-50';
      case TrainingState.TRAINING:
        return 'btn-error';
      case TrainingState.HR_RECOVERY_WAIT:
      case TrainingState.MEASURING_HR_RECOVERY:
        return 'btn-error opacity-50';
    }
  }

  function getButtonContent() {
    switch (trainingState) {
      case TrainingState.IDLE:
      case TrainingState.STOPPED:
      case TrainingState.MEASURING_REST:
        return 'Start Training Session';
      case TrainingState.TRAINING:
      case TrainingState.HR_RECOVERY_WAIT:
      case TrainingState.MEASURING_HR_RECOVERY:
        return 'Stop Training Session';
    }
  }

  function showError(errorMessage: string) {
    setErrorMessage(errorMessage);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }

  return (
    <section className='p-8 flex flex-col items-center max-h-[calc(100vh-4rem)] overflow-y-auto'>

      {props.device ? 
        <>
          <p className='w-full mb-8 text-[clamp(1rem,1.5vw,1.25rem)]'>{getTrainingContent()}</p>

          <section className='w-full flex flex-row gap-5 justify-evenly mt-16 max-lg:flex-col max-lg:items-center max-lg:mt-8'>
            <article className='w-[30%] min-w-[300px] max-w-[400px] bg-base-200 shadow-xl rounded-xl border-gray-200 border-1 max-lg:w-full max-lg:max-w-none'>
              <h2 className='text-secondary text-xl font-bold text-center p-2 border-b-secondary border-b-2'>Live</h2>
              <ul className='mt-5 mb-8'>
                <li className='flex flex-row justify-between px-6 mb-2'>
                  <span className='text-xl'>Heart Rate:</span>
                  <span className='text-xl text-secondary'>{bpmContent !== null ? bpmContent : '--'} BPM</span>
                </li>
                <li className='flex flex-row justify-between px-6 mb-2'>
                  <span className='text-xl'>Body Temperature:</span>
                  <span className='text-xl text-secondary'>{tempContent !== null ? tempContent : '--'}&deg;C</span>
                </li>
                <li className='flex flex-row justify-between px-6 mb-2'>
                  <span className='text-xl'>Training Time:</span>
                  <span className='text-xl text-secondary'>{trainingTimeContent}</span>
                </li>
              </ul>
              <p className='text-lg text-start mb-5 px-6 flex flex-row justify-between'>
                <span>Assessment:</span> 
                <span className={clsx('font-bold', overworked === null ? 'text-black' : overworked ? 'text-error' : 'text-success')}>
                  {overworked === null ? '----' : overworked ? 'OVERWORKED' : 'NORMAL'}
                </span>
              </p>
            </article>

            <article className='w-[30%] min-w-[300px] max-w-[400px] bg-base-200 shadow-xl rounded-xl border-gray-200 border-1 max-lg:w-full max-lg:max-w-none'>
              <h2 className='text-accent text-xl font-bold text-center p-2 border-b-accent border-b-2'>Session Summary</h2>
              <ul className='mt-5 mb-8'>
                <li className='flex flex-row justify-between px-6 mb-2'>
                  <span className='text-xl'>Training Time:</span>
                  <span className='text-xl text-accent'>{summaryTimeContent}</span>
                </li>
                <li className='flex flex-row justify-between px-6 mb-2'>
                  <span className='text-xl'>Resting Heart Rate:</span>
                  <span className='text-xl text-accent'>{rhhContent !== null ? rhhContent : '--'} BPM</span>
                </li>
                <li className='flex flex-row justify-between px-6 mb-2'>
                  <span className='text-xl'>Heart Rate Recovery:</span>
                  <span className='text-xl text-accent'>{hrrContent !== null ? hrrContent : '--'} BPM</span>
                </li>
              </ul>
              <p className='text-lg text-start mb-5 px-6 flex flex-row justify-between'>
                <span>Fatigue Risk:</span> 
                <span className={clsx('font-bold', fatigueRisk === null ? 'text-black' : fatigueRisk ? 'text-error' : 'text-success')}>
                    {analyzing ? <span className="loading loading-spinner text-primary"></span> : 
                      fatigueRisk === null ? '----' : fatigueRisk ? 'DETECTED' : 'NONE'}
                </span>
              </p>
            </article>

          </section>

          <button className={clsx('btn mt-15 rounded-lg', getButtonState())} 
              onClick={handleTraining}>{getButtonContent()}</button>
        </> :
        <div className="w-full h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
          <MdBluetoothDisabled className="text-gray-400 text-[clamp(10rem,20vw,15rem)]" />
          <p className='mb-8 text-gray-500 text-[clamp(1rem,1.5vw,1.2rem)]'>
            No Device Currently Connected.
          </p>
          <button className='btn btn-outline btn-success rounded-lg' onClick={() => props.setActive(Tabs.CONNECT_DEVICE)}>Connect Device</button>
        </div>
      }
      {errorMessage && <p className={`p-4 fixed bottom-8 bg-error rounded-xl text-error-content font-bold mb-4 ${style.errorEnter}`}>{errorMessage}</p>}
    </section>
  )
}

export default TrainingSession