import React, {useEffect, useState} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { branchSchema } from "../validations/branchSchema";
import { useForm } from "react-hook-form";
import UploadImage from "./UploadImage";

//Importing icons
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";

import { createBranch, updateBranch } from "../services/branchService";

function BranchForm({selectedBranch, onClose}) {
  const [file, setFile] = useState(null);
  const [previewImage,setPreviewImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(branchSchema),
    defaultValues: {
      branch_name:'',
      branch_address:''
    }
  });

  useEffect(()=>{
     if(selectedBranch){
      setPreviewImage(selectedBranch?.branch_image)
      reset({
        branch_name:selectedBranch.branch_name || "",
        branch_address:selectedBranch.branch_address || ""
      })
     }
  },[selectedBranch])

  const handleAddBranch = async (formData) => {
    try{
      setLoading(true)
      const fileData = new FormData()
      if(file) fileData.append('image',file)
      fileData.append('branch_name',formData.branch_name)
      fileData.append('branch_address',formData.branch_address)

      const data = await createBranch(fileData)

      onClose(true)
      toast.success("New Branch added successfully.")
    }catch(error){
      console.log(error)
      toast.error(error?.message)
    }finally{
      setLoading(false)
    }
  };

  const handleUpdateBranch = async (formData) =>{
     try{
      setLoading(true)
      let fileData = new FormData()

      fileData.append('branch_name',formData.branch_name)
      fileData.append('branch_address',formData.branch_address)

      if(file) {
        fileData.append('image',file)
      }
      
      if(!file && !previewImage){
        fileData.append('remove_image',true)
      }

      const data = await updateBranch(fileData, selectedBranch?._id)
      onClose(true)
      toast.success("Branch updated successfully.")
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
          <ChevronLeft size={28} onClick={()=>onClose(false)} className="cursor-pointer"></ChevronLeft>
          <h1 className="text-2xl font-semibold">{selectedBranch ?"Edit Branch": "Add New Branch"}</h1>
        </div>
        <UploadImage className={'mt-2'} file={file} setFile={setFile} previewImage={selectedBranch ? selectedBranch?.branch_image : null} setPreviewImage={setPreviewImage} ></UploadImage>
        <form
          onSubmit={handleSubmit(selectedBranch ? handleUpdateBranch : handleAddBranch)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label>
              Branch Name <span className="text-sm text-red-500">*</span>
            </label>
            <div className="flex flex-col">
              <input
                type="text"
                {...register("branch_name")}
                className="p-2 border border-neutral-300 rounded-md outline-none"
                placeholder="Enter branch name"
              ></input>
              {errors.branch_name && <span className="text-sm text-red-500">{errors.branch_name.message}</span>}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label>
              Address <span className="text-sm text-red-500">*</span>
            </label>
           <div className="flex flex-col">
            <textarea
               {...register("branch_address")}
               className="p-2 border border-neutral-300 resize-none rounded-md outline-none"
               placeholder="Enter branch address"
             ></textarea> 
             {errors.branch_address && <span className="text-sm text-red-500">{errors.branch_address.message}</span>}
           </div>
          </div>
          <div className="flex justify-center items-center">
             <button type="submit" disabled={loading} className="p-2 hover:bg-blue-600 w-36 transition-all duration-300 cursor-pointer flex justify-center items-center bg-blue-500 rounded-md text-white font-medium">
                {
                  loading ? 
                  <LoaderCircle className="animate-spin"></LoaderCircle> :
                  selectedBranch ? 
                  "Save" :
                  "Submit"
                }
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BranchForm;
