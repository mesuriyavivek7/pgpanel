import React from 'react'
import { useState } from 'react';
import { useRef } from 'react';

//Importing icons
import { X } from 'lucide-react'
import UPLOAD from '../assets/upload.png'

function UploadImage({file, setFile, className, previewImage, setPreviewImage}) {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(previewImage);

  console.log('Image preview',imagePreview)

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setPreviewImage(reader.result);
      };
      setFile(file);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer().files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setPreviewImage(reader.result);
      };
      setFile(file);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemoveFile = () => {
    setImagePreview(null);
    setFile(null);
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`${className}`}>
        {imagePreview ? (
          <div className="relative flex justify-center items-center h-52">
            <X
              className="absolute cursor-pointer top-0 right-0 text-red-500 hover:text-red-600"
              onClick={handleRemoveFile}
            ></X>
            <img
              src={imagePreview}
              alt="preview"
              className="h-full object-contain"
            ></img>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="w-full border-neutral-400 transition-all duration-300 hover:border-black flex justify-center items-center border-2  rounded-md border-dashed h-44"
          >
            <div className="flex items-center flex-col gap-2">
              <img src={UPLOAD} alt="upload" className="w-10 h-10"></img>
              <span>Upload Image</span>
            </div>
          </div>
        )}
        <input type='file' ref={fileInputRef} onChange={handleFileChange} accept='image/*' className='hidden'></input>
    </div>
  )
}

export default UploadImage