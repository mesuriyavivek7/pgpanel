import express from 'express'
import { verifyAdmin, verifyToken } from '../middleware/verifyUser.js'
import { changeEmployeeStatus, createEmployee, deleteEmployee, exportEmployeeExcel, getAllEmployee, getEmployeePendingSalaries, updateEmployee } from '../controller/employeeController.js'

const app = express.Router()

//For create employee
app.post('/',verifyToken, createEmployee)

//For get All employee
app.get('/', verifyToken, getAllEmployee)

//For update employee details
app.put('/:employeeId', verifyToken, updateEmployee)

//For change status of employee
app.put('/status/:employeeId', verifyToken, changeEmployeeStatus)

//For get employee salary details
app.get('/salary-details', verifyToken, getEmployeePendingSalaries)

//For delete employee 
app.delete('/:employeeId', verifyToken, deleteEmployee)

//For get all employees
app.get('/export/excel', verifyToken, exportEmployeeExcel)

export default app
