import React from 'react'

const TrainingSession = () => {
  return (
    <section className='p-8 flex flex-col items-center max-h-[calc(100vh-4rem)] overflow-y-auto'>
      <p className='w-full mb-8 text-[clamp(1rem,1.5vw,1.25rem)]'>Your training session has started, Live Data from your device is now being monitored.</p>
      <section className='w-full flex flex-row gap-5 justify-evenly mt-16 max-lg:flex-col max-lg:items-center max-lg:mt-8'>
        <article className='w-[30%] min-w-[300px] max-w-[400px] bg-base-200 shadow-xl rounded-xl border-gray-200 border-1 max-lg:w-full max-lg:max-w-none'>
          <h2 className='text-secondary text-xl font-bold text-center p-2 border-b-secondary border-b-2'>Live</h2>
          <ul className='mt-5 mb-8'>
            <li className='flex flex-row justify-between px-6 mb-2'>
              <span className='text-xl'>Heart Rate:</span>
              <span className='text-xl text-secondary'>142 BPM</span>
            </li>
            <li className='flex flex-row justify-between px-6 mb-2'>
              <span className='text-xl'>Body Temperature:</span>
              <span className='text-xl text-secondary'>37.3&deg;C</span>
            </li>
            <li className='flex flex-row justify-between px-6 mb-2'>
              <span className='text-xl'>Training Time:</span>
              <span className='text-xl text-secondary'>00:24:30</span>
            </li>
          </ul>
          <p className='text-lg text-center mb-5'>All readings are updated<br/>in real time.</p>
        </article>

        <article className='w-[30%] min-w-[300px] max-w-[400px] bg-base-200 shadow-xl rounded-xl border-gray-200 border-1 max-lg:w-full max-lg:max-w-none'>
          <h2 className='text-accent text-xl font-bold text-center p-2 border-b-accent border-b-2'>Session Summary</h2>
          <ul className='mt-5 mb-8'>
            <li className='flex flex-row justify-between px-6 mb-2'>
              <span className='text-xl'>Training Time:</span>
              <span className='text-xl text-accent'>07:20:12</span>
            </li>
            <li className='flex flex-row justify-between px-6 mb-2'>
              <span className='text-xl'>Max Heart Rate:</span>
              <span className='text-xl text-accent'>600 BPM</span>
            </li>
            <li className='flex flex-row justify-between px-6 mb-2'>
              <span className='text-xl'>Body Temp Range:</span>
              <span className='text-xl text-accent'>37.2-37.9&deg;C</span>
            </li>
          </ul>
          <p className='text-lg text-center mb-5'>All readings are updated<br/>in real time.</p>
        </article>
      </section>
      <button className='btn btn-info mt-15 rounded-lg'>Start Training Session</button>
    </section>
  )
}

export default TrainingSession