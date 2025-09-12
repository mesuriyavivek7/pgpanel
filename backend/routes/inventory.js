import express from 'express'
import { verifyToken } from '../middleware/verifyUser.js'
import { getAllInventoryTransaction } from '../controller/inventoryController.js'

const app = express.Router()

//For get all inventory transaction
app.get('/', verifyToken, getAllInventoryTransaction)



export default app
