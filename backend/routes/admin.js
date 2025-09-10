import express from 'express'
import { verifyToken, verifyAdmin } from '../middleware/verifyUser.js'
import { getAdminDetails, getDashboardSearch, getDashboardSummery, updateAdminDetails, uploadLogo } from '../controller/adminController.js'
import { logoMulter } from '../middleware/Upload.js'

const app = express.Router()


//For get dashboard summery
app.get('/dashboard-summery', verifyToken, verifyAdmin, getDashboardSummery)

//For get dashboard search
app.get('/dashboard-search/:role', verifyToken, verifyAdmin, getDashboardSearch)

//For get admin details
app.get('/me', verifyToken, verifyAdmin,getAdminDetails )

//For upload pg logo 
app.post('/upload-logo', verifyToken, verifyAdmin, logoMulter, uploadLogo)

//For update admin details
app.put('/me', verifyToken, verifyAdmin, updateAdminDetails)

export default app