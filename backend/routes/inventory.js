import express from 'express'
import { verifyToken } from '../middleware/verifyUser.js'
import { getAllInventoryTransaction, updateInventory } from '../controller/inventoryController.js'

const app = express.Router()

//For get all inventory transaction
app.get('/', verifyToken, getAllInventoryTransaction)

//For update inventory transaction 
app.put('/:transactionId', verifyToken, updateInventory)

export default app
