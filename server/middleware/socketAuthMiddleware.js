const jwt = require("jsonwebtoken");

const socketAuthMiddleware = (socket, next) => {

    try {
        console.log("Handshake auth:", socket.handshake.auth);

    const token = socket.handshake.auth.token;

    console.log("Token:", token);
        

        if (!token) {

            return next(new Error("Authentication required"));

        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        socket.user = decoded;

        next();

    } catch (error) {

        next(new Error("Invalid Token"));

    }

};

module.exports = socketAuthMiddleware;