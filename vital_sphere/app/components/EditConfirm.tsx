import clsx from 'clsx'
import { useState, useContext } from 'react'
import style from "./dashboard.module.css";
import { UserUpdateFormData, DataFetchError, UserUpdateDataResponse } from '../modules/DataTypes';
import { formatDateToISOStringLocally } from '../modules/UtilityModules';
import AuthContext from '../context/AuthContext';

interface EditConfirmProps {
    setEditConfirm: Function
    userData: UserUpdateFormData
    showErrorMessage: Function 
    setUserData: Function 
    setLoading: Function
}

function successfulUpdate(responseData: UserUpdateDataResponse | DataFetchError) {
    const keys = Object.keys(responseData);
    if (keys.includes('detail')) return false;
    else return true;
}

const EditConfirm = (props: EditConfirmProps) => {

    const { updateUserData } = useContext(AuthContext);
    const [password, setPassword] = useState('');

    async function handleConfirmClick() {

        if (!password) {
            props.showErrorMessage('Input Empty Fields', false);
            return;
        }

        props.setLoading(true);
        const responseData = await updateUserData({
            name: props.userData.userName,
            birthday: formatDateToISOStringLocally(props.userData.birthDay),
            password: password,
            is_female: props.userData.isFemale
        });

        console.log(responseData)

        props.setLoading(false);

        if (successfulUpdate(responseData)) {
            const data = responseData as UserUpdateDataResponse;
            props.setUserData(data);
            props.showErrorMessage('User Data Updated Successfully', true);
            props.setEditConfirm(false);
        }
        else {
            const data = responseData as DataFetchError;
            if (data.detail.msg)
                props.showErrorMessage(data.detail.msg, false);
            else 
                props.showErrorMessage(data.detail, false);
            props.setEditConfirm(false);
        }
    }

  return (
    <section className={clsx('fixed top-0 left-0 w-screen h-screen grid place-content-center bg-[rgba(0,0,0,0.5)] z-5', style.fadeIn)}>
        <div className="min-w-[250px] w-[25vw] h-auto rounded-xl bg-base-200 p-4 flex flex-col items-center justify-between">
            <div className="flex flex-col items-center">
                <h2 className="font-bold text-xl text-primary mb-3">
                    Edit Information 
                </h2>
                <p>Please input your password to confirm.</p>
                <input type="password" placeholder='Password' className='input input-primary my-4' onChange={e => setPassword(e.target.value)} />
            </div>
            <div>
                <button onClick={() => props.setEditConfirm(false)} className="btn btn-outline p-2 rounded-lg me-6" >Cancel</button> 
                <button onClick={handleConfirmClick} className="btn btn-outline btn-success p-2 rounded-lg">Confirm</button>
            </div>
        </div>
    </section>
  )
}

export default EditConfirm