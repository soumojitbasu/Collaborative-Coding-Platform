import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import socket from "../socket/socket";
import CodeEditor from "../components/CodeEditor";

function RoomPage() {

    const { roomId } = useParams();

    const [participants, setParticipants] = useState([]);

    const [initialCode, setInitialCode] = useState("");

    useEffect(() => {


        function handleConnect() {

            console.log("Socket Connected");
            console.log(socket.id);

            console.log("Emitting join-room");

            socket.emit("join-room", roomId);

        }

        function handleJoinedRoom(data) {

            console.log("Joined Room");

            console.log(data);

            setParticipants(data.participants);

            setInitialCode(data.code);

        }

        function handleUserJoined(participant) {

            console.log("User Joined");

            console.log(participant);

            setParticipants(prev => {

                const exists = prev.some(

                    p => p.userId === participant.userId

                );

                if (exists) return prev;

                return [

                    ...prev,

                    participant

                ];

            });

        }
        function handleUserLeft(userId) {

                setParticipants(prev =>

                    prev.filter(

                        participant => participant.userId !== userId

                    )

                );

            }
        if (socket.connected) {

                handleConnect();

            } else {

                socket.connect();

            }

        socket.on("connect", handleConnect);

        socket.on("joined-room", handleJoinedRoom);

        socket.on("user-joined", handleUserJoined);
        
        socket.on("user-left", handleUserLeft);

        return () => {

            socket.off("connect", handleConnect);

            socket.off("joined-room", handleJoinedRoom);

            socket.off("user-joined", handleUserJoined);

            socket.off("user-left", handleUserLeft);

        };

    }, [roomId]);

    return (

        <>

            <h2>Room : {roomId}</h2>

            <CodeEditor

                roomId={roomId}

                initialCode={initialCode}

            />

            <h3>Participants ({participants.length})</h3>

            {

                participants.map(participant => (

                    <div
                        key={participant.userId}
                        style={{
                            border: "1px solid gray",
                            padding: "8px",
                            marginBottom: "8px"
                        }}
                    >

                        <pre>

                            {JSON.stringify(participant, null, 2)}

                        </pre>

                    </div>

                ))

            }

        </>

    );

}

export default RoomPage;