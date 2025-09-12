import express from 'express'
import { verifyAdmin, verifyToken } from '../middleware/verifyUser.js'
import { changeEmployeeStatus, createEmployee, getAllEmployee, getEmployeePendingSalaries, updateEmployee ,getAllEmployeeByManager,getAllPendingSalariesByManager} from '../controller/employeeController.js'

const app = express.Router()

//For create employee
app.post('/',verifyToken, createEmployee)

//For get All employee
app.get('/', verifyToken, verifyAdmin, getAllEmployee)

//For get All employee by manager
app.get('/acmanager',verifyToken,getAllEmployeeByManager)

//For get All pending salaries by manager
app.get('/salary-details/acmanager',verifyToken,getAllPendingSalariesByManager)

//For update employee details
app.put('/:employeeId', verifyToken, updateEmployee)

//For change status of employee
app.put('/status/:employeeId', verifyToken, changeEmployeeStatus)

//For get employee salary details
app.get('/salary-details', verifyToken, getEmployeePendingSalaries)


export default app
