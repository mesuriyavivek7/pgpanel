import express from 'express'
import { loginUser, logoutPortal, signupUser, validateToken } from '../controller/authController.js'

const app = express.Router()

//Login
app.post('/sign-in',loginUser)

//Sign up
app.post('/sign-up',signupUser)

//Validate token
app.post('/validate-token',validateToken)

//Logout
app.get('/logout',logoutPortal)


export default app