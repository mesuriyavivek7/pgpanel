import multer from 'multer'
import path from 'path'
import fs from 'fs'

const branchUploadDir = path.join(process.cwd(),'uploads','branch')
const pgLogoDir = path.join(process.cwd(), 'uploads', 'logo')

if(!fs.existsSync(branchUploadDir)){
    fs.mkdirSync(branchUploadDir)
}

const branchStorage = multer.diskStorage({
    destination:(req, file, cb) =>{
        cb(null, branchUploadDir);
    },
    filename: (req, file, cb) =>{
        const uniqueSufix = Date.now() + '-' + Math.round(Math.random() + 1E9);
        const ext = path.extname(file.originalname)
        const name = file.fieldname + '-' + uniqueSufix + ext;
        cb(null,name)
    }
})

const logoStorage = multer.diskStorage({
    destination:(req, file, cb) =>{

        if(!fs.existsSync(pgLogoDir)){
            fs.mkdirSync(pgLogoDir)
        }

        cb(null, pgLogoDir);
    },

    filename: (req, file, cb) =>{
        const uniqueSufix = Date.now() + '-' + Math.round(Math.random() + 1E9);
        const ext = path.extname(file.originalname)
        const name = file.fieldname + '-' + uniqueSufix + ext;
        cb(null, name)
    }
})

const fileFilter = (req, file, cb) =>{
    if(file.mimetype.startsWith('image/')){
        cb(null, true)
    } else{
        cb(new Error('Only image file allowed!'))
    }
}


export const uploadBranchImages = multer({
    storage:branchStorage,
    limits:{
        fileSize: 10 * 1024 * 1024,
        files:10
    },
    fileFilter
})

export const uploadLogoImages = multer({
    storage:logoStorage,
    limits:{
        fileSize: 10 * 1024 * 1024,
        files:10
    },
    fileFilter
})

export const branchMulter = uploadBranchImages.single('image')
export const logoMulter = uploadLogoImages.single('logo')