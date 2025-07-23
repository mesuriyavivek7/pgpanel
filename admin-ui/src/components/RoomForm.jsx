import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

//importing icons
import { ChevronLeft, LoaderCircle } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { roomSchema } from '../validations/roomSchema'
import { toast } from 'react-toastify'
import { createRoom, updateRoom } from '../services/roomService'

function RoomForm({branchId,onClose,selectedRoom}) {
  const [loading, setLoading] = useState(false)  

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    mode:'onChange',
    resolver: zodResolver(roomSchema),
    defaultValues: {
        room_id:'',
        capacity:1,
        remarks:''
    }
  });

  useEffect(()=>{
    if(selectedRoom){
        reset({
            room_id:selectedRoom.room_id,
            capacity:selectedRoom.capacity,
            remark:selectedRoom.remark
        })
    }
  },[selectedRoom])

  const handleAddRoom = async (formData) =>{
    try{
        setLoading(true)
        let payload = {
            room_id:formData.room_id,
            capacity:formData.capacity,
            remark:formData.remark,
            branch:branchId
        }
        const data = await createRoom(payload)
        toast.success('New room added successfully')
        onClose(true)
    }catch(err){
        console.log(err)
        toast.error(err?.message)
    }finally{
        setLoading(false)
    }
  }

  const handleUpdateRoom = async (formData) =>{
     try{
        setLoading(true)
        const data = await updateRoom(selectedRoom._id, formData)
        toast.success("Room details updated successfully.")
        onClose(true)
     }catch(err){
        console.log(err)
        toast.error(err?.message)
     }finally{
        setLoading(false)
     }
  }

  
  return (
    <div className='fixed z-50 backdrop-blur-sm inset-0 bg-black/40 flex justify-center items-center'>
        <div className='flex w-xl flex-col gap-4 bg-white rounded-2xl p-4'>
            <div className='flex items-center gap-2'>
              <ChevronLeft size={28} onClick={()=>onClose(false)} className="cursor-pointer"></ChevronLeft>
              <h1 className='text-2xl font-semibold'>{selectedRoom ? "Edit Room Details" : "Add New Room"}</h1>
            </div>
            <form onSubmit={handleSubmit(selectedRoom ? handleUpdateRoom :handleAddRoom)} className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                    <label>Room No <span className='text-sm text-red-500'>*</span></label>
                    <div className='flex flex-col'>
                      <input 
                      type='text'
                      {...register('room_id')}
                      className='p-2 border border-neutral-300 rounded-md outline-none'
                      placeholder='Enter room no'
                      ></input>
                      {
                        errors.room_id && <span className='text-sm text-red-500'>{errors.room_id.message}</span>
                      }
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <label>Capacity <span className='text-sm text-red-500'>*</span></label>
                    <div className='flex flex-col'>
                      <input 
                      type='number'
                      {...register('capacity', { valueAsNumber: true })}
                      className='p-2 border border-neutral-300 rounded-md outline-none'
                      placeholder='Enter capacity'
                      ></input>
                      {
                         errors.capacity && <span className='text-sm text-red-500'>{errors.capacity.message}</span>
                      }
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    <label>Remarks</label>
                    <textarea
                     {...register('remark')}
                     className='p-2 resize-none border border-neutral-300 rounded-md outline-none'
                     placeholder='Enter remarks'></textarea>
                </div>
                <div className='flex justify-center items-center'>
                    <button type='submit' disabled={loading} className='p-2 hover:bg-blue-600 w-36 transition-all duration-300 cursor-pointer flex justify-center items-center bg-blue-500 rounded-md text-white font-medium'>
                        {
                            loading ? 
                            <LoaderCircle className='animate-spin'></LoaderCircle> :
                            selectedRoom ? "Save" 
                            :"Submit"
                        }
                    </button>
                </div>
            </form>
            
        </div>
    </div>
  )
}

export default RoomForm