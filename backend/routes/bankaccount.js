import express from 'express'
import { createBankAccount, getAllBankAccount, updateBankAccount } from '../controller/bankAccountController.js'
import { verifyToken, verifyAdmin } from '../middleware/verifyUser.js'

const app = express.Router()


//For create bank account
app.post('/',verifyToken, verifyAdmin, createBankAccount)

//For get all bank accounts
app.get('/', verifyToken, getAllBankAccount)

app.put('/:accountId', verifyToken, updateBankAccount)

export default app