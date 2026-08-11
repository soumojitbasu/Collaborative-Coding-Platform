import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import socket from "../socket/socket";

function CodeEditor({ roomId, initialCode }) {

    const [code, setCode] = useState(initialCode);

    const isRemoteUpdate = useRef(false);
    const debounceTimer = useRef(null);

    // Update editor when server sends latest room state
    useEffect(() => {

        setCode(initialCode);

    }, [initialCode]);

    // Listen for code updates from other users
    useEffect(() => {

        function handleCodeUpdate(newCode) {

            isRemoteUpdate.current = true;

            setCode(newCode);

        }

        socket.on("code-update", handleCodeUpdate);

        return () => {

            socket.off("code-update", handleCodeUpdate);

        };

    }, []);

    // Cleanup debounce timer
    useEffect(() => {

        return () => {

            clearTimeout(debounceTimer.current);

        };

    }, []);

    function handleEditorChange(value) {

        if (value === undefined) return;

        setCode(value);

        // Ignore updates coming from remote users
        if (isRemoteUpdate.current) {

            isRemoteUpdate.current = false;
            return;

        }

        clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(() => {

            socket.emit("code-change", {

                roomId,
                code: value

            });

        }, 100);

    }

    return (

        <Editor
            height="600px"
            defaultLanguage="cpp"
            value={code}
            onChange={handleEditorChange}
        />

    );

}

export default CodeEditor;