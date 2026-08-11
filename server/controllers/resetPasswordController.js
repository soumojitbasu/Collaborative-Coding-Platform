const bcrypt = require("bcrypt");
const User = require("../models/User");

const resetPasswordController = async (req, res) => {

    try {

        const { password } = req.body;

        if (!password) {

            return res.status(400).json({
                message: "New password is required"
            });

        }

        const user = await User.findById(req.user.id);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({
            message: "Password updated successfully"
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {
    resetPasswordController
};