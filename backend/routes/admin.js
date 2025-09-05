import express from 'express'
import { verifyToken, verifyAdmin } from '../middleware/verifyUser.js'
import { getDashboardSearch, getDashboardSummery } from '../controller/adminController.js'

const app = express.Router()


//For get dashboard summery
app.get('/dashboard-summery', verifyToken, verifyAdmin, getDashboardSummery)

//For get dashboard search
app.get('/dashboard-search/:role', verifyToken, verifyAdmin, getDashboardSearch)

export default app