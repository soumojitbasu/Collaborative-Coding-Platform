const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../services/emailService");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const registerController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate Input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        // Check Existing User
        const existingUser = await User.findOne({ email: normalizedEmail });

        // Hash Password & OTP in parallel
        const [hashedPassword, hashedOTP] = await Promise.all([
            bcrypt.hash(password, 10),
            bcrypt.hash(generateOTP(), 10)
        ]);

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        if (existingUser) {
            if (existingUser.verified) {
                return res.status(409).json({
                    success: false,
                    message: "An account with this email already exists. Please log in."
                });
            }

            // Update unverified user with fresh credentials
            existingUser.password = hashedPassword;
            existingUser.otp = hashedOTP;
            existingUser.otpExpires = otpExpires;
            existingUser.otpAttempts = 0;
            await existingUser.save();
        } else {
            // Create New User
            await User.create({
                email: normalizedEmail,
                password: hashedPassword,
                verified: false,
                otp: hashedOTP,
                otpExpires,
                otpAttempts: 0
            });
        }

        // Dispatch Email Asynchronously without blocking the HTTP response
        sendEmail(
            normalizedEmail,
            "Verify Your CodeSync Account",
            `Welcome to CodeSync!\n\nYour 6-digit email verification code is: ${otp}\n\nThis code expires in 10 minutes. If you did not sign up for an account, please ignore this email.`
        ).catch((err) => {
            console.error("Async email dispatch error:", err.message);
        });

        // Return immediate response to the client (< 50ms)
        return res.status(201).json({
            success: true,
            message: "Registration successful! A verification code has been sent to your email.",
            email: normalizedEmail
        });

    } catch (error) {
        console.error("registerController error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to register user"
        });
    }
};

module.exports = {
    registerController
};