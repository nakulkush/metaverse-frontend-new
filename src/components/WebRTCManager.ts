import { useEffect, useRef, useState, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import { Room, RoomEvent } from "livekit-client";
import { UserPosition, NearbyPeer } from "../types";
import { debounce } from "lodash";

export const socket: Socket = io(
  import.meta.env.VITE_SOCKET_URL ||
    "gleaming-tranquility-production.up.railway.app",
  {
    reconnectionAttempts: 10,
    reconnectionDelay: 3000,
    timeout: 10000,
    transports: ["websocket"],
    upgrade: false,
  }
);

const LIVEKIT_URL =
  import.meta.env.VITE_LIVEKIT_URL ||
  "wss://cooooolabio-dmw34ny9.livekit.cloud";

// let egressActive = false; // 🟢 prevents duplicate egress calls

export const useWebRTC = ({
  roomID,
  name,
  mic,
  cam,
  initialLoves,
  setName,
  setMic,
  setCam,
  setJoinedRoom,
  navigate,
}: {
  roomID: string | undefined;
  name: string;
  mic: boolean;
  cam: boolean;
  initialLoves?: string;
  setName: (val: string) => void;
  setMic: (val: boolean) => void;
  setCam: (val: boolean) => void;
  setJoinedRoom: (val: boolean) => void;
  navigate: (path: string) => void;
}) => {
  const [users, setUsers] = useState<UserPosition[]>([]);
  const [nearby, setNearby] = useState<NearbyPeer[]>([]);
  const [peerStreams, setPeerStreams] = useState<Map<string, MediaStream>>(
    new Map()
  );
  const [error, setError] = useState<string | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [whiteboardState, setWhiteboardState] = useState<any>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const peerNames = useRef<Map<string, string>>(new Map());
  const initializedRef = useRef(false);

  const handleJoinRoom = (
    userName: string,
    micEnabled: boolean,
    camEnabled: boolean
  ) => {
    setName(userName);
    setMic(micEnabled);
    setCam(camEnabled);
    setJoinedRoom(true);
  };

  const retryMediaAccess = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: cam,
        audio: mic,
      });
      streamRef.current = stream;
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
        userVideoRef.current.muted = true;
        userVideoRef.current
          .play()
          .catch((err) => console.error("❌ Local video play error:", err));
      }
      if (room) {
        const videoTrack = stream.getVideoTracks()[0];
        const audioTrack = stream.getAudioTracks()[0];
        if (cam && videoTrack) {
          await room.localParticipant.publishTrack(videoTrack);
          console.log("📹 Video track published");
        }
        if (mic && audioTrack) {
          await room.localParticipant.publishTrack(audioTrack);
          console.log("🎤 Audio track published");
        }
      }
    } catch (err) {
      console.error("❌ Retry media failed:", err);
      //@ts-ignore
      setError(`Media access failed: ${err.message}`);
    }
  };

  useEffect(() => {
    if (!roomID || !name || initializedRef.current) return;

    const init = async () => {
      try {
        //changes on 17/10 for livekit
        // const stream = await navigator.mediaDevices.getUserMedia({
        //   video: cam,
        //   audio: mic,
        // });
        // streamRef.current = stream;
        // if (userVideoRef.current) {
        //   userVideoRef.current.srcObject = stream;
        //   userVideoRef.current.muted = true;
        //   userVideoRef.current
        //     .play()
        //     .catch((err) => console.error("❌ Local video error:", err));
        // }

        // socket.emit("join room", { roomID, name, loves: initialLoves || "" });

        // // Robust token handling with cleanup
        // const token = await new Promise<string>((resolve, reject) => {
        //   const tokenHandler = (token: any) => {
        //     if (typeof token === "string") {
        //       resolve(token);
        //       socket.off("access token", tokenHandler); // Clean up immediately
        //     } else {
        //       reject(new Error("Invalid access token"));
        //     }
        //   };
        //   socket.on("access token", tokenHandler);
        //   socket.on("error", (msg) => reject(new Error(msg)));
        // });

        // const newRoom = new Room({
        //   //@ts-ignore
        //   autoSubscribe: false,
        //   adaptiveStream: true,
        //   dynacast: true,
        // });
        // await newRoom.connect(LIVEKIT_URL, token);
        // setRoom(newRoom);

        // const videoTrack = stream.getVideoTracks()[0];
        // const audioTrack = stream.getAudioTracks()[0];
        // if (cam && videoTrack)
        //   await newRoom.localParticipant.publishTrack(videoTrack);
        // if (mic && audioTrack)
        //   await newRoom.localParticipant.publishTrack(audioTrack);

        //grok code

        console.log("🚀 Initializing WebRTC with cam:", cam, "mic:", mic);
        const stream = await navigator.mediaDevices
          .getUserMedia({
            video: cam,
            audio: mic,
          })
          .catch((err) => {
            console.error("❌ getUserMedia error:", err.name, err.message);
            throw err; // Rethrow to handle in outer catch
          });
        console.log("✅ Media stream acquired:", stream);

        streamRef.current = stream;
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
          userVideoRef.current.muted = true;
          userVideoRef.current
            .play()
            .catch((err) => console.error("❌ Local video play error:", err));
        }

        socket.emit("join room", { roomID, name, loves: initialLoves || "" });

        const token = await new Promise<string>((resolve, reject) => {
          const tokenHandler = (token: any) => {
            if (typeof token === "string") {
              resolve(token);
              socket.off("access token", tokenHandler);
            } else {
              reject(new Error("Invalid access token"));
            }
          };
          socket.on("access token", tokenHandler);
          socket.on("error", (msg) => reject(new Error(msg)));
        });
        console.log("✅ Access token received");

        const newRoom = new Room({
          //@ts-ignore
          autoSubscribe: false,
          adaptiveStream: true,
          dynacast: true,
        });
        await newRoom.connect(LIVEKIT_URL, token).catch((err) => {
          console.error("❌ Room connection error:", err);
          throw err;
        });
        console.log("✅ Room connected:", newRoom.name);
        setRoom(newRoom);

        const videoTrack = stream.getVideoTracks()[0];
        const audioTrack = stream.getAudioTracks()[0];
        console.log(
          "📊 Tracks available - video:",
          !!videoTrack,
          "audio:",
          !!audioTrack
        );

        if (cam && videoTrack) {
          await newRoom.localParticipant.publishTrack(videoTrack);
          console.log("📹 Video track published for", socket.id);
        } else {
          console.warn(
            "⚠️ Video track not published: cam=",
            cam,
            "videoTrack=",
            !!videoTrack
          );
        }
        if (mic && audioTrack) {
          await newRoom.localParticipant.publishTrack(audioTrack);
          console.log("🎤 Audio track published for", socket.id);
        } else {
          console.warn(
            "⚠️ Audio track not published: mic=",
            mic,
            "audioTrack=",
            !!audioTrack
          );
        }

        newRoom.on(RoomEvent.TrackSubscribed, (track, _, participant) => {
          setPeerStreams((prev) => {
            const newMap = new Map(prev);
            const stream =
              newMap.get(participant.identity) || new MediaStream();
            if (
              !stream
                .getTracks()
                .find((t) => t.id === track.mediaStreamTrack.id)
            ) {
              stream.addTrack(track.mediaStreamTrack);
              newMap.set(participant.identity, stream);
            }

            return newMap;
          });
        });

        newRoom.on(RoomEvent.TrackUnsubscribed, (track, _, participant) => {
          setPeerStreams((prev) => {
            const newMap = new Map(prev);
            const stream = newMap.get(participant.identity);
            if (stream) {
              stream.removeTrack(track.mediaStreamTrack);
              if (!stream.getTracks().length)
                newMap.delete(participant.identity);
              else newMap.set(participant.identity, stream);
            }
            return newMap;
          });
        });

        newRoom.on(RoomEvent.ParticipantDisconnected, (participant) => {
          setPeerStreams((prev) => {
            const newMap = new Map(prev);
            newMap.delete(participant.identity);
            return newMap;
          });
        });

        socket.on("new-peer", ({ peerId, name }) => {
          peerNames.current.set(peerId, name);
        });

        socket.on("user left", ({ id }) => {
          peerNames.current.delete(id);
          setPeerStreams((prev) => {
            const newMap = new Map(prev);
            newMap.delete(id);
            return newMap;
          });
          setNearby((prev) => prev.filter((user) => user.peerID !== id));
        });

        socket.on("receive move", (data) => {
          if (data.all) {
            setUsers(
              data.all.map((u: any) => ({
                id: u.id,
                x: u.x,
                y: u.y,
                direction: u.d,
                name: u.n,
                loves:
                  u.l ||
                  users.find((existingUser) => existingUser.id === u.id)
                    ?.loves ||
                  "",
                quit: false,
                jumping: u.jumping || false,
                room: roomID,
              }))
            );
          } else if (data.id !== socket.id) {
            setUsers((prev) => {
              const userIdx = prev.findIndex((user) => user.id === data.id);
              if (userIdx === -1) return prev;
              const user = prev[userIdx];
              const lastSeq = user.seq || 0;
              if (data.seq <= lastSeq) {
                console.log(
                  `Discarded outdated move for ${data.id}: seq=${data.seq}, lastSeq=${lastSeq}`
                );
                return prev;
              }
              const updatedUsers = prev.map((u) =>
                u.id === data.id
                  ? {
                      ...u,
                      x: data.x !== undefined ? data.x : u.x,
                      y: data.y !== undefined ? data.y : u.y,
                      direction:
                        data.direction !== undefined
                          ? data.direction
                          : u.direction,
                      quit: data.quit || u.quit,
                      jumping:
                        data.jumping !== undefined ? data.jumping : u.jumping,
                      seq: data.seq,
                    }
                  : u
              );
              return updatedUsers;
            });
          }
        });

        socket.on("whiteboard-init", ({ state }) => setWhiteboardState(state));
        socket.on("whiteboard-update", ({ state }) =>
          setWhiteboardState(state)
        );
        socket.emit("request-whiteboard-state", { room: roomID });
        socket.on("error", (message) => setError(message));
        initializedRef.current = true;
      } catch (err) {
        console.error("❌ Init error:", err);
        setError("Failed to join room. Please try again.");
      }
    };
    init();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      room?.disconnect();
      socket.off();
      setPeerStreams(new Map());
    };
  }, [roomID, name, initialLoves]);

  useEffect(() => {
    const pingInterval = setInterval(() => {
      socket.emit("ping");
    }, 25000);
    return () => clearInterval(pingInterval);
  }, []);

  useEffect(() => {
    if (!room || !streamRef.current) return;

    const updateTracks = async () => {
      //@ts-ignore
      const videoTrack = streamRef.current.getVideoTracks()[0];
      //@ts-ignore
      const audioTrack = streamRef.current.getAudioTracks()[0];

      if (audioTrack) {
        audioTrack.enabled = mic;
        //@ts-ignore
        if (mic && !room.localParticipant.audioTracks.size) {
          await room.localParticipant.publishTrack(audioTrack);
          //@ts-ignore
        } else if (!mic && room.localParticipant.audioTracks.size) {
          await room.localParticipant.unpublishTrack(audioTrack);
        }
      }

      if (videoTrack) {
        videoTrack.enabled = cam;
        //@ts-ignore
        if (cam && !room.localParticipant.videoTracks.size) {
          await room.localParticipant.publishTrack(videoTrack);
          //@ts-ignore
        } else if (!cam && room.localParticipant.videoTracks.size) {
          await room.localParticipant.unpublishTrack(videoTrack);
        }
      }
    };

    updateTracks().catch((err) => console.error("❌ Track update error:", err));
  }, [mic, cam, room]);

  const proximity = useCallback((user: UserPosition, me: UserPosition) => {
    return user && me && Math.hypot(user.x - me.x, user.y - me.y) < 100;
  }, []);

  //below code commented on 17/10 for transcription setup
  // const updateNearby = useCallback(() => {
  //   const me = users.find((user) => user.id === socket.id);
  //   if (!me) return;

  //   //old before testing
  //   setNearby(
  //     users
  //       .filter(
  //         (user) => user.id !== socket.id && !user.quit && proximity(user, me)
  //       )
  //       .map((user) => ({
  //         peerID: user.id,
  //         name: peerNames.current.get(user.id) || user.name || "Guest",
  //         stream: peerStreams.get(user.id) || null,
  //       }))
  //   );
  // }, [users, peerStreams, proximity]);

  // const updateNearby = useCallback(() => {
  //   const me = users.find((user) => user.id === socket.id);
  //   if (!me) return;

  //   const nearbyUsers = users.filter(
  //     (user) => user.id !== socket.id && !user.quit && proximity(user, me)
  //   );

  //   // Detect if we entered proximity (start recording)
  //   if (nearbyUsers.length > 0 && !localStorage.getItem("egressId")) {
  //     fetch("http://localhost:3000/api/start-egress", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ roomName: roomID }),
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log("🎥 Egress started:", data);
  //         localStorage.setItem("egressId", data.egressId);
  //       })
  //       .catch((err) => console.error("❌ Egress start error:", err));
  //   }

  //   // Detect if we moved apart (stop recording)
  //   if (nearbyUsers.length === 0 && localStorage.getItem("egressId")) {
  //     const egressId = localStorage.getItem("egressId");
  //     fetch("http://localhost:3000/api/stop-egress", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ egressId }),
  //     })
  //       .then(() => {
  //         console.log("🛑 Egress stopped");
  //         localStorage.removeItem("egressId");
  //       })
  //       .catch((err) => console.error("❌ Egress stop error:", err));
  //   }

  //   setNearby(
  //     nearbyUsers.map((user) => ({
  //       peerID: user.id,
  //       name: peerNames.current.get(user.id) || user.name || "Guest",
  //       stream: peerStreams.get(user.id) || null,
  //     }))
  //   );
  // }, [users, peerStreams, proximity, roomID]);

  // //partiall working
  // const updateNearby = useCallback(() => {
  //   const me = users.find((user) => user.id === socket.id);
  //   if (!me) return;

  //   const nearbyUsers = users.filter(
  //     (user) => user.id !== socket.id && !user.quit && proximity(user, me)
  //   );

  //   // --- START EGRESS ---
  //   if (nearbyUsers.length > 0 && !egressActive) {
  //     egressActive = true; // prevent multiple calls
  //     console.log("🎥 Attempting to start egress...");

  //     fetch("http://localhost:3000/api/start-egress", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ roomName: roomID }),
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log("🎥 Egress started:", data);
  //         if (data.egressId) {
  //           localStorage.setItem("egressId", data.egressId);
  //         }
  //       })
  //       .catch((err) => {
  //         console.error("❌ Egress start error:", err);
  //         egressActive = false; // allow retry if failed
  //       });
  //   }

  //   // --- STOP EGRESS ---
  //   if (nearbyUsers.length === 0 && egressActive) {
  //     const egressId = localStorage.getItem("egressId");
  //     console.log("🛑 Attempting to stop egress...");

  //     fetch("http://localhost:3000/api/stop-egress", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         egressId,
  //         roomName: roomID, // include this so backend doesn’t return 400
  //       }),
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log("🛑 Egress stopped:", data);
  //         localStorage.removeItem("egressId");
  //         egressActive = false;
  //       })
  //       .catch((err) => {
  //         console.error("❌ Egress stop error:", err);
  //       });
  //   }

  //   // Update UI for nearby peers
  //   setNearby(
  //     nearbyUsers.map((user) => ({
  //       peerID: user.id,
  //       name: peerNames.current.get(user.id) || user.name || "Guest",
  //       stream: peerStreams.get(user.id) || null,
  //     }))
  //   );
  // }, [users, peerStreams, proximity, roomID]);

  //grok code
  // const updateNearby = useCallback(
  //   debounce(() => {
  //     const me = users.find((user) => user.id === socket.id);
  //     if (!me) return;

  //     const nearbyUsers = users.filter(
  //       (user) => user.id !== socket.id && !user.quit && proximity(user, me)
  //     );

  //     // --- START EGRESS ---
  //     if (nearbyUsers.length > 0 && !egressActive) {
  //       egressActive = true;
  //       console.log("🎥 Attempting to start egress...");

  //       fetch("http://localhost:3000/api/start-egress", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ roomName: roomID }),
  //       })
  //         .then((res) => res.json())
  //         .then((data) => {
  //           console.log("🎥 Egress started:", data);
  //           if (data.egressId) {
  //             localStorage.setItem("egressId", data.egressId);
  //           } else if (data.message === "Egress already running") {
  //             console.log("🎥 Egress already running, no action needed");
  //             localStorage.setItem("egressId", data.egressId);
  //           }
  //         })
  //         .catch((err) => {
  //           console.error("❌ Egress start error:", err);
  //           egressActive = false; // Allow retry on failure
  //         });
  //     }

  //     // --- STOP EGRESS ---
  //     // Inside updateNearby, modify the stop egress section
  //     if (nearbyUsers.length === 0 && egressActive) {
  //       const egressId = localStorage.getItem("egressId");
  //       console.log("🛑 Attempting to stop egress...");

  //       fetch("http://localhost:3000/api/stop-egress", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           egressId,
  //           roomName: roomID,
  //         }),
  //       })
  //         .then((res) => res.json())
  //         .then((data) => {
  //           console.log("🛑 Egress stopped:", data);
  //           localStorage.removeItem("egressId");
  //           egressActive = false;
  //         })
  //         .catch((err) => {
  //           console.error("❌ Egress stop error:", err);
  //           if (err.message.includes("already failed")) {
  //             localStorage.removeItem("egressId");
  //             egressActive = false;
  //           }
  //         });
  //     }

  //     setNearby(
  //       nearbyUsers.map((user) => ({
  //         peerID: user.id,
  //         name: peerNames.current.get(user.id) || user.name || "Guest",
  //         stream: peerStreams.get(user.id) || null,
  //       }))
  //     );
  //   }, 1000), // Debounce for 1 second
  //   [users, peerStreams, proximity, roomID]
  // );

  //grok code with event listeing 2

  const updateNearby = useCallback(
    debounce(() => {
      const me = users.find((user) => user.id === socket.id);
      if (!me) return;

      const nearbyUsers = users.filter(
        (user) => user.id !== socket.id && !user.quit && proximity(user, me)
      );

      setNearby(
        nearbyUsers.map((user) => ({
          peerID: user.id,
          name: peerNames.current.get(user.id) || user.name || "Guest",
          stream: peerStreams.get(user.id) || null,
        }))
      );
    }, 1000), // Debounce for 1 second
    [users, peerStreams, proximity]
  );

  useEffect(() => {
    socket.on("egress-status", ({ status, egressId, error }) => {
      console.log(`📡 Egress status: ${status}, ID: ${egressId}`);
      if (status === "started") {
        // egressActive = true;
        localStorage.setItem("egressId", egressId);
      } else if (status === "stopped" || status === "failed") {
        // egressActive = false;

        localStorage.removeItem("egressId");
        if (status === "failed") {
          console.error(`❌ Egress failed: ${error}`);
        }
      }
    });

    return () => {
      socket.off("egress-status");
    };
  }, []);

  useEffect(() => {
    if (users.length) updateNearby();
  }, [users, peerStreams, updateNearby]);

  useEffect(() => {
    if (!room) return;
    const nearbyIds = nearby.map((n) => n.peerID);
    room.remoteParticipants.forEach((participant) => {
      const isNearby = nearbyIds.includes(participant.identity);
      participant.trackPublications.forEach((pub) =>
        pub.setSubscribed(isNearby)
      );
    });
  }, [nearby, room]);

  const leaveRoom = () => {
    const me = users.find((user) => user.id === socket.id);
    if (me) {
      socket.emit("send move", { ...me, quit: true, room: roomID! });
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    room?.disconnect();
    socket.disconnect();

    // egressActive = false;
    localStorage.removeItem("egressId");
    navigate("/");
  };

  return {
    users,
    setUsers,
    nearby,
    peerStreams,
    error,
    userVideoRef,
    handleJoinRoom,
    leaveRoom,
    retryMediaAccess,
    whiteboardState,
  };
};
