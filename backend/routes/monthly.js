import express from 'express'
import { verifyAdmin, verifyToken } from '../middleware/verifyUser.js'
import { createMonthlyPayment, getMonthlyPaymentsList } from '../controller/monthlyPayController.js'

const app = express.Router()

//For create monthly payment
app.post('/', verifyToken, verifyAdmin, createMonthlyPayment)

//For get list of monthly payments
app.get('/', verifyToken, getMonthlyPaymentsList)

export default app