import express from 'express'
import { verifyToken, verifyAdmin } from '../middleware/verifyUser.js'
import { createTransactionForAdvanceRentPay, createTransactionForCashout, createTransactionForCustomerRent, createTransactionForDepositeAmount, createTransactionForEmployeeSalary, createTransactionForInventory, createTransactionForMonthlyPayment, exportExcelTransactions, getAllTransactions } from '../controller/transactionController.js'

const app = express.Router()

//For create transaction for customer rent
app.post('/customer-rent', verifyToken, createTransactionForCustomerRent)

//For create transaction for advance rent pay
app.post('/advance-rent', verifyToken, createTransactionForAdvanceRentPay)

//For create transaction for deposite amount
app.post('/deposite', verifyToken, createTransactionForDepositeAmount)

//For create transaction for customer salary
app.post('/employee-salary', verifyToken, createTransactionForEmployeeSalary)

//For create transaction for inventory item
app.post('/inventory-purchase', verifyToken, createTransactionForInventory)

//For create transaction for monthly payment
app.post('/monthly-payment', verifyToken, createTransactionForMonthlyPayment)

//For create transaction for cashout pay
app.post('/cashout-pay', verifyToken, verifyAdmin, createTransactionForCashout)

//For get all transactions
app.get('/', verifyToken, getAllTransactions)

//For export transactions 
app.get('/export/excel', verifyToken, exportExcelTransactions)

export default app