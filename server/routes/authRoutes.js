const express = require("express");

const {
    registerController
} = require("../controllers/registerController");

const {
    verifyOTPController
} = require("../controllers/verifyOTPController");

const {
    loginController
} = require("../controllers/loginController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");
const { forgotPasswordController } = require("../controllers/forgotPasswordController");
const { resetPasswordController } = require("../controllers/resetPasswordController");
const { meController } = require("../controllers/meController");
const {
    changePasswordController
} = require("../controllers/changePasswordController");
// console.log("forgotPasswordController:", forgotPasswordController);
// console.log("resetPasswordController:", resetPasswordController);
// console.log("loginController:", loginController);
const router = express.Router();

// Register
router.post("/register", registerController);

// Verify OTP
router.post("/verify-otp", verifyOTPController);

// Login
router.post("/login", loginController);

//forget password
router.post("/forget-password",forgotPasswordController);

//reset password
router.post("/reset-password", authMiddleware, resetPasswordController);
//admin route
router.get("/admin", authMiddleware, adminMiddleware, (req, res) => {
    res.status(200).json({
        message: "Welcome Admin!"
    });
});
router.get("/me", authMiddleware,meController);
router.post("/change-password", authMiddleware, changePasswordController);

module.exports = router;