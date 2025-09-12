import express from 'express'
import { verifyToken, verifyAdmin } from '../middleware/verifyUser.js'
import {
    changeStatus, createCustomer, getAllCustomer,
    getAllCustomerByAcmanager, getCustomerByBranchId, getCustomerByRoomId,
    getPendingCustomerRentList, updateCustomerDetails,
    getPendingCustomerRentListByAcmanager
} from '../controller/customerController.js'

const app = express.Router()

//For create new customer
app.post('/', verifyToken, createCustomer)

//For get all customer
app.get('/', verifyToken, verifyAdmin, getAllCustomer)

//For get all customer by Acmanager
app.get('/acmanager', verifyToken, getAllCustomerByAcmanager)

//For get customer by room id
app.get('/room/:roomId', verifyToken, getCustomerByRoomId)

//For get customer by branch id
app.get('/branch/:branchId', verifyToken, getCustomerByBranchId)

//For update customer details
app.put('/:customerId', verifyToken, updateCustomerDetails)

//For change customer status
app.put('/status/:customerId', verifyToken, changeStatus)

//For get pending customer rents
app.get('/pending-rent', verifyToken, getPendingCustomerRentList)

//For get pending customer rents by Acmanager
app.get('/pending-rent/acmanger', verifyToken, getPendingCustomerRentListByAcmanager)
export default app