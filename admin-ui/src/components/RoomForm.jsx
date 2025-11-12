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
    <div className='fixed z-50 backdrop-blur-sm inset-0 bg-black/40 flex justify-center items-center px-4 py-4 sm:px-6 sm:py-6'>
        <div className='flex w-full max-w-xl flex-col gap-3 sm:gap-4 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center gap-2'>
              <ChevronLeft size={24} className="sm:w-7 sm:h-7 cursor-pointer flex-shrink-0" onClick={()=>onClose(false)}></ChevronLeft>
              <h1 className='text-lg sm:text-xl md:text-2xl font-semibold break-words'>{selectedRoom ? "Edit Room Details" : "Add New Room"}</h1>
            </div>
            <form onSubmit={handleSubmit(selectedRoom ? handleUpdateRoom :handleAddRoom)} className='flex flex-col gap-3 sm:gap-4'>
                <div className='flex flex-col gap-1.5 sm:gap-2'>
                    <label className='text-sm sm:text-base'>Room No <span className='text-sm text-red-500'>*</span></label>
                    <div className='flex flex-col'>
                      <input 
                      type='text'
                      {...register('room_id')}
                      className='p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      placeholder='Enter room no'
                      ></input>
                      {
                        errors.room_id && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.room_id.message}</span>
                      }
                    </div>
                </div>
                <div className='flex flex-col gap-1.5 sm:gap-2'>
                    <label className='text-sm sm:text-base'>Capacity <span className='text-sm text-red-500'>*</span></label>
                    <div className='flex flex-col'>
                      <input 
                      type='number'
                      {...register('capacity', { valueAsNumber: true })}
                      className='p-2 sm:p-2.5 text-sm sm:text-base border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      placeholder='Enter capacity'
                      ></input>
                      {
                         errors.capacity && <span className='text-xs sm:text-sm text-red-500 mt-1'>{errors.capacity.message}</span>
                      }
                    </div>
                </div>
                <div className='flex flex-col gap-1.5 sm:gap-2'>
                    <label className='text-sm sm:text-base'>Remarks</label>
                    <textarea
                     {...register('remark')}
                     rows={3}
                     className='p-2 sm:p-2.5 text-sm sm:text-base resize-none border border-neutral-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                     placeholder='Enter remarks'></textarea>
                </div>
                <div className='flex justify-center items-center pt-2'>
                    <button type='submit' disabled={loading} className='p-2.5 sm:p-3 hover:bg-blue-600 w-full sm:w-36 transition-all duration-300 cursor-pointer flex justify-center items-center bg-blue-500 rounded-md text-white font-medium text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed'>
                        {
                            loading ? 
                            <LoaderCircle className='animate-spin w-5 h-5'></LoaderCircle> :
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