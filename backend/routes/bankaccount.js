import express from 'express'
import { createBankAccount, getAllBankAccount } from '../controller/bankAccountController.js'
import { verifyToken, verifyAdmin } from '../middleware/verifyUser.js'

const app = express.Router()


//For create bank account
app.post('/',verifyToken, verifyAdmin, createBankAccount)

//For get all bank accounts
app.get('/', verifyToken, getAllBankAccount)

export default app