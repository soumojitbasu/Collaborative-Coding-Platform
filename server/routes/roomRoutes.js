const express = require("express");
const  createRoomController = require("../controllers/createRoomController");
const  joinRoomController  = require("../controllers/joinRoomController");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

// Create Room
router.post("/create", authMiddleware, createRoomController);
router.post("/join", authMiddleware, joinRoomController);
module.exports = router;