const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../services/emailService");

const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email address is required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            // Return success message regardless to prevent user account enumeration
            return res.status(200).json({
                success: true,
                message: "If an account exists with this email, a password reset link has been sent."
            });
        }

        // Generate a cryptographically secure random reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash token for database storage
        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetToken = hashedToken;
        user.resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes validity
        await user.save();

        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        const resetLink = `${clientUrl}/reset-password?token=${resetToken}`;

        try {
            await sendEmail(
                normalizedEmail,
                "Password Reset Request — CodeSync",
                `Hello,\n\nYou requested a password reset for your CodeSync account.\n\nPlease click the link below to set a new password:\n\n${resetLink}\n\nThis link is valid for 15 minutes.\n\nIf you did not request this password reset, you can safely ignore this email.`
            );
        } catch (emailErr) {
            console.error("Failed to send reset email:", emailErr.message);
        }

        return res.status(200).json({
            success: true,
            message: "If an account exists with this email, a password reset link has been sent."
        });

    } catch (error) {
        console.error("forgotPassword error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to process password reset request."
        });
    }
};

module.exports = {
    forgotPasswordController
};