import express from 'express';
import { verifyAdmin, verifyToken } from '../middleware/verifyUser.js';
import { branchMulter } from '../middleware/Upload.js';
import { createBranch, getAllBranch, getBranchById, updateBranch } from '../controller/branchController.js';

const app = express.Router()

//For create branch
app.post('/', verifyToken, verifyAdmin, branchMulter, createBranch)

//For get all branch
app.get('/',verifyToken, verifyAdmin, getAllBranch)

//For update branch details
app.put('/:branchId', verifyToken, verifyAdmin, branchMulter, updateBranch)

//Get branch details by id
app.get('/:branchId', verifyToken, getBranchById)


export default app