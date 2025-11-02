'use client'
import { useState, useEffect, FormEvent } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

const RegistrationForm = () => {

    const [birthDay, setBirthDay] = useState<Date>();
    const [isFemale, setFemale] = useState(false);

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
    }

    return(
        <form onSubmit={onSubmit} autoComplete="off" className="flex flex-col justify-start items-center gap-4">
            <input type="text" name="username" placeholder="Enter User Name"
                className="input input-primary w-full max-w-[500px] text-[1rem] py-5 mt-5" />
            <input type="password" name="password" placeholder="Password"
                className="input input-primary w-full max-w-[500px] text-[1rem] py-5" />
            <section className="w-full max-w-[500px] flex flex-col items-center gap-2">
                <label htmlFor="birthday"
                    className="font-bold w-full text-start"
                >Date of Birth: </label>
                <DayPicker
                    className="react-day-picker"
                    captionLayout="dropdown-years"
                    mode="single"
                    selected={birthDay}
                    onSelect={setBirthDay}
                    endMonth={new Date()}
                    disabled={{after: new Date()}}
                    footer={
                        birthDay ? `Selected: ${birthDay.toLocaleDateString('en-US')}` : "Pick a day."
                    }
                />
            </section>
            <section className="w-full max-w-[500px] flex flex-col items-center gap-2">
                <label htmlFor="birthday"
                    className="font-bold w-full text-start"
                >Gender: </label>
                <div className="flex gap-8">
                    <div className={`px-5 py-3 rounded-2xl duration-300 ${!isFemale ? 'bg-primary-content' : ''}`}>
                        <input type="radio" id="male" name="gender" value='male' 
                            className="radio radio-primary" defaultChecked onChange={() => setFemale(false)} />
                        <label htmlFor="male" className="ms-4">Male</label>
                    </div>
                    <div className={`px-5 py-3 rounded-2xl duration-300 ${isFemale ? 'bg-primary-content' : ''}`}>
                        <input type="radio" id="female" name="gender" value='female' 
                            className="radio radio-primary" onChange={() => setFemale(true)} />
                        <label htmlFor="female" className="ms-4">Female</label>
                    </div>
                </div>
            </section>
            <button className='btn btn-primary max-md:max-w-[300px] w-[60%] rounded-[7px] my-4'>Register</button>
        </form>
    )
}

export default RegistrationForm