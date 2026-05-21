import React, { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { verifyOtp, login } from '../services/authService'

//Importing icons
import { LoaderCircle, ShieldCheck, RotateCcw, ArrowLeft } from 'lucide-react'

//Importing image
import LOGIN from '../assets/Login1.png'

const OTP_LENGTH = 6

function OtpVerification() {
    const location = useLocation()
    const navigate = useNavigate()
    const { loginSuccess } = useAuth()

    const { email, userType, formData } = location.state || {}

    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
    const [loading, setLoading] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)
    const [resendTimer, setResendTimer] = useState(30)
    const [canResend, setCanResend] = useState(false)
    const inputsRef = useRef([])

    // Redirect back if state is missing
    useEffect(() => {
        if (!email || !userType) {
            navigate('/login')
        }
    }, [])

    // Resend countdown
    useEffect(() => {
        if (resendTimer === 0) {
            setCanResend(true)
            return
        }
        const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000)
        return () => clearTimeout(timer)
    }, [resendTimer])

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return
        const updated = [...otp]
        updated[index] = value.slice(-1)
        setOtp(updated)
        if (value && index < OTP_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
        if (!pasted) return
        const updated = Array(OTP_LENGTH).fill('')
        pasted.split('').forEach((char, i) => { updated[i] = char })
        setOtp(updated)
        const nextEmpty = pasted.length < OTP_LENGTH ? pasted.length : OTP_LENGTH - 1
        inputsRef.current[nextEmpty]?.focus()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const otpString = otp.join('')
        if (otpString.length < OTP_LENGTH) {
            toast.error('Please enter the complete 6-digit OTP.')
            return
        }
        setLoading(true)
        try {
            const data = await verifyOtp({ email, otp: otpString, userType })
            loginSuccess(data)
            navigate(data.userType === 'Admin' ? '/admin' : '/account')
        } catch (err) {
            toast.error(err?.message)
            setOtp(Array(OTP_LENGTH).fill(''))
            inputsRef.current[0]?.focus()
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        if (!canResend || resendLoading) return
        setResendLoading(true)
        try {
            await login(formData)
            toast.success('A new OTP has been sent to your email.')
            setOtp(Array(OTP_LENGTH).fill(''))
            setResendTimer(30)
            setCanResend(false)
            inputsRef.current[0]?.focus()
        } catch (err) {
            toast.error(err?.message || 'Failed to resend OTP.')
        } finally {
            setResendLoading(false)
        }
    }

    const maskedEmail = email
        ? email.replace(/^(.{2})(.*)(@.*)$/, (_, a, b, c) => a + '*'.repeat(b.length) + c)
        : ''

    return (
        <div className='w-full h-screen flex items-center'>
            <div className='sm:w-1/2 w-full h-full flex justify-center items-center'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-6 w-full max-w-sm px-6'>
                    <div className='flex flex-col gap-1'>
                        <div className='flex items-center gap-2 mb-1'>
                            <div className='p-2 rounded-xl bg-blue-100'>
                                <ShieldCheck className='w-6 h-6 text-blue-600' />
                            </div>
                            <h1 className='text-3xl font-semibold'>Verify OTP</h1>
                        </div>
                        <p className='text-gray-500 text-sm leading-relaxed'>
                            We sent a 6-digit code to <span className='font-medium text-gray-800'>{maskedEmail}</span>. Enter it below to sign in.
                        </p>
                    </div>

                    {/* OTP Inputs */}
                    <div className='flex gap-2 sm:gap-3 justify-center' onPaste={handlePaste}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputsRef.current[index] = el)}
                                type='text'
                                inputMode='numeric'
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                autoFocus={index === 0}
                                className='w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all duration-200 border-neutral-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white'
                            />
                        ))}
                    </div>

                    <button
                        disabled={loading}
                        type='submit'
                        className='p-2.5 hover:bg-blue-600 transition-all duration-300 cursor-pointer flex justify-center items-center bg-blue-500 rounded-md text-white font-medium'
                    >
                        {loading ? <LoaderCircle className='animate-spin' /> : 'Verify & Sign In'}
                    </button>

                    {/* Resend OTP */}
                    <div className='flex items-center justify-center gap-1.5 text-sm text-gray-500'>
                        <span>Didn't receive the code?</span>
                        {canResend ? (
                            <button
                                type='button'
                                onClick={handleResend}
                                disabled={resendLoading}
                                className='flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium cursor-pointer disabled:opacity-60'
                            >
                                {resendLoading ? (
                                    <LoaderCircle className='w-4 h-4 animate-spin' />
                                ) : (
                                    <RotateCcw className='w-3.5 h-3.5' />
                                )}
                                Resend
                            </button>
                        ) : (
                            <span className='text-blue-500 font-medium'>Resend in {resendTimer}s</span>
                        )}
                    </div>

                    {/* Back to login */}
                    <button
                        type='button'
                        onClick={() => navigate('/login')}
                        className='flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors cursor-pointer'
                    >
                        <ArrowLeft className='w-4 h-4' />
                        Back to Login
                    </button>
                </form>
            </div>

            <div className='w-1/2 hidden md:flex flex-col justify-center items-center h-full bg-gradient-to-bl from-[#296ceb] via-[#2589db] to-[#1FABC8]'>
                <img src={LOGIN} alt='PG Panel' />
                <div className='w-full py-2 px-6 flex flex-col gap-1'>
                    <h1 className='text-3xl font-semibold text-white'>Modern Living, Unmatched Comfort.</h1>
                    <p className='text-neutral-100 font-light'>Discover a new state of co-living with state-of-the-art amenities and a vibrant community.</p>
                </div>
            </div>
        </div>
    )
}

export default OtpVerification
