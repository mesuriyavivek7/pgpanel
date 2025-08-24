import express from 'express'
import { verifyToken, verifyAdmin } from '../middleware/verifyUser.js'
import { getDashboardSummery } from '../controller/adminController.js'

const app = express.Router()


//For get dashboard summery
app.get('/dashboard-summery', verifyToken, verifyAdmin, getDashboardSummery)


export default app