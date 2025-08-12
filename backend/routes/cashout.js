import express from 'express'
import { verifyToken, verifyAdmin } from '../middleware/verifyUser.js'
import { getAllCashOutTransaction } from '../controller/cashOutController.js'

const app = express.Router()


//For get all cashouts 
app.get('/', verifyToken, getAllCashOutTransaction)


export default app