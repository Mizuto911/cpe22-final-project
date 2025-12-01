'use client'
import { useState, FormEvent, useContext } from "react";
import { DayPicker } from "react-day-picker";
import { hasEmptyFields, formatDateToISOStringLocally } from "../modules/UtilityModules";
import { Tooltip } from "react-tooltip";
import { bdayDoubtMessage, genderDoubtMessage } from '../modules/long_strings'
import Image from "next/image";
import "react-day-picker/style.css";
import AuthContext from "../context/AuthContext";
import style from './Forms.module.css';
import clsx from "clsx";

const RegistrationForm = () => {
    const { register } = useContext(AuthContext);
    const [birthDay, setBirthDay] = useState<Date>();
    const [isFemale, setFemale] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    function showError(message: string) {
        setErrorMessage(message);
        setTimeout(() => {
            setErrorMessage('');
        }, 2000);
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        if (hasEmptyFields(formData) || !birthDay) {
            showError('Input all Fields!');
            return;
        }
        else {
            setLoading(true);
        }

        formData.append('birthday', formatDateToISOStringLocally(birthDay));

        const successfulRegister = await register(formData);

        if(!successfulRegister.ok) {
            showError(successfulRegister.message);
            setLoading(false);
        }
    }

    return(
        <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col justify-start items-center gap-4 max-md:mx-6 max-sm:mx-4">
            <input type="text" name="username" placeholder="Enter User Name"
                className="input input-primary w-full max-w-[500px] text-[1rem] py-5 mt-5" />
            <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password"
                className="input input-primary w-full max-w-[500px] text-[1rem] py-5" />
            <div className='flex flex-row gap-4 justify-end w-full max-w-[500px]'>
                <input type="checkbox" className="checkbox checkbox-primary" onChange={() => setShowPassword(prev => !prev)} />
                <p className='max-md:text-sm text-md'>Show Password</p>
            </div>
            <section className="w-full max-w-[500px] flex flex-col items-center gap-2">
                <label htmlFor="birthday"
                    className="font-bold w-full text-start"
                >Date of Birth&nbsp;
                <Image className="inline-block mb-1" data-tooltip-id='bday-tooltip' data-tooltip-content={bdayDoubtMessage}
                    src='/images/doubt-icon.png' alt="Doubt Icon" width={15} height={15}
                />: 
                <Tooltip id="bday-tooltip" style={{maxWidth: '200px', zIndex: '1'}}/>
                </label>
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
                >Gender&nbsp;
                <Image className="inline-block mb-1" data-tooltip-id='gender-tooltip' data-tooltip-content={genderDoubtMessage}
                    src='/images/doubt-icon.png' alt="Doubt Icon" width={15} height={15}
                />: 
                <Tooltip id="gender-tooltip" style={{maxWidth: '200px', zIndex: '1'}}/> 
                </label>
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
            <button type='submit' className='btn btn-primary max-md:max-w-[300px] w-[60%] rounded-[7px] my-4'>Register</button>
            {isLoading && <div className="fixed top-0 bottom-0 w-screen h-screen grid place-content-center bg-[rgba(0,0,0,0.5)]">
                    <div className={`loading loading-spinner loading-xl text-primary mb-4 ${style.loadingEnter}`}></div>
                </div>}
            {errorMessage && <p className={`p-4 fixed bottom-8 bg-error rounded-xl text-error-content font-bold mb-4 ${style.errorEnter}`}>{errorMessage}</p>}
        </form>
    )
}

export default RegistrationForm