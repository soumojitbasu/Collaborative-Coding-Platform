const rooms = require("../store/roomStore");

const joinRoomController = async (req, res) => {
    try {

        const { roomId } = req.body;

        if (!roomId) {
            return res.status(400).json({
                message: "Room ID is required"
            });
        }

        if (!rooms.has(roomId)) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        const room = rooms.get(roomId);

        const alreadyJoined = room.participants.some(
            participant => participant.userId === req.user.id
        );

        if (alreadyJoined) {
            return res.status(200).json({
                message: "Already in room"
            });
        }

        room.participants.push({
            userId: req.user.id,
            username: req.user.username,
            socketId: null
        });

        return res.status(200).json({
            message: "Joined room successfully",
            roomId
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }
};

module.exports = joinRoomController;