// import { useState, useEffect } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { socket } from "./WebRTCManager";
// import Chat from "./Chat";
// import GameCanvas from "./GameCanvas";
// import { useWebRTC } from "./WebRTCManager";
// import { VideoContainer } from "./VideoComponents";
// import Whiteboard from "./Whiteboard";
// import { Exit } from "./icons/Exit";
// import { Wb2 } from "./icons/Wb2";

// function Room() {
//   const { roomID } = useParams<{ roomID: string }>();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const {
//     name: initialName,
//     mic: initialMic,
//     cam: initialCam,
//     loves: initialLoves,
//   } = location.state || {};

//   const [name, setName] = useState(initialName || "");
//   const [open, setOpen] = useState(true); //new changes on 27/8
//   // const [mic, setMic] = useState(initialMic !== undefined ? initialMic : true);
//   // const [cam, setCam] = useState(initialCam !== undefined ? initialCam : true);
//   const [mic, setMic] = useState(true); // Force mic on for testing
//   const [cam, setCam] = useState(true); // Force cam on for testing

//   const [isWhiteboardVisible, setIsWhiteboardVisible] = useState(false);

//   const {
//     users,
//     setUsers,
//     nearby,
//     peerStreams,
//     error,
//     userVideoRef,
//     handleJoinRoom,
//     leaveRoom,
//   } = useWebRTC({
//     roomID,
//     name,
//     mic,
//     cam,
//     initialLoves,
//     setName,
//     setMic,
//     setCam,
//     setJoinedRoom: () => {},
//     navigate,
//   });

//   useEffect(() => {
//     if (!initialName || !roomID) {
//       navigate("/");
//     } else {
//       handleJoinRoom(name, mic, cam);
//     }
//   }, [initialName, name, mic, cam, roomID, handleJoinRoom, navigate]);

//   if (!roomID || !initialName) return null;

//   return (
//     <div className="relative min-h-screen bg-black text-white">
//       <div className="absolute inset-0 z-0">
//         <GameCanvas
//           users={users}
//           roomID={roomID}
//           name={name}
//           setUsers={setUsers}
//         />
//       </div>
//       <div className="relative z-10 flex flex-col h-full">
//         <div className="flex justify-between items-start p-4">
//           <div className="w-full md:w-3/4">
//             <VideoContainer
//               name={name}
//               mic={mic}
//               cam={cam}
//               nearby={nearby}
//               userVideoRef={userVideoRef}
//               peerStreams={peerStreams}
//               setMic={setMic}
//               setCam={setCam}
//             />
//           </div>
//           <div className="flex gap-2">
//             {nearby.length > 0 && (
//               <button
//                 onClick={() => setIsWhiteboardVisible(!isWhiteboardVisible)}
//                 className="px-2 py-1 bg-black bg-opacity-80 hover:bg-gray-700 text-white text-sm rounded-md border border-gray-600 transition-colors"
//               >
//                 {/* {isWhiteboardVisible ? "Hide WB" : "Show WB"} */}
//                 <Wb2 />
//               </button>
//             )}
//             <button
//               onClick={leaveRoom}
//               className="px-2 py-1 bg-black bg-opacity-80 hover:bg-red-700 text-white text-sm rounded-md border border-gray-600 transition-colors"
//             >
//               {/* Leave? */}
//               <Exit />
//             </button>
//           </div>
//         </div>
//         {/* {isWhiteboardVisible && nearby.length > 0 && (
//           <div className="fixed top-10 right-96 mt-8 w-60 max-h-48 z-20">
//             <Whiteboard roomID={roomID} />
//           </div>
//         )} */}
//         <div
//           className="fixed top-10 right-96 mt-8 w-60 max-h-48 z-20"
//           style={{
//             display:
//               isWhiteboardVisible && nearby.length > 0 ? "block" : "none",
//           }}
//         >
//           <Whiteboard roomID={roomID} />
//         </div>

//         {/* //Commented on 27/8
//         {roomID && (
//           <div className="fixed bottom-0 left-0 m-4  z-20">
//             <Chat socket={socket} room={roomID} name={name} />
//           </div>
//           // max-h-48
//           //  w-60
//         )} */}
//         {roomID && (
//           <div className="fixed bottom-0 left-0 m-4 z-20">
//             {/* Toggle Button */}
//             <button
//               onClick={() => setOpen(!open)}
//               className="mb-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg shadow-md hover:bg-blue-700 transition"
//             >
//               {open ? "Hide Chat" : "Show Chat"}
//             </button>

//             {/* Chat Box (mounted always, only hidden when closed) */}
//             <div
//               className={` bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 ${
//                 open ? "block" : "hidden"
//               }`}
//             >
//               <Chat socket={socket} room={roomID} name={name} />
//             </div>
//           </div>
//         )}
//         {error && (
//           <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-red-500 text-center bg-gray-800 bg-opacity-80 px-4 py-2 rounded-md border border-gray-600 z-20">
//             {error}
//           </p>
//         )}
//         {error && (
//           <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-red-500 text-center bg-gray-800 bg-opacity-80 px-4 py-2 rounded-md border border-gray-600 z-20">
//             <p>{error}</p>
//             <button
//               onClick={() => handleJoinRoom(name, mic, cam)}
//               className="mt-2 px-2 py-1 bg-red-700 text-white rounded-md"
//             >
//               Retry
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Room;

import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { socket } from "./WebRTCManager";
import Chat from "./Chat";
import GameCanvas from "./GameCanvas";
import { useWebRTC } from "./WebRTCManager";
import { VideoContainer } from "./VideoComponents";
import Whiteboard from "./Whiteboard";
import { Exit } from "./icons/Exit";
import { Wb2 } from "./icons/Wb2";
import { EmailSummaryModal } from "./EmailSummaryModal"; // ✅ new import

function Room() {
  const { roomID } = useParams<{ roomID: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    name: initialName,
    // mic: initialMic,
    // cam: initialCam,
    loves: initialLoves,
  } = location.state || {};

  const [name, setName] = useState(initialName || "");
  const [open, setOpen] = useState(true);
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [isWhiteboardVisible, setIsWhiteboardVisible] = useState(false);

  // ✅ New state variables for transcription & email modal
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [transcriptionReady, setTranscriptionReady] = useState(false);
  const [roomName, setRoomName] = useState(roomID || "");

  const {
    users,
    setUsers,
    nearby,
    peerStreams,
    error,
    userVideoRef,
    handleJoinRoom,
    leaveRoom,
  } = useWebRTC({
    roomID,
    name,
    mic,
    cam,
    initialLoves,
    setName,
    setMic,
    setCam,
    setJoinedRoom: () => {},
    navigate,
  });

  // ✅ Handle joining
  useEffect(() => {
    if (!initialName || !roomID) {
      navigate("/");
    } else {
      handleJoinRoom(name, mic, cam);
    }
  }, [initialName, name, mic, cam, roomID, handleJoinRoom, navigate]);

  // ✅ Make sure socket joins the Socket.IO room
  useEffect(() => {
    if (roomID && socket) {
      // The socket should already be in the room from handleJoinRoom
      // But let's ensure event listeners are set up
      console.log(`📡 Setting up transcription listeners for room: ${roomID}`);

      const handleTranscriptionReady = (data: any) => {
        console.log("✅ Transcription ready received:", data);
        setTranscriptionReady(true);
        setRoomName(data.roomName || roomID);
        // alert(
        //   "Meeting summary is ready! Would you like to receive it via email?"
        // );
      };

      const handleTranscriptionError = (data: any) => {
        console.error("❌ Transcription error:", data);
        alert("Failed to generate meeting summary");
      };

      socket.on("transcription-ready", handleTranscriptionReady);
      socket.on("transcription-error", handleTranscriptionError);

      return () => {
        socket.off("transcription-ready", handleTranscriptionReady);
        socket.off("transcription-error", handleTranscriptionError);
      };
    }
  }, [roomID]);

  // ✅ Email summary API call
  // Add this at the top of the component
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleSendSummary = async (emails: string[]) => {
    console.log("📧 Attempting to send summary to:", emails);
    console.log("📧 Room name:", roomName);
    console.log("📧 API URL:", API_URL); // ✅ Log the URL being used

    try {
      const response = await fetch(`${API_URL}/api/send-summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomName,
          emails,
        }),
      });

      const data = await response.json();
      console.log("📧 Server response:", data);

      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      alert("✅ Summary sent successfully! Check your email.");
      return data;
    } catch (error: any) {
      console.error("❌ Failed to send summary:", error);
      alert(`Failed to send summary: ${error.message}`);
      throw error;
    }
  };
  //@ts-ignore
  // const handleSendSummary = async (emails) => {
  //   try {
  //     const response = await fetch("http://localhost:3000/api/send-summary", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         roomName,
  //         emails,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to send summary");
  //     }

  //     const data = await response.json();
  //     console.log("Summary sent:", data);
  //     showNotification("Summary sent successfully!");
  //   } catch (error) {
  //     console.error("Error sending summary:", error);
  //     showNotification("Failed to send summary", "error");
  //   }
  // };

  // ✅ Modified leaveRoom handler to show email modal if summary is ready
  // const handleLeaveMeeting = () => {
  //   if (transcriptionReady) {
  //     setShowEmailModal(true);
  //   } else {
  //     leaveRoom();
  //   }
  // };

  // ✅ Simple notification popup
  //@ts-ignore
  const showNotification = (message, type = "success") => {
    alert(message);
  };

  if (!roomID || !initialName) return null;

  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="absolute inset-0 z-0">
        <GameCanvas
          users={users}
          roomID={roomID}
          name={name}
          setUsers={setUsers}
        />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start p-4">
          <div className="w-full md:w-3/4">
            <VideoContainer
              name={name}
              mic={mic}
              cam={cam}
              nearby={nearby}
              userVideoRef={userVideoRef}
              peerStreams={peerStreams}
              setMic={setMic}
              setCam={setCam}
            />
          </div>

          <div className="flex gap-2">
            {nearby.length > 0 && (
              <button
                onClick={() => setIsWhiteboardVisible(!isWhiteboardVisible)}
                className="px-2 py-1 bg-black bg-opacity-80 hover:bg-gray-700 text-white text-sm rounded-md border border-gray-600 transition-colors"
              >
                <Wb2 />
              </button>
            )}

            {/* ✅ Replace old Leave button */}
            {/* <button
              onClick={handleLeaveMeeting}
              className="px-2 py-1 bg-black bg-opacity-80 hover:bg-red-700 text-white text-sm rounded-md border border-gray-600 transition-colors"
            >
              <Exit />
            </button> */}
            <button
              onClick={leaveRoom}
              className="px-2 py-1 bg-black bg-opacity-80 hover:bg-red-700 text-white text-sm rounded-md border border-gray-600 transition-colors"
            >
              {/* Leave? */}
              <Exit />
            </button>
          </div>
        </div>

        {/* ✅ Whiteboard toggle */}
        <div
          className="fixed top-10 right-96 mt-8 w-60 max-h-48 z-20"
          style={{
            display:
              isWhiteboardVisible && nearby.length > 0 ? "block" : "none",
          }}
        >
          <Whiteboard roomID={roomID} />
        </div>

        {/* ✅ Chat toggle */}
        {roomID && (
          <div className="fixed bottom-0 left-0 m-4 z-20">
            <button
              onClick={() => setOpen(!open)}
              className="mb-2 px-3 py-1 bg-gray-200 text-black font-sans font-semibold text-sm rounded-lg shadow-md hover:bg-transparent hover:border hover:border-white hover:text-white transition"
            >
              {open ? "Hide Chat" : "Send a message "}
            </button>

            <div
              className={`bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 ${
                open ? "block" : "hidden"
              }`}
            >
              <Chat socket={socket} room={roomID} name={name} />
            </div>
          </div>
        )}

        {/* ✅ Meeting Summary Button (if ready) */}
        {transcriptionReady && (
          <button
            onClick={() => setShowEmailModal(true)}
            className="fixed bottom-60 right-6 px-4 py-2 bg-gray-200 text-black text-sm font-semibold font-sans rounded-full hover:bg-gray-400 z-20"
          >
            Want a summary of your cool video chat? Click here!🎈
          </button>
        )}

        {/* ✅ Email Summary Modal */}
        <EmailSummaryModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          roomName={roomName}
          onSubmit={handleSendSummary}
        />

        {/* ✅ Error handling */}
        {error && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-red-500 text-center bg-gray-800 bg-opacity-80 px-4 py-2 rounded-md border border-gray-600 z-20">
            <p>{error}</p>
            <button
              onClick={() => handleJoinRoom(name, mic, cam)}
              className="mt-2 px-2 py-1 bg-red-700 text-white rounded-md"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Room;
