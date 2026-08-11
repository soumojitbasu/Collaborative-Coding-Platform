const bcrypt = require("bcrypt");
const User = require("../models/User");

const changePasswordController = async (req, res) => {

    try {

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }

        const user = await User.findById(req.user.id);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {

            return res.status(400).json({
                message: "Current password is incorrect"
            });

        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({

            message: "Password updated successfully"

        });

    }

    catch (error) {

        return res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {
    changePasswordController
};