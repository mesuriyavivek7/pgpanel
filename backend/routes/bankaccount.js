import express from 'express'
import { createBankAccount, deleteBankAccount, getAllBankAccount, resetAllBankAccount, resetBankAccount, updateBankAccount } from '../controller/bankAccountController.js'
import { verifyToken, verifyAdmin } from '../middleware/verifyUser.js'

const app = express.Router()


//For create bank account
app.post('/',verifyToken, verifyAdmin, createBankAccount)

//For get all bank accounts
app.get('/', verifyToken, verifyAdmin, getAllBankAccount)

//For update bank account
app.put('/:accountId', verifyToken, verifyAdmin, updateBankAccount)

//For delete bank account
app.delete('/:accountId', verifyToken, verifyAdmin, deleteBankAccount)

//For reset bank account 
app.post('/reset/:accountId', verifyToken, verifyAdmin, resetBankAccount)

//For reset all bank accounts 
app.post('/resetall', verifyToken, verifyAdmin, resetAllBankAccount)

export default app