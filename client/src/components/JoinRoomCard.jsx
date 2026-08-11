import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { joinRoom } from "../services/roomService";

function JoinRoomCard() {

    const navigate = useNavigate();

    const [roomId, setRoomId] = useState("");

    async function handleJoinRoom() {

        try {

            await joinRoom(roomId);

            navigate(`/room/${roomId}`);

        }

        catch (err) {

            alert(err.response?.data?.message);

        }

    }

    return (

        <div>

            <h2>Join Existing Room</h2>

            <input

                placeholder="Room ID"

                value={roomId}

                onChange={(e)=>setRoomId(e.target.value)}

            />

            <br /><br />

            <button

                onClick={handleJoinRoom}

            >

                Join Room

            </button>

        </div>

    );

}

export default JoinRoomCard;