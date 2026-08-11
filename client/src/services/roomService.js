import api from "./api";

export async function createRoom() {

    const response = await api.post("/rooms/create");

    return response.data;
}

export async function joinRoom(roomId) {

    const response = await api.post("/rooms/join", {
        roomId,
    });

    return response.data;
}