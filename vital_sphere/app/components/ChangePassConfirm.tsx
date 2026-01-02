import clsx from 'clsx'
import React, { FormEvent, useContext } from 'react'
import AuthContext from '../context/AuthContext';
import style from "./dashboard.module.css";
import { UserUpdateDataResponse, DataFetchError } from '../modules/DataTypes';

interface ChangePassConfirmProps {
    setChangePassConfirm: Function
    setLoading: Function
    showErrorMessage: Function
}

function successfulUpdate(responseData: UserUpdateDataResponse | DataFetchError) {
    const keys = Object.keys(responseData);
    if (keys.includes('detail')) return false;
    else return true;
}

const ChangePassConfirm = (props: ChangePassConfirmProps) => {

    const { updateUserPassword } = useContext(AuthContext);

    async function handlePasswordUpdate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        if (!formData.get('password') || !formData.get('old_password')) {
            props.showErrorMessage('Input Empty Fields', false);
            return;
        }

        props.setLoading(true);
        const responseData = await updateUserPassword({
            password: formData.get('password') as string,
            old_password: formData.get('old_password') as string
        });
        props.setLoading(false);

        if (successfulUpdate(responseData)) {
            const data = responseData as UserUpdateDataResponse;
            props.showErrorMessage('User Password Updated Successfully', true);
            props.setChangePassConfirm(false);
        }
        else {
            const data = responseData as DataFetchError;
            if (data.detail.msg)
                props.showErrorMessage(data.detail.msg, false);
            else 
                props.showErrorMessage(data.detail, false);
            props.setChangePassConfirm(false);
        }

    }

  return (
    <form onSubmit={handlePasswordUpdate} 
        className={clsx('fixed top-0 left-0 w-screen h-screen grid place-content-center bg-[rgba(0,0,0,0.5)] z-5', style.fadeIn)}>
        <div className="min-w-[250px] w-[25vw] h-auto rounded-xl bg-base-200 p-4 flex flex-col items-center justify-between">
            <div className="flex flex-col items-center">
                <h2 className="font-bold text-xl text-primary mb-3">
                    Change Password
                </h2>
                <p>Please input your old and new password to confirm.</p>
                <input type="password" name='password' placeholder='New Password' className='input input-primary mt-4' />
                <input type="password" name='old_password' placeholder='Old Password' className='input input-primary mb-4 mt-2' />
            </div>
            <div>
                <button onClick={() => props.setChangePassConfirm(false)} className="btn btn-outline p-2 rounded-lg me-6" >Cancel</button> 
                <button className="btn btn-outline btn-error p-2 rounded-lg">Confirm</button>
            </div>
        </div>
    </form>
  )
}

export default ChangePassConfirm