import express from 'express';
import { verifyAdmin, verifyToken } from '../middleware/verifyUser.js';
import { branchMulter } from '../middleware/Upload.js';
import { createBranch, getAllBranch, getBranchById, getDashboardSummery, updateBranch,getAllBranchByManger } from '../controller/branchController.js';

const app = express.Router()

//For create branch
app.post('/', verifyToken, verifyAdmin, branchMulter, createBranch)

//For get all branch
app.get('/',verifyToken, verifyAdmin, getAllBranch)


//For get All Branch by manager
app.get('/acmanager',verifyToken,getAllBranchByManger)

//For update branch details
app.put('/:branchId', verifyToken, verifyAdmin, branchMulter, updateBranch)

//Get branch details by id
app.get('/:branchId', verifyToken, getBranchById)

//Get dashboatd summery
app.get('/dashboard-summery/:branchId', verifyToken, getDashboardSummery)


export default app