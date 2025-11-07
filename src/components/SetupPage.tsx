import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Squares from "./ui/Squares";
import img1 from "../assets/Images/bgcut1.png";
import img2 from "../assets/Images/bgcut2.png";
import img3 from "../assets/Images/bgcut3.png";
import img4 from "../assets/Images/bgcut4.png";
import img5 from "../assets/Images/bgcut5.png";
import img6 from "../assets/Images/bgcut6.png";
import { socket } from "./WebRTCManager";

const SetupPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [loves, setLoves] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((err) => {
            console.error("Video playback error:", err);
            setError("Failed to start video preview. Check permissions.");
          });
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
        setError(
          "Unable to access camera or microphone. Please grant permissions."
        );
      }
    };
    getUserMedia();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (name === "" || room === "") {
      setError("Please enter valid name and meeting ID");
      return;
    }
    if (!streamRef.current) {
      setError(
        "Camera and microphone are required. Please enable permissions."
      );
      return;
    }
    navigate(`/room/${room}`, { state: { name, loves } });
  };

  const createRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name === "") {
      setError("Please enter a name");
      return;
    }
    if (!streamRef.current) {
      setError(
        "Camera and microphone are required. Please enable permissions."
      );
      return;
    }
    socket.emit("create room", { roomID: room });
    console.log("Creating room with ID:", room);
    socket.once("room ready", () => {
      console.log("Room created successfully:", room);
      navigate(`/room/${room}`, { state: { name, loves } });
    });

    socket.once("error", (msg) => {
      setError(msg);
    });
  };

  useEffect(() => {
    return () => {
      socket.off("room ready");
      socket.off("error");
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4">
      <div className="absolute inset-0 z-0 bg-black">
        <Squares
          direction="diagonal"
          speed={0.5}
          borderColor="rgba(58,58,58)"
          squareSize={60}
          hoverFillColor="rgba(34, 67, 145, 0.4)"
        />
      </div>

      <div className="relative z-10 bg-transparent border border-white p-4 rounded-lg shadow-lg w-full max-w-xl flex flex-col md:flex-row mb-6">
        <div className="w-full md:w-2/5 pr-0 md:pr-4 flex flex-col items-center">
          <video
            className="w-full max-w-[16rem] h-48 bg-black rounded-2xl mb-2"
            muted
            ref={videoRef}
            autoPlay
            playsInline
          />
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
        </div>

        <div className="w-full md:w-3/5 pl-0 md:pl-4 flex flex-col justify-center space-y-3 mt-4 md:mt-0">
          <input
            id="input-name"
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 text-sm border bg-transparent text-white border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            id="input-room"
            type="text"
            placeholder="Enter meeting ID"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-full p-2 text-sm border bg-transparent text-white border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            id="input-loves"
            type="text"
            placeholder="Enter meeting description"
            value={loves}
            onChange={(e) => setLoves(e.target.value)}
            className="w-full p-2 text-sm border bg-transparent text-white border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="flex flex-col md:flex-row justify-between gap-2">
            <button
              onClick={joinRoom}
              className="w-full md:w-1/2 px-3 py-2 text-sm text-white bg-transparent rounded-md border border-white hover:bg-white hover:text-black transition-colors"
            >
              Join Meeting
            </button>
            <button
              onClick={createRoom}
              className="w-full md:w-1/2 px-3 py-2 text-sm text-white bg-transparent rounded-md border border-white hover:bg-white hover:text-black transition-colors"
            >
              Create Meeting
            </button>
          </div>
        </div>
      </div>

      <h2 className="text-white text-xl md:text-2xl font-bold mb-6 relative z-10 tracking-wider uppercase border-b-2 border-blue-500 pb-2 text-center">
        Spawn randomly across these arenas
      </h2>

      <div className="relative z-10 flex flex-wrap justify-center gap-2 mt-4">
        <div className="relative group">
          <img
            src={img1}
            alt="Slim Image 1"
            className="w-12 h-32 md:w-16 md:h-48 object-cover rounded-lg shadow-lg transform transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-green-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200 blur-2xl"></div>
        </div>
        <div className="relative group">
          <img
            src={img2}
            alt="Slim Image 2"
            className="w-12 h-32 md:w-16 md:h-48 object-cover rounded-lg shadow-lg transform transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-yellow-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200 blur-2xl"></div>
        </div>
        <div className="relative group">
          <img
            src={img3}
            alt="Slim Image 3"
            className="w-12 h-32 md:w-16 md:h-48 object-cover rounded-lg shadow-lg transform transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-red-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200 blur-2xl"></div>
        </div>
        <div className="relative group">
          <img
            src={img4}
            alt="Slim Image 4"
            className="w-12 h-32 md:w-16 md:h-48 object-cover rounded-lg shadow-lg transform transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-indigo-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200 blur-2xl"></div>
        </div>
        <div className="relative group">
          <img
            src={img5}
            alt="Slim Image 5"
            className="w-12 h-32 md:w-16 md:h-48 object-cover rounded-lg shadow-lg transform transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-indigo-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200 blur-2xl"></div>
        </div>
        <div className="relative group">
          <img
            src={img6}
            alt="Slim Image 6"
            className="w-12 h-32 md:w-16 md:h-48 object-cover rounded-lg shadow-lg transform transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-indigo-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200 blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { socket } from "./WebRTCManager";

// const SetupPage: React.FC = () => {
//   const [name, setName] = useState<string>("");
//   const [room, setRoom] = useState<string>("");
//   const [loves, setLoves] = useState<string>("");
//   const [error, setError] = useState<string | null>(null);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const streamRef = useRef<MediaStream | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const getUserMedia = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true,
//         });
//         streamRef.current = stream;
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           videoRef.current.play().catch((err) => {
//             console.error("Video playback error:", err);
//             setError("Failed to start video preview. Check permissions.");
//           });
//         }
//       } catch (err) {
//         console.error("Error accessing media devices:", err);
//         setError(
//           "Unable to access camera or microphone. Please grant permissions."
//         );
//       }
//     };
//     getUserMedia();

//     return () => {
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   const joinRoom = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (name === "" || room === "") {
//       setError("Please enter valid name and meeting ID");
//       return;
//     }
//     if (!streamRef.current) {
//       setError(
//         "Camera and microphone are required. Please enable permissions."
//       );
//       return;
//     }
//     navigate(`/room/${room}`, { state: { name, loves } });
//   };

//   const createRoom = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (name === "") {
//       setError("Please enter a name");
//       return;
//     }
//     if (!streamRef.current) {
//       setError(
//         "Camera and microphone are required. Please enable permissions."
//       );
//       return;
//     }
//     socket.emit("create room", { roomID: room });
//     console.log("Creating room with ID:", room);
//     socket.once("room ready", () => {
//       console.log("Room created successfully:", room);
//       navigate(`/room/${room}`, { state: { name, loves } });
//     });

//     socket.once("error", (msg) => {
//       setError(msg);
//     });
//   };

//   useEffect(() => {
//     return () => {
//       socket.off("room ready");
//       socket.off("error");
//     };
//   }, []);

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-black px-4">
//       <div className="w-full max-w-md rounded-lg border border-white bg-transparent p-4 shadow-lg">
//         <div className="flex flex-col items-center">
//           <video
//             className="mb-2 h-32 max-w-[12rem] w-full rounded-2xl bg-black object-cover"
//             muted
//             ref={videoRef}
//             autoPlay
//             playsInline
//           />
//           {error && (
//             <p className="mb-2 text-center text-xs text-red-500">{error}</p>
//           )}
//           <div className="flex w-full flex-col space-y-3">
//             <input
//               id="input-name"
//               type="text"
//               placeholder="Enter Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full rounded-md border border-gray-300 bg-transparent p-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//             <input
//               id="input-room"
//               type="text"
//               placeholder="Enter meeting ID"
//               value={room}
//               onChange={(e) => setRoom(e.target.value)}
//               className="w-full rounded-md border border-gray-300 bg-transparent p-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//             <input
//               id="input-loves"
//               type="text"
//               placeholder="Enter meeting description"
//               value={loves}
//               onChange={(e) => setLoves(e.target.value)}
//               className="w-full rounded-md border border-gray-300 bg-transparent p-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//             <div className="flex flex-col gap-2 sm:flex-row">
//               <button
//                 onClick={joinRoom}
//                 className="w-full rounded-md border border-white px-3 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
//               >
//                 Join Meeting
//               </button>
//               <button
//                 onClick={createRoom}
//                 className="w-full rounded-md border border-white px-3 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
//               >
//                 Create Meeting
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SetupPage;
