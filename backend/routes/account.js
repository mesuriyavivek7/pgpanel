import express from 'express'
import { verifyToken, verifyAdmin } from '../middleware/verifyUser.js'
import { createAccountManager, getAllAcmanager, updateAcManager } from '../controller/accountController.js'

const app = express.Router()

//For create account manager
app.post('/', verifyToken, verifyAdmin, createAccountManager)

//For get all account manager
app.get('/', verifyToken, verifyAdmin, getAllAcmanager)

//For update account manager
app.put('/:acmanagerId', verifyToken, verifyAdmin, updateAcManager)


export default app