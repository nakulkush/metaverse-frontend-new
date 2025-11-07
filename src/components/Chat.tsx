// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { Socket } from "socket.io-client";
// import DOMPurify from "dompurify";
// import ShareIcon from "./ui/ShareIcon";

// interface ChatProps {
//   socket: Socket;
//   room: string;
//   name: string;
// }

// interface Message {
//   senderId: string;
//   senderName: string;
//   message: string;
//   time: string;
// }

// const MAX_MESSAGES = 100;

// const Chat: React.FC<ChatProps> = ({ socket, room, name }) => {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [messageInput, setMessageInput] = useState("");
//   const [socketError, setSocketError] = useState<string | null>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const handleReceiveMessage = useCallback((messageData: Message) => {
//     setMessages((prev) => {
//       if (
//         prev.some(
//           (msg) =>
//             msg.senderId === messageData.senderId &&
//             msg.message === messageData.message
//         )
//       ) {
//         return prev;
//       }
//       const updatedMessages = [...prev, messageData];
//       return updatedMessages.slice(-MAX_MESSAGES);
//     });
//   }, []);

//   useEffect(() => {
//     const handleConnect = () => setSocketError(null);
//     const handleDisconnect = () => setSocketError("Disconnected from chat");
//     const handleConnectError = (error: Error) => setSocketError(error.message);

//     socket.on("receive message", handleReceiveMessage);
//     socket.on("connect", handleConnect);
//     socket.on("disconnect", handleDisconnect);
//     socket.on("connect_error", handleConnectError);

//     return () => {
//       socket.off("receive message", handleReceiveMessage);
//       socket.off("connect", handleConnect);
//       socket.off("disconnect", handleDisconnect);
//       socket.off("connect_error", handleConnectError);
//     };
//   }, [socket, handleReceiveMessage]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = () => {
//     const trimmedMessage = messageInput.trim();
//     if (!trimmedMessage) return;

//     const sanitizedMessage = DOMPurify.sanitize(trimmedMessage);

//     const messageData = {
//       room,
//       senderId: socket.id || "unknown",
//       senderName: name,
//       message: sanitizedMessage,
//       time: new Date().toISOString(),
//     };

//     try {
//       socket.emit("send message", { ...messageData, excludeSelf: true });
//       setMessages((prev) => {
//         const updatedMessages = [...prev, messageData];
//         return updatedMessages.slice(-MAX_MESSAGES);
//       });
//       setMessageInput("");
//     } catch (error) {
//       console.error("Message send failed:", error);
//       setSocketError("Failed to send message");
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       sendMessage();
//     }
//   };

//   return (
//     <div className="bg-gray-900 rounded-2xl border-white border p-2 w-[480px] h-[480px] flex flex-col">
//       {socketError && (
//         <div className="text-red-500 text-sm mb-2">{socketError}</div>
//       )}

//       <div
//         className="flex-1 overflow-y-auto flex flex-col"
//         style={{
//           scrollbarWidth: "none", // Firefox
//           msOverflowStyle: "none", // IE/Edge
//         }}
//       >
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`flex ${
//               msg.senderId === socket.id ? "justify-end" : "justify-start"
//             } mb-1`}
//           >
//             <div
//               className={`max-w-[70%] p-1 rounded-lg ${
//                 msg.senderId === socket.id
//                   ? "bg-white text-black"
//                   : "bg-gray-700 text-white"
//               }`}
//             >
//               {msg.senderId !== socket.id && (
//                 <div className="text-xs mb-1">{msg.senderName}</div>
//               )}
//               <div className="text-sm">{msg.message}</div>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//         {/* Inline style for Webkit browsers */}
//         <style>
//           {`
//             .overflow-y-auto::-webkit-scrollbar {
//               display: none;
//             }
//           `}
//         </style>
//       </div>

//       <div className="flex gap-1 items-center mt-2">
//         <input
//           type="text"
//           value={messageInput}
//           onChange={(e) => setMessageInput(e.target.value)}
//           onKeyPress={handleKeyPress}
//           className="flex-1 p-1 py-1.5 bg-black text-white text-xs rounded-md"
//           placeholder="send a msg to everyone..."
//           disabled={!!socketError}
//         />
//         <button
//           onClick={sendMessage}
//           className="px-2 py-1.5 bg-black hover:bg-gray-800 text-white text-sm rounded-md transition-colors"
//           disabled={!!socketError}
//         >
//           <ShareIcon />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chat;

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Socket } from "socket.io-client";
import DOMPurify from "dompurify";
import ShareIcon from "./ui/ShareIcon";

interface ChatProps {
  socket: Socket;
  room: string;
  name: string;
}

interface Message {
  senderId: string;
  senderName: string;
  message: string;
  time: string;
}

const MAX_MESSAGES = 100;

const Chat: React.FC<ChatProps> = ({ socket, room, name }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [socketError, setSocketError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleReceiveMessage = useCallback((messageData: Message) => {
    setMessages((prev) => {
      if (
        prev.some(
          (msg) =>
            msg.senderId === messageData.senderId &&
            msg.message === messageData.message &&
            msg.time === messageData.time
        )
      ) {
        return prev;
      }
      const updatedMessages = [...prev, messageData];
      return updatedMessages.slice(-MAX_MESSAGES);
    });
  }, []);

  useEffect(() => {
    const handleConnect = () => setSocketError(null);
    const handleDisconnect = () => setSocketError("Disconnected from chat");
    const handleConnectError = (error: Error) => setSocketError(error.message);

    socket.on("receive message", handleReceiveMessage);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    // listen for history from server
    socket.on("chat history", (history: Message[]) => {
      setMessages(history.slice(-MAX_MESSAGES));
    });

    // listen for summary
    socket.on("chat summary", ({ summary }) => {
      setSummary(summary);
      setShowSummary(true);
    });

    // request chat history when joining
    socket.emit("request history", { roomID: room });

    return () => {
      socket.off("receive message", handleReceiveMessage);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("chat history");
      socket.off("chat summary");
    };
  }, [socket, room, handleReceiveMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const trimmedMessage = messageInput.trim();
    if (!trimmedMessage) return;

    const sanitizedMessage = DOMPurify.sanitize(trimmedMessage);

    const messageData = {
      room,
      senderId: socket.id || "unknown",
      senderName: name,
      message: sanitizedMessage,
      time: new Date().toISOString(),
    };

    try {
      socket.emit("send message", { ...messageData, excludeSelf: true });
      setMessages((prev) => {
        const updatedMessages = [...prev, messageData];
        return updatedMessages.slice(-MAX_MESSAGES);
      });
      setMessageInput("");
    } catch (error) {
      console.error("Message send failed:", error);
      setSocketError("Failed to send message");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const requestSummary = () => {
    socket.emit("request summary", { roomID: room });
  };

  return (
    <div className="bg-gray-900 rounded-2xl border-white border p-2 w-[400px] h-[480px] flex flex-col">
      {socketError && (
        <div className="text-red-500 text-sm mb-2">{socketError}</div>
      )}

      <div
        className="flex-1 overflow-y-auto flex flex-col"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE/Edge
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.senderId === socket.id ? "justify-end" : "justify-start"
            } mb-1`}
          >
            <div
              className={`max-w-[70%] p-1 rounded-lg ${
                msg.senderId === socket.id
                  ? "bg-white text-black"
                  : "bg-gray-700 text-white"
              }`}
            >
              {msg.senderId !== socket.id && (
                <div className="text-xs mb-1">{msg.senderName}</div>
              )}
              <div className="text-sm">{msg.message}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        {/* Inline style for Webkit browsers */}
        <style>
          {`
            .overflow-y-auto::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
      </div>

      {/* Input + send */}

      {/* Generate Summary button */}
      {/* <button
        onClick={requestSummary}
        className="mt-2 px-3 w-[120px] py-1.5 bg-gray-200  hover:bg-indigo-500 text-black text-xs rounded-md"
      >
        Summarise!!
      </button> */}
      {/* Generate Summary button */}
      <div className="flex justify-end">
        <button
          onClick={requestSummary}
          className="mt-2 px-3 w-[120px] py-1.5 bg-gray-200 hover:bg-gray-400 text-black text-xs rounded-md"
        >
          Summarise!
        </button>
      </div>

      <div className="flex gap-1 items-center mt-2">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 p-1 py-1.5 bg-black  border-t-0 border border-white text-white text-xs rounded-md"
          placeholder="Send a msg to everyone..."
          disabled={!!socketError}
        />
        <button
          onClick={sendMessage}
          className="px-2 py-1.5 bg-black hover:bg-gray-800 border-t-0 border border-white text-white text-sm rounded-md transition-colors"
          disabled={!!socketError}
        >
          <ShareIcon />
        </button>
      </div>

      {/* Summary box */}
      {showSummary && summary && (
        <div className="mt-2 p-2 bg-gray-800 text-xs text-white rounded-md max-h-40 overflow-y-auto">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-indigo-400">Chat Summary</span>
            <button
              onClick={() => setShowSummary(false)}
              className="text-red-400 text-xs"
            >
              Close
            </button>
          </div>
          <div>{summary}</div>
        </div>
      )}
    </div>
  );
};

export default Chat;
