import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createRoom } from "../services/roomService";

function CreateRoomCard() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    async function handleCreateRoom() {

        try {

            setLoading(true);

            const room = await createRoom();

            navigate(`/room/${room.roomId}`);

        }

        catch (err) {

            alert(err.response?.data?.message);

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div>

            <h2>Create New Room</h2>

            <button

                disabled={loading}

                onClick={handleCreateRoom}

            >

                {

                    loading ?

                    "Creating..."

                    :

                    "Create Room"

                }

            </button>

        </div>

    );

}

export default CreateRoomCard;