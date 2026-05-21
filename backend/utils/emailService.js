import nodemailer from 'nodemailer'

const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    })
}

export const sendOtpEmail = async (toEmail, otp) => {
    const transporter = createTransporter()

    const mailOptions = {
        from: `"PG Panel" <${process.env.GMAIL_USER}>`,
        to: toEmail,
        subject: 'Your Login OTP - PG Panel',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 12px;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <h1 style="color: #1d4ed8; font-size: 24px; margin: 0;">PG Panel</h1>
                    <p style="color: #6b7280; margin: 6px 0 0;">Two-Factor Authentication</p>
                </div>
                <div style="background: #ffffff; border-radius: 10px; padding: 24px; box-shadow: 0 1px 4px rgba(0,0,0,0.06);">
                    <p style="color: #374151; font-size: 15px; margin-top: 0;">Hello,</p>
                    <p style="color: #374151; font-size: 15px;">Your one-time password (OTP) for signing in to PG Panel is:</p>
                    <div style="text-align: center; margin: 28px 0;">
                        <span style="display: inline-block; background: #eff6ff; color: #1d4ed8; font-size: 36px; font-weight: 700; letter-spacing: 10px; padding: 14px 28px; border-radius: 10px; border: 2px dashed #bfdbfe;">${otp}</span>
                    </div>
                    <p style="color: #6b7280; font-size: 13px;">This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
                    <p style="color: #6b7280; font-size: 13px;">If you did not request this, please ignore this email or contact support.</p>
                </div>
                <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 20px;">© PG Panel. All rights reserved.</p>
            </div>
        `,
    }

    await transporter.sendMail(mailOptions)
}
