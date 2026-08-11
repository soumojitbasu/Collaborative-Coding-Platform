const registerRoomEvents = require("./roomEvents");

function registerSocketHandlers(io) {

    io.on("connection", (socket) => {

        console.log(`Client Connected: ${socket.id}`);

        registerRoomEvents(io, socket);

    });

}

module.exports = registerSocketHandlers;