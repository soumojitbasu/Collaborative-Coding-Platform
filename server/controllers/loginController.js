const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


const loginController = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({

                message: "Email and Password are required"

            });

        }

        const user = await User.findOne({
    email
}).select("+password");

        if (!user) {

            return res.status(404).json({

                message: "User not found"

            });

        }

        if (!user.verified) {

            return res.status(403).json({

                message: "Please verify your email first."

            });

        }

        const isMatch = await bcrypt.compare(

            password,

            user.password

        );

        if (!isMatch) {

            return res.status(401).json({

                message: "Invalid Credentials"

            });

        }

        const token = jwt.sign(

            {

                id: user._id,

                email: user.email,

                role: user.role

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "1h"

            }

        );

        return res.status(200).json({

            message: "Login Successful",

            token,

            user: {

                id: user._id,

                email: user.email,

                role: user.role

            }

        });

    } catch (error) {

        return res.status(500).json({

            message: error.message

        });

    }

};
module.exports = { loginController };