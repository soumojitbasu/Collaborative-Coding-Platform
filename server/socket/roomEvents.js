const {

    rooms,
    disconnectTimers

} = require("../store/roomStore");

function registerRoomEvents(io, socket) {

    console.log("Room events registered for", socket.id);

    // ------------------------
    // Join Room
    // ------------------------

    socket.on("join-room", (roomId) => {

        console.log("JOIN ROOM EVENT RECEIVED");
        console.log(roomId);

        if (!rooms.has(roomId)) {

            socket.emit("room-error", {
                message: "Room not found"
            });

            return;

        }

        const room = rooms.get(roomId);

        // Cancel pending removal if this user reconnects
        const timerKey = `${roomId}-${socket.user.id}`;

        if (disconnectTimers.has(timerKey)) {

            clearTimeout(
                disconnectTimers.get(timerKey)
            );

            disconnectTimers.delete(timerKey);

            console.log(`${socket.user.email} reconnected before timeout`);

        }

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

            console.log("New Participant");
            console.log(participant);

        }

        // Reconnection
        else {

            participant.socketId = socket.id;

            console.log("Reconnected");
            console.log(participant);

        }

        // Leave previous collaboration rooms
        for (const joinedRoom of socket.rooms) {

            if (joinedRoom !== socket.id) {

                socket.leave(joinedRoom);

            }

        }

        socket.join(roomId);

        console.log("Current Participants");

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
    // Cursor Sync
    // ------------------------
    socket.on("cursor-change", (data) => {

            const {

                roomId,
                lineNumber,
                column

            } = data;

            if (!rooms.has(roomId)) {

                return;

            }

            socket.to(roomId).emit(

                "cursor-update",

                {

                    userId: socket.user.id,

                    email: socket.user.email,

                    lineNumber,

                    column

                }

            );

        });
    // ------------------------
    // Disconnect
    // ------------------------

    socket.on("disconnect", () => {

        console.log(`${socket.user.email} disconnected`);

        for (const [roomId, room] of rooms.entries()) {

            const participant = room.participants.find(

                p => p.userId === socket.user.id

            );

            if (!participant) continue;

            const timerKey = `${roomId}-${socket.user.id}`;

            const timer = setTimeout(() => {

                room.participants = room.participants.filter(

                    p => p.userId !== socket.user.id

                );

                io.to(roomId).emit(

                    "user-left",

                    socket.user.id

                );

                disconnectTimers.delete(timerKey);

                console.log(`${socket.user.email} removed from room`);

                console.log(room.participants);

            }, 30000);

            disconnectTimers.set(

                timerKey,

                timer

            );

        }

    });

}

module.exports = registerRoomEvents;