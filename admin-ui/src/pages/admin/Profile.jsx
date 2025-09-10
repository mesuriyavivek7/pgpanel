import React from 'react'

//Import icons
import { Pencil } from 'lucide-react';
import { Lock } from 'lucide-react';
import { RotateCw, Plus, Trash } from 'lucide-react';

import PersonalDetails from '../../components/PersonalDetails';
import BankAccount from '../../components/BankAccount';


//Import images
import USER from '../../assets/user.png'

function Profile() {
  return (
    <div className='flex h-full flex-col gap-4'>
        <h1 className='text-3xl font-semibold'>Profile Details</h1>
        <PersonalDetails></PersonalDetails>
        <BankAccount></BankAccount>
    </div>
  )
}

export default Profile