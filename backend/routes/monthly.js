import express from 'express'
import { verifyAdmin, verifyToken } from '../middleware/verifyUser.js'
import { createMonthlyPayment, deleteMonthlyBill, getMonthlyPaymentsList, updateMonthlyPaymentDetails } from '../controller/monthlyPayController.js'

const app = express.Router()

//For create monthly payment
app.post('/', verifyToken, verifyAdmin, createMonthlyPayment)

//For get list of monthly payments
app.get('/', verifyToken, getMonthlyPaymentsList)

//For update monthly payment details 
app.put('/:billId', verifyToken, verifyAdmin, updateMonthlyPaymentDetails)

//For delete monthly payment bill
app.delete('/:billId', verifyToken, verifyAdmin, deleteMonthlyBill)

export default app