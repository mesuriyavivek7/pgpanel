import express from 'express'
import { verifyToken } from '../middleware/verifyUser.js'
import { createRoom, getRoomByBranchId, updateRoom } from '../controller/roomController.js'

const app = express.Router()

//For create room
app.post('/', verifyToken, createRoom)

//For update room 
app.put('/:roomId', verifyToken, updateRoom)

//Get Rooms by branch id
app.get('/branch/:branchId', verifyToken, getRoomByBranchId)

export default app