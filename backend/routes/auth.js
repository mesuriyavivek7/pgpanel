import express from 'express'
import { loginUser, logoutPortal, signupUser, validateToken, verifyOtp } from '../controller/authController.js'

const app = express.Router()

//Login (Step 1 - validates credentials and sends OTP)
app.post('/sign-in', loginUser)

//Verify OTP (Step 2 - verifies OTP and issues session cookie)
app.post('/verify-otp', verifyOtp)

//Sign up
app.post('/sign-up', signupUser)

//Validate token
app.post('/validate-token', validateToken)

//Logout
app.get('/logout', logoutPortal)


export default app