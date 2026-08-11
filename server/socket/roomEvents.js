const rooms = require("../store/roomStore");

function registerRoomEvents(io, socket) {

    // ------------------------
    // Join Room
    // ------------------------

    socket.on("join-room", (roomId) => {

        if (!rooms.has(roomId)) {

            socket.emit("room-error", {
                message: "Room not found"
            });

            return;

        }

        const room = rooms.get(roomId);

        let participant = room.participants.find(
            p => p.userId === socket.user.id
        );

        // First Join
        if (!participant) {

            participant = {

                userId: socket.user.id,
                email: socket.user.email,
                socketId: socket.id,
                joinedAt: new Date()

            };

            room.participants.push(participant);

            console.log("New Participant:");
            console.log(participant);

        }

        // Reconnect
        else {

            participant.socketId = socket.id;

            console.log("Reconnected:");
            console.log(participant);

        }

        // Leave previous rooms
        for (const joinedRoom of socket.rooms) {

            if (joinedRoom !== socket.id) {

                socket.leave(joinedRoom);

            }

        }

        socket.join(roomId);

        console.log("Current Participants:");
        console.log(room.participants);

        socket.to(roomId).emit(
            "user-joined",
            participant
        );

        socket.emit("joined-room", {

            roomId,

            participants: room.participants,

            code: room.code,

            language: room.language

        });

    });

    // ------------------------
    // Code Sync
    // ------------------------

    socket.on("code-change", ({ roomId, code }) => {

        if (!rooms.has(roomId)) return;

        const room = rooms.get(roomId);

        room.code = code;

        socket.to(roomId).emit(
            "code-update",
            code
        );

    });

    // ------------------------
    // Disconnect
    // ------------------------

    socket.on("disconnect", () => {

        console.log(`Disconnected : ${socket.id}`);

    });

}

module.exports = registerRoomEvents;