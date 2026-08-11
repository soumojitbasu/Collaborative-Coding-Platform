import { useEffect, useRef, useState,useCallback } from "react";
import Editor from "@monaco-editor/react";
import socket from "../socket/socket";

function CodeEditor({ roomId, initialCode }) {

    const [code, setCode] = useState(initialCode);

    const isRemoteUpdate = useRef(false);
    const debounceTimer = useRef(null);
    const throttleTimer = useRef(null);
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
        function handleCursorUpdate(data) {

                console.log(

                    "Remote Cursor",

                    data

                );

            }
            socket.on("cursor-update",handleCursorUpdate);

        return () => {

            socket.off("code-update", handleCodeUpdate);

            socket.off("cursor-update", handleCursorUpdate);

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
    const handleEditorMount = useCallback((editor) => {

    editor.onDidChangeCursorPosition((event) => {

        if (throttleTimer.current) {

            return;

        }

        throttleTimer.current = setTimeout(() => {

            throttleTimer.current = null;

        }, 50);

        socket.emit(

            "cursor-change",

            {

                roomId,

                lineNumber:

                    event.position.lineNumber,

                column:

                    event.position.column

            }

        );

    });

}, [roomId]);

    return (

        <Editor
            height="600px"
            defaultLanguage="cpp"
            value={code}
            onChange={handleEditorChange}
            onMount={handleEditorMount}
        />

    );

}

export default CodeEditor;