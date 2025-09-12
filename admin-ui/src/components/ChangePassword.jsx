import React, {useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "../validations/changePasswordSchema";
import { useForm } from "react-hook-form";
import { changePassword } from "../services/adminService";


//Importing icons
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";



function ChangePassword({onClose}) {
  const [loading, setLoading] = useState();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password:'',
      confirm_password:'',
      current_password:''
    },
  });

  const handleChangePassword = async (formData) =>{
    setLoading(true)
    try{
        const data = await changePassword(formData)
        toast.success("Password changed successfully.")
        onClose(true)
    }catch(err){
        console.log(err)
        toast.error(err?.message)
    }finally{
        setLoading(false)
    }
  }

  return (
    <div className="fixed z-50 backdrop-blur-sm inset-0 bg-black/40 flex justify-center items-center">
        <div className="flex w-xl flex-col gap-4 bg-white rounded-2xl p-4">
          <div className="flex items-center gap-2">
          <ChevronLeft
            size={28}
            onClick={() => onClose(false)}
            className="cursor-pointer"
          ></ChevronLeft>
          <h1 className="text-2xl font-semibold">
            Change Password
          </h1>
          </div>
          <form onSubmit={handleSubmit(handleChangePassword)} className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
                <label>
                    Current Password <span className="text-sm text-red-500">*</span>
                </label>
                <div className="flex flex-col">
                    <input 
                    type="text"
                    {...register('current_password')}
                    placeholder="Enter current password"
                    className="p-2 border border-neutral-300 rounded-md outline-none"
                    ></input>
                    {
                     errors.current_password && 
                     <span className="text-sm text-red-500">{errors.current_password.message}</span>
                    }
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <label>
                    New Password <span className="text-sm text-red-500">*</span>
                </label>
                <div className="flex flex-col">
                    <input 
                    type="text"
                    {...register("password")}
                    placeholder="Enter new password"
                    className="p-2 border border-neutral-300 rounded-md outline-none"
                    ></input>
                    {
                     errors.password && 
                     <span className="text-sm text-red-500">{errors.password.message}</span>
                    }
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <label>
                    Confirm Password <span className="text-sm text-red-500">*</span>
                </label>
                <div className="flex flex-col">
                    <input 
                    type="text"
                    {...register("confirm_password")}
                    placeholder="Enter confirm Password"
                    className="p-2 border border-neutral-300 rounded-md outline-none"
                    ></input>
                    {
                     errors.confirm_password && 
                     <span className="text-sm text-red-500">{errors.confirm_password.message}</span>
                    }
                </div>
            </div>
            <div className="flex justify-center items-center">
            <button
              type="submit"
              disabled={loading}
              className="p-2 hover:bg-blue-600 disabled:cursor-not-allowed w-40 transition-all duration-300 cursor-pointer flex justify-center items-center bg-blue-500 rounded-md text-white font-medium"
            >
              {loading ? (
                <LoaderCircle className="animate-spin"></LoaderCircle>
              ) : "Change Password"}
            </button>
          </div>
          </form>
        </div>
    </div>
  )
}

export default ChangePassword