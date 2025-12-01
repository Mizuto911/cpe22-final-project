'use client'
import { useEffect, useState } from "react"
import { UserData } from "@/app/modules/DataTypes"
import { FaHeart, FaTemperatureLow, FaShieldAlt, FaBluetooth } from "react-icons/fa"
import { getMeasurementData, getFatigueData } from "@/app/modules/DataFetching"
import { Tabs, MeasurementResponseData, FatigueResponseData } from "@/app/modules/DataTypes"
import { LineChart, BarChart, axisClasses } from "@mui/x-charts"
import clsx from "clsx"

interface DashboardProps {
  userData: UserData
  setActive: Function
  device: BluetoothDevice | null
  setLoading: Function
}

const Dashboard = (props: DashboardProps) => {

  const [measurement, setMeasurement] = useState<MeasurementResponseData | null>(null);
  const [fatigueData, setFatigueData] = useState<FatigueResponseData | null>(null);

  const deviceStatus = props.device ? 'Online' : 'Offline';
  const deviceCardClassName = clsx(
    'w-[250px] max-lg:w-full h-auto p-4 rounded-xl flex flex-col justify-between',
    props.device ? 'bg-success' : 'bg-error'
  );

  useEffect(() => {
    async function measurementFetch() {
      props.setLoading(true);
      setMeasurement(await getMeasurementData());
      setFatigueData(await getFatigueData());
      props.setLoading(false);
    }
    measurementFetch();
  }, []);

  const heartRateData = measurement?.data.map(data => data.bpm) ?? [];
  const temperatureData = measurement?.data.map(data => data.temperature) ?? [];
  const xLabels = Array.from({ length: measurement?.data.length ?? 0}, (_, i) => i);

  return (
    <section className="p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <h2 className="text-[clamp(1.8rem,3vw,2.25rem)] font-bold">Welcome, {props.userData.name}!</h2>
      <div className="flex flex-row flex-wrap gap-5 justify-center mt-12 mb-8 max-lg:flex-col max-lg:items-center">

        <div className="flex flex-row flex-nowrap gap-5 max-lg:flex-col max-lg:items-center max-lg:w-full">
          <section className="bg-primary w-[250px] max-lg:w-full h-auto p-4 rounded-xl">
            <div className="flex flex-row justify-between">
              <h3 className="text-md font-bold text-white">Heart Rate</h3>
              <FaHeart className="text-lg font-bold text-white mt-0.5" />
            </div>
            <p className="text-2xl font-bold text-white mt-6">{measurement ? `${measurement.average.bpm} BPM`: 'No Records'}</p>
            <p className="text-sm text-white">Average Heart Rate </p>
          </section>

          <section className="bg-secondary w-[250px] max-lg:w-full h-auto p-4 rounded-xl">
            <div className="flex flex-row justify-between">
              <h3 className="text-md font-bold text-white">Body Temperature</h3>
              <FaTemperatureLow className="text-lg font-bold text-white mt-0.5" />
            </div>
            <p className="text-2xl font-bold text-white mt-6">{measurement ? `${measurement.average.temperature}°C`: 'No Records'} </p>
            <p className="text-sm text-white">Average Temperature </p>
          </section>
        </div>

        <div className="flex flex-row flex-nowrap gap-5 max-lg:flex-col max-lg:items-center max-lg:w-full">
          <section className="bg-accent w-[250px] max-lg:w-full h-auto p-4 rounded-xl">
            <div className="flex flex-row justify-between">
              <h3 className="text-md font-bold text-white">Assessment</h3>
              <FaShieldAlt className="text-lg font-bold text-white mt-0.5" />
            </div>
            <p className="text-2xl font-bold text-white mt-6 uppercase">Ready for Training</p>
            <p className="text-sm text-white">Based on Current Data</p>
          </section>

          <section className={deviceCardClassName}>
            <div className="flex flex-row justify-between">
              <h3 className="text-md font-bold text-white">Device Status</h3>
              <FaBluetooth className="text-lg font-bold text-white mt-0.5" />
            </div>
            <p className="text-2xl font-bold text-white mt-6 uppercase">{deviceStatus}</p>
            {props.device ? <p className="text-lg text-white leading-tight font-bold"><span className="text-sm font-normal">Device Name:</span><br/>
                  {props.device.name}</p> : 
              <button className="btn rounded-xl" onClick={() => props.setActive(Tabs.CONNECT_DEVICE)}>Connect Device</button>}
          </section>
        </div>

      </div>

      <section className="flex flex-col flex-wrap gap-5 justify-center mt-16 mb-8">
        <div className="w-full h-auto bg-base-100 shadow-2xl rounded-xl p-6">
          <label htmlFor="heart_rate" className="font-bold text-lg">Heart Rate Trends</label>
          <LineChart
            id="heart_rate"
            xAxis={[{data: xLabels}]}
            experimentalFeatures={{preferStrictDomainInLineCharts: true}}
            yAxis={[{width: 30}]}
            grid={{horizontal: true}}
            series={[
              {
                data: heartRateData,
                area: true,
                showMark: false,
                color: '#422ad5'
              },
            ]}
            height={300}
            sx={{
              '& .MuiAreaElement-root': {
                opacity: '0.5'
              },
              [`.${axisClasses.tick}`]: {
                display: 'none'
              },
              [`.${axisClasses.line}`]: {
                stroke: 'lightgray'
              },
              [`.${axisClasses.tickLabel}`]: {
                fill: '#808080'
              }
            }}/>
        </div>

        <div className="w-full h-auto bg-base-100 shadow-2xl rounded-xl p-6">
          <label htmlFor="body_temp" className="font-bold text-lg">Body Temperature Trends</label>
          <LineChart
            id="body_temp"
            xAxis={[{data: xLabels}]}
            experimentalFeatures={{preferStrictDomainInLineCharts: true}}
            yAxis={[{width: 30}]}
            grid={{horizontal: true}}
            series={[
              {
                data: temperatureData,
                area: true,
                showMark: false,
                color: '#f43098'
              },
            ]}
            height={300}
            sx={{
              '& .MuiAreaElement-root': {
                opacity: '0.5'
              },
              [`.${axisClasses.tick}`]: {
                display: 'none'
              },
              [`.${axisClasses.line}`]: {
                stroke: 'lightgray'
              },
              [`.${axisClasses.tickLabel}`]: {
                fill: '#808080'
              }
            }}/>
        </div>

        <div className="w-full h-auto bg-base-100 shadow-2xl rounded-xl p-6">
          <label htmlFor="body_temp" className="font-bold text-lg">Body Temperature Trends</label>
          <BarChart
            xAxis={[{data: ['Resting Heart Rate', 'Heart Rate Recovery', 'Training Time (Hours)']}]}
            series={[{
              data: [fatigueData?.average.rhh ?? null, fatigueData?.average.hrr ?? null, fatigueData?.average.train_time ?? null],
              color: '#00d3bb',
              minBarSize: 40
            }]}
            height={300}
          />
        </div>
      </section>
    </section>
  )
}

export default Dashboard