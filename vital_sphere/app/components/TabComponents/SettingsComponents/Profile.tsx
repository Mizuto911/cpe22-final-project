import { useState, useRef } from 'react'
import Image from 'next/image';
import { MdArrowDropDown } from "react-icons/md";
import { isEqualObject, formatDateToISOStringLocally } from '@/app/modules/UtilityModules';
import { DayPicker } from "react-day-picker";
import { useOutsideAlerter } from '@/app/modules/CustomHooks';
import EditConfirm from '../../EditConfirm';
import { UserData } from '@/app/modules/DataTypes';
import "react-day-picker/style.css";
import ChangePassConfirm from '../../ChangePassConfirm';

interface ProfileProps {
  showErrorMessage: Function 
  setUserData: Function 
  setLoading: Function
  userData: UserData
}

const Profile = (props: ProfileProps) => {

  const [originalData, setOriginalData] = useState({userName: props.userData.name, birthDay: new Date(props.userData.birthday), isFemale: props.userData.is_female});
  const [formData, setFormData] = useState(originalData);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editConfirm, setEditConfirm] = useState(false);
  const [changePassConfirm, setChangePassConfirm] = useState(false);
  const dropDownRef = useRef<HTMLDetailsElement | null>(null);
  const datePickerRef = useRef<HTMLDivElement | null>(null);
  const dropDownMenuRef = useRef<HTMLUListElement | null>(null);

  const canSubmit = !isEqualObject(originalData, formData) && !!formData.birthDay && !!formData.userName;

  const editButtonClassName = canSubmit ?
    'rounded-md btn btn-success' : 'rounded-md btn btn-success opacity-50 cursor-default';
  const datePickerClassName = showDatePicker ? "shadow-xl absolute top-0 right-0 z-10 duration-200 opacity-100 rounded-lg" :
    "shadow-xl absolute top-0 right-0 duration-200 z-[-1] opacity-0 rounded-lg";

  useOutsideAlerter(datePickerRef, () => setShowDatePicker(false));
  useOutsideAlerter(dropDownMenuRef, () => dropDownRef.current ? dropDownRef.current.open = false : null);

  function handleDropDownSelect(isFemale: boolean) {
    setFormData(oldFormData => ({...oldFormData, isFemale: isFemale}));
    if (dropDownRef.current) {
      dropDownRef.current.open = false;
    }
  }

  function handleSelectBirthDay(birthDay: any) {
    setFormData(oldFormData => ({...oldFormData, birthDay: birthDay}));
    setShowDatePicker(false);
  }

  return (
    <section>
        <div className='shadow-2xl rounded-[50%] w-[200px] max-md:w-[150px] h-auto mx-auto mt-8 z-2'>
          <Image src="/images/default_user.jpg" alt="User Profile" width={1000} height={1000}
                          className="rounded-[50%] w-full h-auto" />
        </div>
        <section className='bg-base-300 shadow-2xl h-auto mt-[-50px] mb-[75px] rounded-xl w-full max-w-[1000px] mx-auto p-8 py-12'>

          <h2 className="text-[clamp(1.8rem,3vw,2.25rem)] font-bold mx-auto text-primary w-fit mt-6">Profile</h2>

          <div className='w-full max-w-[600px] mx-auto mt-5'>
            <label htmlFor="username" className='text-lg font-bold'>User Name:</label>
            <input id='username' type='text' className='input input-primary w-full text-lg' placeholder='User Name' value={formData.userName} 
              onChange={e => setFormData(oldFormData => ({...oldFormData, userName: e.target.value}))} />
          </div>

          <div className='w-full max-w-[600px] mx-auto mt-5 relative'>
            <label htmlFor="birthday" className='text-lg font-bold'>Date of Birth:</label>
            <input id='birthDay' type='text' className='input input-primary w-full text-lg' 
              placeholder='Birthday' onClick={() => setShowDatePicker(oldShowDatePicker => !oldShowDatePicker)}
              value={formData.birthDay ? formData.birthDay.toLocaleDateString('en-US') : ''} readOnly={true} />
            <div className={datePickerClassName} ref={datePickerRef}>
              <DayPicker
                className='react-day-picker'
                captionLayout="dropdown-years"
                mode="single"
                selected={formData.birthDay}
                onSelect={handleSelectBirthDay}
                endMonth={formData.birthDay}
                disabled={{after: new Date()}}
                footer={
                  formData.birthDay ? `Selected: ${formData.birthDay.toLocaleDateString('en-US')}` : 'Pick a day.'
                }
              />
            </div>
          </div>
          
          <div className='w-full max-w-[600px] mx-auto mt-5'>
            <label htmlFor="gender" className='text-lg font-bold'>Gender:</label>
            <details className="dropdown w-full inline-block" ref={dropDownRef}>
              <summary className="input input-primary w-full text-lg flex flex-row justify-between items-center">
                <span>{formData.isFemale ? 'Female' : 'Male'}</span>
                <MdArrowDropDown />
              </summary>
              <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 mt-2 duration-300 text-lg shadow-sm"
                ref={dropDownMenuRef}>
                <li onClick={() => handleDropDownSelect(false)}><a>Male</a></li>
                <li onClick={() => handleDropDownSelect(true)}><a>Female</a></li>
              </ul>
            </details>
          </div>

          <div className='flex flex-row gap-4 flex-wrap justify-evenly mt-12'>
            <button className={editButtonClassName} onClick={canSubmit ? () => setEditConfirm(true) : undefined}>
              Edit Information
            </button>
            <button className='rounded-md btn btn-error' onClick={() => setChangePassConfirm(true)}>
              Change Password
            </button>
          </div>

        </section>

        {editConfirm && <EditConfirm setEditConfirm={setEditConfirm} userData={formData}
          showErrorMessage={props.showErrorMessage} setUserData={props.setUserData} setLoading={props.setLoading} />}
        {changePassConfirm && <ChangePassConfirm setChangePassConfirm={setChangePassConfirm} showErrorMessage={props.showErrorMessage}
          setLoading={props.setLoading} />}
    </section>
  )
}

export default Profile