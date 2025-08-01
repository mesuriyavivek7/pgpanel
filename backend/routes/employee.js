import express from 'express'
import { verifyAdmin, verifyToken } from '../middleware/verifyUser.js'
import { changeEmployeeStatus, createEmployee, getAllEmployee, updateEmployee } from '../controller/employeeController.js'

const app = express.Router()

//For create employee
app.post('/',verifyToken, createEmployee)

//For get All employee
app.get('/', verifyToken, verifyAdmin, getAllEmployee)

//For update employee details
app.put('/:employeeId', verifyToken, updateEmployee)

//For change status of employee
app.put('/status/:employeeId', verifyToken, changeEmployeeStatus)

export default app
