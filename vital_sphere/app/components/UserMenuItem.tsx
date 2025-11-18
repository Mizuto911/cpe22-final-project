'use client';
import React from 'react'
import Image from 'next/image'
import { UserData } from '../modules/DataTypes';

interface UserMenuItemProps {
  userData: UserData
}

const UserMenuItem = (props: UserMenuItemProps) => {

  return (
    <div className='w-full flex items-center gap-5 ps-8'>
        <div className='shadow-lg rounded-[50%]'>
            <Image src="/images/default_user.jpg" alt="User Profile" width={50} height={50}
                            className="rounded-[50%]" />
        </div>
        <div className='max-md:hidden'>
            <h3 className='font-bold text-lg p-0'>{props.userData.name}</h3>
            <p className='text-green-600 text-sm'>Ready For Training</p>
        </div>
    </div>
  )
}

export default UserMenuItem