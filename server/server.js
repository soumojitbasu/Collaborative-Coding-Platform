require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");

const socketAuthMiddleware = require("./middleware/socketAuthMiddleware");
const registerSocketHandlers = require("./socket");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.send("Authentication API Running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

// Socket Authentication
io.use(socketAuthMiddleware);

// Register all socket events
registerSocketHandlers(io);

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {

    try {

        await connectDB();

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {

        console.error(err);

    }

};

startServer();