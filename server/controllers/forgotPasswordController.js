const User =require("../models/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../services/emailService");

const forgotPasswordController = async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {

            return res.status(400).json({
                message: "Email is required"
            });

        }

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(200).json({
                message: "If an account exists, a reset link has been sent."
            });

        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetToken = hashedToken;

        user.resetTokenExpires = new Date(
            Date.now() + 15 * 60 * 1000
        );

        await user.save();

       const resetLink =
`${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

        await sendEmail(

            email,

            "Reset Password",

            `Click here to reset your password:

${resetLink}`

        );

        return res.status(200).json({

            message:
            "If an account exists, a reset link has been sent."

        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

};
module.exports = {
    forgotPasswordController
};