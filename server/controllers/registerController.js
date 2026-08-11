const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../services/emailService");

const registerController = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Validate Input
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check Existing User
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = generateOTP();

        // Hash OTP
        const hashedOTP = await bcrypt.hash(otp, 10);

        // OTP Expiry (10 minutes)
        const otpExpires = new Date(
            Date.now() + 10 * 60 * 1000
        );

        // Create User
        await User.create({
            email,
            password: hashedPassword,
            verified: false,
            otp: hashedOTP,
            otpExpires,
            otpAttempts: 0
        });

        // Send OTP Email
        await sendEmail(
            email,
            "Verify Your Email",
            `Your OTP is ${otp}`
        );

        return res.status(201).json({
            message: "Registration successful. Please verify your email."
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    registerController
};