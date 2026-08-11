import { io } from "socket.io-client";
import { getToken } from "../utils/auth";

const socket = io("http://localhost:5000", {
    autoConnect: false,
    auth: {
        token: getToken(),
    },
});

export default socket;