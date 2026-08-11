const bcrypt = require("bcrypt");
const User = require("../models/User");

const verifyOTPController = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.verified) {
            return res.status(400).json({
                message: "User already verified"
            });
        }

        if (Date.now() > user.otpExpires) {
            return res.status(400).json({
                message: "OTP has expired"
            });
        }

        const isMatch = await bcrypt.compare(
            otp,
            user.otp
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        user.verified = true;

        user.otp = undefined;
        user.otpExpires = undefined;
        user.otpAttempts = undefined;

        await user.save();

        return res.status(200).json({
            message: "Email verified successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    verifyOTPController
};