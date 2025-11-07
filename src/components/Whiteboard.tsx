import React, { useEffect, useRef, useCallback, memo } from "react";
import { Tldraw } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import { socket } from "./WebRTCManager";
import debounce from "lodash/debounce";

interface WhiteboardProps {
  roomID: string;
}

const Whiteboard: React.FC<WhiteboardProps> = memo(({ roomID }) => {
  const editorRef = useRef<any>(null);
  const initialLoadDoneRef = useRef(false);
  const lastSentStateRef = useRef<string | null>(null); // Track last sent state

  const debouncedUpdate = useCallback(
    debounce(() => {
      if (editorRef.current && initialLoadDoneRef.current) {
        try {
          const state = editorRef.current.store?.getSnapshot();
          const stateString = JSON.stringify(state);
          if (stateString !== lastSentStateRef.current) {
            // Only send if changed
            console.log("Syncing whiteboard changes to server");
            socket.emit("whiteboard-update", { room: roomID, state });
            lastSentStateRef.current = stateString;
          }
        } catch (err) {
          console.error("Error getting whiteboard state:", err);
        }
      }
    }, 500),
    [roomID]
  );

  const handleRemoteUpdate = useCallback(({ state }: { state: any }) => {
    if (editorRef.current && state) {
      const stateString = JSON.stringify(state);
      if (stateString === lastSentStateRef.current) {
        console.log("Ignoring self-originated update");
        return; // Skip if this is our own update
      }
      console.log("Applying whiteboard update from server");
      try {
        editorRef.current.store?.loadSnapshot(state);
      } catch (err) {
        console.error("Error loading whiteboard state:", err);
      }
    }
  }, []);

  const handleInitialState = useCallback(({ state }: { state: any }) => {
    if (editorRef.current && state && !initialLoadDoneRef.current) {
      console.log("Loading initial whiteboard state");
      try {
        editorRef.current.store?.loadSnapshot(state);
        initialLoadDoneRef.current = true;
      } catch (err) {
        console.error("Error loading initial whiteboard state:", err);
      }
    } else if (!state) {
      initialLoadDoneRef.current = true; // No state, mark as initialized
    }
  }, []);

  useEffect(() => {
    initialLoadDoneRef.current = false;
    lastSentStateRef.current = null;

    socket.off("whiteboard-update");
    socket.off("whiteboard-init");

    socket.on("whiteboard-update", handleRemoteUpdate);
    socket.on("whiteboard-init", handleInitialState);

    socket.emit("request-whiteboard-state", { room: roomID });

    return () => {
      socket.off("whiteboard-update", handleRemoteUpdate);
      socket.off("whiteboard-init", handleInitialState);
      debouncedUpdate.cancel();
    };
  }, [roomID, handleRemoteUpdate, handleInitialState, debouncedUpdate]);

  const handleEditorMount = useCallback(
    (editor: any) => {
      console.log("Tldraw editor mounted");
      editorRef.current = editor;
      editor.on("change", debouncedUpdate);
    },
    [debouncedUpdate]
  );

  return (
    <div
      className="whiteboard-container"
      style={{
        width: "600px",
        height: "450px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <Tldraw inferDarkMode={true} onMount={handleEditorMount} />
    </div>
  );
});

export default Whiteboard;
