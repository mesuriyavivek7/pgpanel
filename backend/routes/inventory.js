import express from 'express'
import { verifyToken, verifyAdmin } from '../middleware/verifyUser.js'
import { getAllInventoryTransaction } from '../controller/inventoryController.js'

const app = express.Router()

//For get all inventory transaction
app.get('/', verifyToken, verifyAdmin, getAllInventoryTransaction)



export default app
