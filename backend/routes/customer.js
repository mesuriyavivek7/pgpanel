import express from 'express'
import { verifyToken, verifyAdmin } from '../middleware/verifyUser.js'
import { createCustomer, getAllCustomer, getCustomerByBranchId, getCustomerByRoomId, updateCustomerDetails } from '../controller/customerController.js'

const app = express.Router()

//For create new customer
app.post('/', verifyToken, createCustomer)

//For get all customer
app.get('/',verifyToken, verifyAdmin, getAllCustomer)

//For get customer by room id
app.get('/room/:roomId', verifyToken, getCustomerByRoomId)

//For get customer by branch id
app.get('/branch/:branchId', verifyToken, getCustomerByBranchId)

//For update customer details
app.put('/:customerId', verifyToken, updateCustomerDetails)



export default app