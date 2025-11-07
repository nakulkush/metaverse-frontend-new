// import React, {
//   useCallback,
//   useState,
//   Dispatch,
//   SetStateAction,
//   useRef,
//   useEffect,
// } from "react";
// import Sketch from "react-p5";
// import type p5 from "p5";
// import { UserPosition } from "../types";
// import { socket } from "./WebRTCManager";
// import imag from "../assets/Sprites/char-idle.png";
// import imgu from "../assets/Sprites/char-run-f.gif";
// import imgr from "../assets/Sprites/char-run-r-1.gif";
// import imgl from "../assets/Sprites/char-run-l.gif";
// import imgd from "../assets/Sprites/char-run-2.gif";
// import imagg from "../assets/Sprites/char-idle-green-1.png";
// import imago from "../assets/Sprites/char-idle-orange-1.png";
// import bg1 from "../assets/Sprites/bg-9.png";
// import bg2 from "../assets/Sprites/m-12.jpg";
// // import bg3 from "../assets/Sprites/n-1.jpg";
// import bg4 from "../assets/Sprites/n-3.jpg";
// // import bg5 from "../assets/Sprites/n-4.jpg";

// import bg6 from "../assets/Sprites/n-5.png";

// // import bg8 from "../assets/Sprites/n-8.jpg";

// // import bg9 from "../assets/Sprites/file_2025-04-05_17.37.42.png";

// // import bg10 from "../assets/Sprites/n-16.png";

// import imaggb from "../assets/Sprites/char-run-b-g.gif";
// import imggf from "../assets/Sprites/char-run-f-g.gif";
// import imaggl from "../assets/Sprites/char-run-l-g.gif";
// import imggr from "../assets/Sprites/char-run-r-g.gif";
// import imagob from "../assets/Sprites/char-run-b-o.gif";
// import imgof from "../assets/Sprites/char-run-f-o.gif";
// import imagol from "../assets/Sprites/char-run-l-o.gif";
// import imagor from "../assets/Sprites/char-run-r-o.gif";
// import { useLocation } from "react-router-dom";

// interface GameCanvasProps {
//   users: UserPosition[];
//   roomID: string;
//   name: string;
//   setUsers: Dispatch<SetStateAction<UserPosition[]>>;
// }

// const GameCanvas: React.FC<GameCanvasProps> = ({
//   users,
//   roomID,
//   name,
//   setUsers,
// }) => {
//   const [selectedUser, setSelectedUser] = useState<UserPosition | null>(null);
//   const [interpolatedPositions, setInterpolatedPositions] = useState<
//     Map<string, { x: number; y: number }>
//   >(new Map());
//   const canvasRef = useRef<HTMLDivElement>(null);
//   const movementBuffer = useRef<{
//     x: number;
//     y: number;
//     direction: string | null;
//     seq: number;
//   } | null>(null);
//   const lastMoveTimeRef = useRef<number>(0);
//   const lastSequenceRef = useRef<number>(0); // Track sequence numbers
//   const animationRef = useRef<number>();
//   const location = useLocation();
//   const { loves } = location.state || { loves: "" };

//   const throttleMs = 50; // Reduced back to 250ms for responsiveness
//   const CANVAS_WIDTH = window.innerWidth;
//   const CANVAS_HEIGHT = window.innerHeight;
//   const SPRITE_SIZE = 132;
//   const SPEED = 2;
//   const backgrounds = [bg6, bg1, bg2, bg4];

//   const map = Math.floor(Math.random() * 4);

//   const [p5Images, setP5Images] = useState<{
//     img: p5.Image;
//     imgu: p5.Image;
//     imgr: p5.Image;
//     imgl: p5.Image;
//     imgd: p5.Image;
//     bg: p5.Image;
//     imgg: p5.Image;
//     imgo: p5.Image;
//     imggb: p5.Image;
//     imggf: p5.Image;
//     imggl: p5.Image;
//     imggr: p5.Image;
//     imgob: p5.Image;
//     imgof: p5.Image;
//     imagol: p5.Image;
//     imagor: p5.Image;
//   } | null>(null);
//   const colorMapRef = useRef<Map<string, string>>(new Map());

//   const handleUserClick = useCallback((user: UserPosition) => {
//     if (user.id !== socket.id) setSelectedUser(user);
//   }, []);

//   const preload = (p5: p5) => {
//     const images = {
//       img: p5.loadImage(imag),
//       imgu: p5.loadImage(imgu),
//       imgr: p5.loadImage(imgr),
//       imgl: p5.loadImage(imgl),
//       imgd: p5.loadImage(imgd),
//       bg: p5.loadImage(backgrounds[map]),
//       imgg: p5.loadImage(imagg),
//       imgo: p5.loadImage(imago),
//       imggb: p5.loadImage(imaggb),
//       imggf: p5.loadImage(imggf),
//       imggl: p5.loadImage(imaggl),
//       imggr: p5.loadImage(imggr),
//       imgob: p5.loadImage(imagob),
//       imgof: p5.loadImage(imgof),
//       imagol: p5.loadImage(imagol),
//       imagor: p5.loadImage(imagor),
//     };
//     setP5Images(images);
//   };

//   const getRandomPosition = () => {
//     const x =
//       Math.floor(Math.random() * (CANVAS_WIDTH - SPRITE_SIZE)) +
//       SPRITE_SIZE / 2;
//     const y =
//       Math.floor(Math.random() * (CANVAS_HEIGHT - SPRITE_SIZE)) +
//       SPRITE_SIZE / 2;
//     return { x, y };
//   };

//   const setup = (p5: p5, canvasParentRef: Element) => {
//     //@ts-ignore
//     const frameRate =
//       //@ts-ignore
//       window.navigator.connection &&
//       //@ts-ignore
//       (window.navigator.connection as any).effectiveType === "2g"
//         ? 15
//         : 60;
//     p5.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).parent(canvasParentRef);
//     p5.frameRate(frameRate);

//     const localUserExists = users.some((user) => user.id === socket.id);
//     if (!localUserExists) {
//       const { x, y } = getRandomPosition();
//       const initialUser = {
//         id: socket.id,
//         room: roomID,
//         x,
//         y,
//         direction: null,
//         quit: false,
//         name,
//         loves: loves || "Nothing entered yet",
//       };
//       //@ts-ignore
//       setUsers((prev) => [...prev, initialUser]);
//       socket.emit("send move", {
//         id: socket.id,
//         room: roomID,
//         x,
//         y,
//         direction: null,
//         seq: lastSequenceRef.current++,
//       });
//     }
//     //@ts-ignore
//     if (!colorMapRef.current.has(socket.id))
//       //@ts-ignore
//       colorMapRef.current.set(socket.id, "default");

//     p5.mousePressed = () => {
//       const mouseX = p5.mouseX;
//       const mouseY = p5.mouseY;
//       const clickedUser = users.find(
//         (user) =>
//           mouseX >= user.x &&
//           mouseX <= user.x + SPRITE_SIZE &&
//           mouseY >= user.y &&
//           mouseY <= user.y + SPRITE_SIZE
//       );
//       if (clickedUser) handleUserClick(clickedUser);
//       else setSelectedUser(null);
//     };
//     //@ts-ignore
//     canvasRef.current = canvasParentRef as HTMLDivElement;
//   };

//   const draw = (p5: p5) => {
//     if (!p5Images) return;
//     p5.background(p5Images.bg);

//     const localUserIdx = users.findIndex((user) => user.id === socket.id);
//     if (localUserIdx !== -1) {
//       let localUser = { ...users[localUserIdx] };
//       let hasChanged = false;

//       if (p5.keyIsDown(87) || p5.keyIsDown(38)) {
//         localUser.y = Math.max(SPRITE_SIZE / 2, localUser.y - SPEED);
//         localUser.direction = "w";
//         hasChanged = true;
//       } else if (p5.keyIsDown(65) || p5.keyIsDown(37)) {
//         localUser.x = Math.max(SPRITE_SIZE / 2, localUser.x - SPEED);
//         localUser.direction = "a";
//         hasChanged = true;
//       } else if (p5.keyIsDown(83) || p5.keyIsDown(40)) {
//         localUser.y = Math.min(
//           CANVAS_HEIGHT - SPRITE_SIZE / 2,
//           localUser.y + SPEED
//         );
//         localUser.direction = "s";
//         hasChanged = true;
//       } else if (p5.keyIsDown(68) || p5.keyIsDown(39)) {
//         localUser.x = Math.min(
//           CANVAS_WIDTH - SPRITE_SIZE / 2,
//           localUser.x + SPEED
//         );
//         localUser.direction = "d";
//         hasChanged = true;
//       } else if (p5.keyIsDown(27)) {
//         localUser.quit = true;
//         hasChanged = true;
//       } else if (localUser.direction !== null) {
//         localUser.direction = null;
//         hasChanged = true;
//       }

//       if (hasChanged) {
//         setUsers((prev) => {
//           const newUsers = [...prev];
//           newUsers[localUserIdx] = localUser;
//           return newUsers;
//         });

//         const now = Date.now();
//         if (now - lastMoveTimeRef.current >= throttleMs) {
//           const seq = lastSequenceRef.current++;
//           socket.emit("send move", {
//             id: socket.id,
//             room: roomID,
//             x: localUser.x,
//             y: localUser.y,
//             direction: localUser.direction,
//             seq,
//           });
//           movementBuffer.current = null;
//           lastMoveTimeRef.current = now;
//           console.log(
//             `Sent move: x=${localUser.x}, y=${localUser.y}, seq=${seq}`
//           );
//         } else {
//           movementBuffer.current = {
//             x: localUser.x,
//             y: localUser.y,
//             direction: localUser.direction,
//             seq: lastSequenceRef.current,
//           };
//         }
//       }
//     }

//     users.forEach((user) => {
//       if (user.quit) return;

//       const interpolated =
//         user.id === socket.id
//           ? { x: user.x, y: user.y }
//           : interpolatedPositions.get(user.id) || { x: user.x, y: user.y };
//       const renderX = interpolated.x;
//       const renderY = interpolated.y;

//       // console.log(
//       //   `Rendering ${user.id}: x=${renderX}, y=${renderY}, direction=${user.direction}`
//       // );

//       const color =
//         colorMapRef.current.get(user.id) ||
//         //@ts-ignore
//         (Math.abs(user.id.hashCode()) % 2 === 0 ? "g" : "o");
//       if (!colorMapRef.current.has(user.id))
//         colorMapRef.current.set(user.id, color);

//       if (user.id === socket.id) {
//         switch (user.direction) {
//           case "w":
//             p5.image(p5Images.imgu, renderX, renderY, SPRITE_SIZE, SPRITE_SIZE);
//             break;
//           case "a":
//             p5.image(p5Images.imgl, renderX, renderY, SPRITE_SIZE, SPRITE_SIZE);
//             break;
//           case "s":
//             p5.image(p5Images.imgd, renderX, renderY, SPRITE_SIZE, SPRITE_SIZE);
//             break;
//           case "d":
//             p5.image(p5Images.imgr, renderX, renderY, SPRITE_SIZE, SPRITE_SIZE);
//             break;
//           default:
//             p5.image(p5Images.img, renderX, renderY, SPRITE_SIZE, SPRITE_SIZE);
//             break;
//         }
//       } else if (color === "g") {
//         switch (user.direction) {
//           case "w":
//             p5.image(
//               p5Images.imggb,
//               renderX,
//               renderY,
//               SPRITE_SIZE,
//               SPRITE_SIZE
//             );
//             break;
//           case "s":
//             p5.image(
//               p5Images.imggf,
//               renderX,
//               renderY,
//               SPRITE_SIZE,
//               SPRITE_SIZE
//             );
//             break;
//           case "a":
//             p5.image(
//               p5Images.imggl,
//               renderX,
//               renderY,
//               SPRITE_SIZE,
//               SPRITE_SIZE
//             );
//             break;
//           case "d":
//             p5.image(
//               p5Images.imggr,
//               renderX,
//               renderY,
//               SPRITE_SIZE,
//               SPRITE_SIZE
//             );
//             break;
//           default:
//             p5.image(p5Images.imgg, renderX, renderY, SPRITE_SIZE, SPRITE_SIZE);
//             break;
//         }
//       } else {
//         switch (user.direction) {
//           case "w":
//             p5.image(
//               p5Images.imgob,
//               renderX,
//               renderY,
//               SPRITE_SIZE,
//               SPRITE_SIZE
//             );
//             break;
//           case "s":
//             p5.image(
//               p5Images.imgof,
//               renderX,
//               renderY,
//               SPRITE_SIZE,
//               SPRITE_SIZE
//             );
//             break;
//           case "a":
//             p5.image(
//               p5Images.imagol,
//               renderX,
//               renderY,
//               SPRITE_SIZE,
//               SPRITE_SIZE
//             );
//             break;
//           case "d":
//             p5.image(
//               p5Images.imagor,
//               renderX,
//               renderY,
//               SPRITE_SIZE,
//               SPRITE_SIZE
//             );
//             break;
//           default:
//             p5.image(p5Images.imgo, renderX, renderY, SPRITE_SIZE, SPRITE_SIZE);
//             break;
//         }
//       }

//       p5.textAlign(p5.CENTER, p5.BOTTOM);
//       p5.textSize(16);
//       p5.fill(255);
//       p5.stroke(0);
//       p5.strokeWeight(2);
//       p5.text(user.name, renderX + SPRITE_SIZE / 2, renderY - -50);
//     });
//   };

//   useEffect(() => {
//     const animate = () => {
//       const newPositions = new Map<string, { x: number; y: number }>();
//       users.forEach((user) => {
//         if (user.id === socket.id || user.quit) return;
//         const current = interpolatedPositions.get(user.id) || {
//           x: user.x,
//           y: user.y,
//         };
//         newPositions.set(user.id, {
//           x: current.x + (user.x - current.x) * 0.1,
//           y: current.y + (user.y - current.y) * 0.1,
//         });
//       });
//       setInterpolatedPositions(newPositions);
//       animationRef.current = requestAnimationFrame(animate);
//     };

//     animationRef.current = requestAnimationFrame(animate);
//     return () => {
//       if (animationRef.current) cancelAnimationFrame(animationRef.current);
//     };
//   }, [users]);
//   //@ts-ignore
//   String.prototype.hashCode = function () {
//     let hash = 0;
//     for (let i = 0; i < this.length; i++) {
//       const char = this.charCodeAt(i);
//       hash = (hash << 5) - hash + char;
//       hash |= 0;
//     }
//     return hash;
//   };

//   const getPopupPosition = (user: UserPosition) => {
//     const popupWidth = 170;
//     const popupHeight = 150;
//     let left = user.x + SPRITE_SIZE / 2 - popupWidth / 2;
//     let top = user.y - popupHeight - -85;
//     left = Math.max(0, Math.min(left, CANVAS_WIDTH - popupWidth));
//     top = Math.max(0, Math.min(top, CANVAS_HEIGHT - popupHeight));
//     return { left, top };
//   };

//   return (
//     <div
//       className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-100 to-blue-200"
//       onClick={(e) => {
//         const rect = e.currentTarget.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;

//         const clickedUser = users.find(
//           (user) =>
//             x >= user.x &&
//             x <= user.x + SPRITE_SIZE &&
//             y >= user.y &&
//             y <= user.y + SPRITE_SIZE
//         );

//         if (clickedUser) handleUserClick(clickedUser);
//         else setSelectedUser(null);
//       }}
//     >
//       {
//         //@ts-ignore
//         <Sketch setup={setup} draw={draw} preload={preload} />
//       }
//       {selectedUser && (
//         <div
//           className="absolute bg-white p-2 rounded-xl shadow-2xl max-w-xs w-44 text-center border border-white z-50 animate-fade-in"
//           style={{
//             left: `${getPopupPosition(selectedUser).left}px`,
//             top: `${getPopupPosition(selectedUser).top}px`,
//           }}
//           onClick={(e) => e.stopPropagation()}
//         >
//           <button
//             className="absolute top-3 right-3 rounded-full w-4 h-4 flex items-center justify-center text-white text-md cursor-pointer transition-transform hover:rotate-90"
//             onClick={() => setSelectedUser(null)}
//           >
//             ×
//           </button>
//           <h2 className="text-md font-bold bg-black to-cyan-400 bg-clip-text text-transparent font-poppins">
//             {selectedUser.name}
//           </h2>
//           <div className="bg-white my-2 p-2 rounded-md text-gray-800 border border-black">
//             <p className="rounded-md text-black text-xs">
//               {selectedUser.loves || "Nothing entered yet"}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GameCanvas;

// original code above

// import React, {
//   useCallback,
//   useState,
//   Dispatch,
//   SetStateAction,
//   useRef,
//   useEffect,
// } from "react";
// import Sketch from "react-p5";
// import type p5 from "p5";
// import { UserPosition } from "../types";
// import { socket } from "./WebRTCManager";
// import imag from "../assets/Sprites/char-idle.png";
// import imgu from "../assets/Sprites/char-run-f.gif";
// import imgr from "../assets/Sprites/char-run-r-1.gif";
// import imgl from "../assets/Sprites/char-run-l.gif";
// import imgd from "../assets/Sprites/char-run-2.gif";
// import imagg from "../assets/Sprites/char-idle-green-1.png";
// import imago from "../assets/Sprites/char-idle-orange-1.png";
// import bg1 from "../assets/Sprites/bg-9.png";
// import bg2 from "../assets/Sprites/m-12.jpg";
// import bg4 from "../assets/Sprites/n-3.jpg";
// import bg6 from "../assets/Sprites/n-5.png";
// import imaggb from "../assets/Sprites/char-run-b-g.gif";
// import imggf from "../assets/Sprites/char-run-f-g.gif";
// import imaggl from "../assets/Sprites/char-run-l-g.gif";
// import imggr from "../assets/Sprites/char-run-r-g.gif";
// import imagob from "../assets/Sprites/char-run-b-o.gif";
// import imgof from "../assets/Sprites/char-run-f-o.gif";
// import imagol from "../assets/Sprites/char-run-l-o.gif";
// import imagor from "../assets/Sprites/char-run-r-o.gif";
// import { useLocation } from "react-router-dom";

// interface GameCanvasProps {
//   users: UserPosition[];
//   roomID: string;
//   name: string;
//   setUsers: Dispatch<SetStateAction<UserPosition[]>>;
// }

// const GameCanvas: React.FC<GameCanvasProps> = ({
//   users,
//   roomID,
//   name,
//   setUsers,
// }) => {
//   const [selectedUser, setSelectedUser] = useState<UserPosition | null>(null);
//   const [interpolatedPositions, setInterpolatedPositions] = useState<
//     Map<string, { x: number; y: number }>
//   >(new Map());
//   const canvasRef = useRef<HTMLDivElement>(null);
//   const movementBuffer = useRef<{
//     x: number;
//     y: number;
//     direction: string | null;
//     jumping: boolean;
//     seq: number;
//   } | null>(null);
//   const lastMoveTimeRef = useRef<number>(0);
//   const lastSequenceRef = useRef<number>(0);
//   const animationRef = useRef<number>();
//   const jumpStateRef = useRef<
//     Map<string, { startTime: number; height: number }>
//   >(new Map()); // Track jump animations
//   const location = useLocation();
//   const { loves } = location.state || { loves: "" };
//   const keysPressed = useRef({
//     up: false,
//     down: false,
//     left: false,
//     right: false,
//   });
//   const lastDirectionUpdateRef = useRef<number>(0);

//   const throttleMs = 20; // Movement throttle
//   // const directionChangeDebounce = 100; // Time in ms to wait before changing to idle state
//   const CANVAS_WIDTH = window.innerWidth;
//   const CANVAS_HEIGHT = window.innerHeight;
//   const SPRITE_SIZE = 132;
//   const SPEED = 2;
//   const JUMP_HEIGHT = 50; // Max height of jump
//   const JUMP_DURATION = 500; // Total jump duration in ms (up and down)
//   const backgrounds = [bg6, bg1, bg2, bg4];

//   const map = Math.floor(Math.random() * 4);

//   const [p5Images, setP5Images] = useState<{
//     img: p5.Image;
//     imgu: p5.Image;
//     imgr: p5.Image;
//     imgl: p5.Image;
//     imgd: p5.Image;
//     bg: p5.Image;
//     imgg: p5.Image;
//     imgo: p5.Image;
//     imggb: p5.Image;
//     imggf: p5.Image;
//     imggl: p5.Image;
//     imggr: p5.Image;
//     imgob: p5.Image;
//     imgof: p5.Image;
//     imagol: p5.Image;
//     imagor: p5.Image;
//   } | null>(null);
//   const colorMapRef = useRef<Map<string, string>>(new Map());

//   const handleUserClick = useCallback((user: UserPosition) => {
//     if (user.id !== socket.id) setSelectedUser(user);
//   }, []);

//   const preload = (p5: p5) => {
//     const images = {
//       img: p5.loadImage(imag),
//       imgu: p5.loadImage(imgu),
//       imgr: p5.loadImage(imgr),
//       imgl: p5.loadImage(imgl),
//       imgd: p5.loadImage(imgd),
//       bg: p5.loadImage(backgrounds[map]),
//       imgg: p5.loadImage(imagg),
//       imgo: p5.loadImage(imago),
//       imggb: p5.loadImage(imaggb),
//       imggf: p5.loadImage(imggf),
//       imggl: p5.loadImage(imaggl),
//       imggr: p5.loadImage(imggr),
//       imgob: p5.loadImage(imagob),
//       imgof: p5.loadImage(imgof),
//       imagol: p5.loadImage(imagol),
//       imagor: p5.loadImage(imagor),
//     };
//     setP5Images(images);
//   };

//   const getRandomPosition = () => {
//     const x =
//       Math.floor(Math.random() * (CANVAS_WIDTH - SPRITE_SIZE)) +
//       SPRITE_SIZE / 2;
//     const y =
//       Math.floor(Math.random() * (CANVAS_HEIGHT - SPRITE_SIZE)) +
//       SPRITE_SIZE / 2;
//     return { x, y };
//   };
//   //@ts-ignore
//   const sendMovementUpdate = (user, seq) => {
//     socket.emit("send move", {
//       id: socket.id,
//       room: roomID,
//       x: user.x,
//       y: user.y,
//       direction: user.direction,
//       jumping: user.jumping,
//       seq: seq,
//     });
//   };

//   const setup = (p5: p5, canvasParentRef: Element) => {
//     const frameRate =
//       //@ts-ignore
//       window.navigator.connection &&
//       //@ts-ignore
//       (window.navigator.connection as any).effectiveType === "2g"
//         ? 15
//         : 60;
//     p5.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).parent(canvasParentRef);
//     p5.frameRate(frameRate);

//     const localUserExists = users.some((user) => user.id === socket.id);
//     if (!localUserExists) {
//       const { x, y } = getRandomPosition();
//       const initialUser = {
//         id: socket.id,
//         room: roomID,
//         x,
//         y,
//         direction: null,
//         jumping: false,
//         quit: false,
//         name,
//         loves: loves || "Nothing entered yet",
//       };
//       //@ts-ignore
//       setUsers((prev) => [...prev, initialUser]);
//       socket.emit("send move", {
//         id: socket.id,
//         room: roomID,
//         x,
//         y,
//         direction: null,
//         jumping: false,
//         seq: lastSequenceRef.current++,
//       });
//     }
//     //@ts-ignore
//     if (!colorMapRef.current.has(socket.id))
//       //@ts-ignore
//       colorMapRef.current.set(socket.id, "default");

//     p5.mousePressed = () => {
//       const mouseX = p5.mouseX;
//       const mouseY = p5.mouseY;
//       const clickedUser = users.find(
//         (user) =>
//           mouseX >= user.x &&
//           mouseX <= user.x + SPRITE_SIZE &&
//           mouseY >= user.y &&
//           mouseY <= user.y + SPRITE_SIZE
//       );
//       if (clickedUser) handleUserClick(clickedUser);
//       else setSelectedUser(null);
//     };

//     // Set up keyboard event handlers for better movement control
//     p5.keyPressed = () => {
//       if (p5.keyCode === 38) keysPressed.current.up = true;
//       else if (p5.keyCode === 40) keysPressed.current.down = true;
//       else if (p5.keyCode === 37) keysPressed.current.left = true;
//       else if (p5.keyCode === 39) keysPressed.current.right = true;
//     };

//     p5.keyReleased = () => {
//       if (p5.keyCode === 38) keysPressed.current.up = false;
//       else if (p5.keyCode === 40) keysPressed.current.down = false;
//       else if (p5.keyCode === 37) keysPressed.current.left = false;
//       else if (p5.keyCode === 39) keysPressed.current.right = false;

//       // If no movement keys are pressed, reset direction
//       if (
//         !keysPressed.current.up &&
//         !keysPressed.current.down &&
//         !keysPressed.current.left &&
//         !keysPressed.current.right
//       ) {
//         const localUserIdx = users.findIndex((user) => user.id === socket.id);
//         if (localUserIdx !== -1 && users[localUserIdx].direction !== null) {
//           // Immediately update local state
//           setUsers((prev) => {
//             const newUsers = [...prev];
//             newUsers[localUserIdx] = {
//               ...newUsers[localUserIdx],
//               direction: null,
//             };
//             return newUsers;
//           });

//           // Send update to other users immediately
//           const seq = lastSequenceRef.current++;
//           sendMovementUpdate(
//             {
//               ...users[localUserIdx],
//               direction: null,
//             },
//             seq
//           );
//         }
//       }
//     };
//     //@ts-ignore
//     canvasRef.current = canvasParentRef as HTMLDivElement;
//   };

//   const draw = (p5: p5) => {
//     if (!p5Images) return;
//     p5.background(p5Images.bg);

//     const localUserIdx = users.findIndex((user) => user.id === socket.id);
//     if (localUserIdx !== -1) {
//       let localUser = { ...users[localUserIdx] };
//       let hasChanged = false;
//       let newDirection = localUser.direction;

//       // Determine direction from key states
//       if (keysPressed.current.up) {
//         localUser.y = Math.max(SPRITE_SIZE / 2, localUser.y - SPEED);
//         newDirection = "up";
//         hasChanged = true;
//       } else if (keysPressed.current.down) {
//         localUser.y = Math.min(
//           CANVAS_HEIGHT - SPRITE_SIZE / 2,
//           localUser.y + SPEED
//         );
//         newDirection = "down";
//         hasChanged = true;
//       } else if (keysPressed.current.left) {
//         localUser.x = Math.max(SPRITE_SIZE / 2, localUser.x - SPEED);
//         newDirection = "left";
//         hasChanged = true;
//       } else if (keysPressed.current.right) {
//         localUser.x = Math.min(
//           CANVAS_WIDTH - SPRITE_SIZE / 2,
//           localUser.x + SPEED
//         );
//         newDirection = "right";
//         hasChanged = true;
//       } else if (p5.keyIsDown(27)) {
//         localUser.quit = true;
//         hasChanged = true;
//       } else if (localUser.direction !== null) {
//         // Only reset direction if we were previously moving
//         // and no keys are pressed now
//         if (
//           !keysPressed.current.up &&
//           !keysPressed.current.down &&
//           !keysPressed.current.left &&
//           !keysPressed.current.right
//         ) {
//           newDirection = null;
//           hasChanged = true;
//         }
//       }

//       // Update direction if changed
//       if (newDirection !== localUser.direction) {
//         localUser.direction = newDirection;
//         lastDirectionUpdateRef.current = Date.now();
//         hasChanged = true;
//       }

//       // Spacebar for jumping
//       if (p5.keyIsDown(32) && !localUser.jumping) {
//         localUser.jumping = true;
//         //@ts-ignore
//         jumpStateRef.current.set(socket.id, {
//           startTime: Date.now(),
//           height: 0,
//         });
//         hasChanged = true;
//       }

//       // Update jump animation for local user
//       if (localUser.jumping) {
//         //@ts-ignore
//         const jumpData = jumpStateRef.current.get(socket.id);
//         if (jumpData) {
//           const elapsed = Date.now() - jumpData.startTime;
//           if (elapsed < JUMP_DURATION) {
//             // Calculate jump height (parabolic arc)
//             const t = elapsed / (JUMP_DURATION / 2) - 1; // Normalized time (-1 to 1)
//             jumpData.height = JUMP_HEIGHT * (t * t - 1); // Positive parabola: down then up
//           } else {
//             // Jump complete
//             localUser.jumping = false;
//             //@ts-ignore
//             jumpStateRef.current.delete(socket.id);
//             hasChanged = true;
//           }
//         }
//       }

//       if (hasChanged) {
//         // Update local user state
//         setUsers((prev) => {
//           const newUsers = [...prev];
//           newUsers[localUserIdx] = localUser;
//           return newUsers;
//         });

//         // Send movement update with throttling
//         const now = Date.now();
//         if (now - lastMoveTimeRef.current >= throttleMs) {
//           const seq = lastSequenceRef.current++;
//           sendMovementUpdate(localUser, seq);
//           movementBuffer.current = null;
//           lastMoveTimeRef.current = now;
//         } else {
//           // Buffer the movement for later sending
//           movementBuffer.current = {
//             x: localUser.x,
//             y: localUser.y,
//             direction: localUser.direction,
//             //@ts-ignore
//             jumping: localUser.jumping,
//             seq: lastSequenceRef.current,
//           };
//         }
//       }
//     }

//     // Process buffered movement if needed
//     const now = Date.now();
//     if (movementBuffer.current && now - lastMoveTimeRef.current >= throttleMs) {
//       const { x, y, direction, jumping, seq } = movementBuffer.current;
//       socket.emit("send move", {
//         id: socket.id,
//         room: roomID,
//         x,
//         y,
//         direction,
//         jumping,
//         seq,
//       });
//       movementBuffer.current = null;
//       lastMoveTimeRef.current = now;
//     }

//     // Render all users
//     users.forEach((user) => {
//       if (user.quit) return;

//       const interpolated =
//         user.id === socket.id
//           ? { x: user.x, y: user.y }
//           : interpolatedPositions.get(user.id) || { x: user.x, y: user.y };
//       let renderX = interpolated.x;
//       let renderY = interpolated.y;

//       // Apply jump animation
//       let jumpOffset = 0;
//       if (user.jumping) {
//         let jumpData = jumpStateRef.current.get(user.id);
//         if (!jumpData) {
//           jumpData = { startTime: Date.now(), height: 0 };
//           jumpStateRef.current.set(user.id, jumpData);
//         }
//         const elapsed = Date.now() - jumpData.startTime;
//         if (elapsed < JUMP_DURATION) {
//           const t = elapsed / (JUMP_DURATION / 2) - 1;
//           jumpData.height = JUMP_HEIGHT * (t * t - 1);
//           jumpOffset = jumpData.height;
//         } else {
//           jumpStateRef.current.delete(user.id);
//           setUsers((prev) =>
//             prev.map((u) => (u.id === user.id ? { ...u, jumping: false } : u))
//           );
//         }
//       }

//       renderY += jumpOffset; // Apply jump offset to rendering

//       // Determine user color
//       const color =
//         colorMapRef.current.get(user.id) ||
//         //@ts-ignore
//         (Math.abs(user.id.hashCode()) % 2 === 0 ? "g" : "o");
//       if (!colorMapRef.current.has(user.id))
//         colorMapRef.current.set(user.id, color);

//       // Render the appropriate sprite based on user state
//       if (user.id === socket.id) {
//         switch (user.direction) {
//           case "up":
//             p5.image(p5Images.imgu, renderX, renderY, SPRITE_SIZE, SPRITE_SIZE);
//             break;
//           case "left":
//             p5.image(p5Images.imgl, renderX, renderY, SPRITE_SIZE, SPRITE_SIZE);
//             break;
//           case "down":
//             p5.image(p5Images.imgd, renderX, renderY, SPRITE_SIZE, SPRITE_SIZE);
//             break;
//           case "right":
//             p5.image(p5Images.imgr, renderX, renderY, SPRITE_SIZE, SPRITE_SIZE);
//             break;
//           default:
//             p5.image(p5Images.img, renderX, renderY, SPRITE_SIZE, SPRITE_SIZE);
//             break;
//         }
//       } else if (color === "g") {
//         switch (user.direction) {
//           case "up":
//             p5.image(
//               p5Images.imggb,
//               renderX,
//               renderY,
//               SPRITE_SIZE,
//               SPRITE_SIZE
//             );
//             break;
//           case "down":
//             p5.image(
//               p5Images.imggf,
//               renderX,
//               renderY,
//               SPRITE_SIZE,
//               SPRITE_SIZE
//             );
//             break;
//           case "left":
//             p5.image(
//               p5Images.imggl,
//               renderX,
//               renderY,
//               SPRITE_SIZE,
//               SPRITE_SIZE
//             );
//             break;
//           case "right":
//             p5.image(
//               p5Images.imggr,
//               renderX,
//               renderY,
//               SPRITE_SIZE,
//               SPRITE_SIZE
//             );
//             break;
//           default:
//             p5.image(p5Images.imgg, renderX, renderY, SPRITE_SIZE, SPRITE_SIZE);
//             break;
//         }
//       } else {
//         switch (user.direction) {
//           case "up":
//             p5.image(
//               p5Images.imgob,
//               renderX,
//               renderY,
//               SPRITE_SIZE,
//               SPRITE_SIZE
//             );
//             break;
//           case "down":
//             p5.image(
//               p5Images.imgof,
//               renderX,
//               renderY,
//               SPRITE_SIZE,
//               SPRITE_SIZE
//             );
//             break;
//           case "left":
//             p5.image(
//               p5Images.imagol,
//               renderX,
//               renderY,
//               SPRITE_SIZE,
//               SPRITE_SIZE
//             );
//             break;
//           case "right":
//             p5.image(
//               p5Images.imagor,
//               renderX,
//               renderY,
//               SPRITE_SIZE,
//               SPRITE_SIZE
//             );
//             break;
//           default:
//             p5.image(p5Images.imgo, renderX, renderY, SPRITE_SIZE, SPRITE_SIZE);
//             break;
//         }
//       }

//       // Render user name
//       p5.textAlign(p5.CENTER, p5.BOTTOM);
//       p5.textSize(16);
//       p5.fill(255);
//       p5.stroke(0);
//       p5.strokeWeight(2);
//       p5.text(user.name, renderX + SPRITE_SIZE / 2, renderY - -50);
//     });
//   };

//   useEffect(() => {
//     const animate = () => {
//       const newPositions = new Map<string, { x: number; y: number }>();
//       users.forEach((user) => {
//         if (user.id === socket.id || user.quit) return;
//         const current = interpolatedPositions.get(user.id) || {
//           x: user.x,
//           y: user.y,
//         };

//         // Apply smoother interpolation for position updates
//         newPositions.set(user.id, {
//           x: current.x + (user.x - current.x) * 0.1,
//           y: current.y + (user.y - current.y) * 0.1,
//         });
//       });
//       setInterpolatedPositions(newPositions);
//       animationRef.current = requestAnimationFrame(animate);
//     };

//     animationRef.current = requestAnimationFrame(animate);
//     return () => {
//       if (animationRef.current) cancelAnimationFrame(animationRef.current);
//     };
//   }, [users]);

//   // Send buffered movements when component unmounts
//   useEffect(() => {
//     return () => {
//       if (movementBuffer.current) {
//         const { x, y, direction, jumping, seq } = movementBuffer.current;
//         socket.emit("send move", {
//           id: socket.id,
//           room: roomID,
//           x,
//           y,
//           direction,
//           jumping,
//           seq,
//         });
//       }
//     };
//   }, [roomID]);

//   // Add the hashCode method to String prototype if not exists
//   //@ts-ignore
//   if (!String.prototype.hashCode) {
//     //@ts-ignore
//     String.prototype.hashCode = function () {
//       let hash = 0;
//       for (let i = 0; i < this.length; i++) {
//         const char = this.charCodeAt(i);
//         hash = (hash << 5) - hash + char;
//         hash |= 0;
//       }
//       return hash;
//     };
//   }

//   const getPopupPosition = (user: UserPosition) => {
//     const popupWidth = 170;
//     const popupHeight = 150;
//     let left = user.x + SPRITE_SIZE / 2 - popupWidth / 2;
//     let top = user.y - popupHeight - -85;
//     left = Math.max(0, Math.min(left, CANVAS_WIDTH - popupWidth));
//     top = Math.max(0, Math.min(top, CANVAS_HEIGHT - popupHeight));
//     return { left, top };
//   };

//   return (
//     <div
//       className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-100 to-blue-200"
//       onClick={(e) => {
//         const rect = e.currentTarget.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;

//         const clickedUser = users.find(
//           (user) =>
//             x >= user.x &&
//             x <= user.x + SPRITE_SIZE &&
//             y >= user.y &&
//             y <= user.y + SPRITE_SIZE
//         );

//         if (clickedUser) handleUserClick(clickedUser);
//         else setSelectedUser(null);
//       }}
//     >
//       {
//         //@ts-ignore
//         <Sketch setup={setup} draw={draw} preload={preload} />
//       }

//       {selectedUser && (
//         <div
//           className="absolute bg-white p-2 rounded-xl shadow-2xl max-w-xs w-44 text-center border border-white z-50 animate-fade-in"
//           style={{
//             left: `${getPopupPosition(selectedUser).left}px`,
//             top: `${getPopupPosition(selectedUser).top}px`,
//           }}
//           onClick={(e) => e.stopPropagation()}
//         >
//           <button
//             className="absolute top-3 right-3 rounded-full w-4 h-4 flex items-center justify-center text-white text-md cursor-pointer transition-transform hover:rotate-90"
//             onClick={() => setSelectedUser(null)}
//           >
//             ×
//           </button>
//           <h2 className="text-md font-bold bg-black to-cyan-400 bg-clip-text text-transparent font-poppins">
//             {selectedUser.name}
//           </h2>
//           <div className="bg-white my-2 p-2 rounded-md text-gray-800 border border-black">
//             <p className="rounded-md text-black text-xs">
//               {selectedUser.loves || "Nothing entered yet"}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GameCanvas;

import React, {
  useCallback,
  useState,
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
} from "react";
import Sketch from "react-p5";
import type p5 from "p5";
import { UserPosition } from "../types";
import { socket } from "./WebRTCManager"; // Updated import
import imag from "../assets/Sprites/char-idle.png";
import imgu from "../assets/Sprites/char-run-f.gif";
import imgr from "../assets/Sprites/char-run-r-1.gif";
import imgl from "../assets/Sprites/char-run-l.gif";
import imgd from "../assets/Sprites/char-run-2.gif";
import imagg from "../assets/Sprites/char-idle-green-1.png";
import imago from "../assets/Sprites/char-idle-orange-1.png";
import bg1 from "../assets/Sprites/bg-9.png";
import bg2 from "../assets/Sprites/m-12.jpg";
// import bg4 from "../assets/Sprites/n-3.jpg";
import bg6 from "../assets/Sprites/n-5.png";
import imaggb from "../assets/Sprites/char-run-b-g.gif";
import imggf from "../assets/Sprites/char-run-f-g.gif";
import imaggl from "../assets/Sprites/char-run-l-g.gif";
import imggr from "../assets/Sprites/char-run-r-g.gif";
import imagob from "../assets/Sprites/char-run-b-o.gif";
import imgof from "../assets/Sprites/char-run-f-o.gif";
import imagol from "../assets/Sprites/char-run-l-o.gif";
import imagor from "../assets/Sprites/char-run-r-o.gif";
import { useLocation } from "react-router-dom";

interface GameCanvasProps {
  users: UserPosition[];
  roomID: string;
  name: string;
  setUsers: Dispatch<SetStateAction<UserPosition[]>>;
}

const GameCanvas: React.FC<GameCanvasProps> = ({
  users,
  roomID,
  name,
  setUsers,
}) => {
  const [selectedUser, setSelectedUser] = useState<UserPosition | null>(null);
  const [interpolatedPositions, setInterpolatedPositions] = useState<
    Map<string, { x: number; y: number }>
  >(new Map());
  const canvasRef = useRef<HTMLDivElement>(null);
  const movementBuffer = useRef<{
    x: number;
    y: number;

    direction: string | null;
    jumping: boolean;
    seq: number;
  } | null>(null);
  const lastMoveTimeRef = useRef<number>(0);
  const lastSequenceRef = useRef<number>(0);
  const animationRef = useRef<number>();
  const jumpStateRef = useRef<
    Map<string, { startTime: number; height: number }>
  >(new Map());
  const location = useLocation();
  const { loves } = location.state || { loves: "" };
  const keysPressed = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
  });
  const lastDirectionUpdateRef = useRef<number>(0);

  const throttleMs = 20;
  const CANVAS_WIDTH = window.innerWidth;
  const CANVAS_HEIGHT = window.innerHeight;
  const SPRITE_SIZE = 132;
  const SPEED = 2;
  const JUMP_HEIGHT = 50;
  const JUMP_DURATION = 500;
  const backgrounds = [bg6, bg1, bg2];
  const map = Math.floor(Math.random() * 3);

  const [p5Images, setP5Images] = useState<{
    img: p5.Image;
    imgu: p5.Image;
    imgr: p5.Image;
    imgl: p5.Image;
    imgd: p5.Image;
    bg: p5.Image;
    imgg: p5.Image;
    imgo: p5.Image;
    imggb: p5.Image;
    imggf: p5.Image;
    imggl: p5.Image;
    imggr: p5.Image;
    imgob: p5.Image;
    imgof: p5.Image;
    imagol: p5.Image;
    imagor: p5.Image;
  } | null>(null);
  const colorMapRef = useRef<Map<string, string>>(new Map());

  const handleUserClick = useCallback((user: UserPosition) => {
    if (user.id !== socket.id) setSelectedUser(user);
  }, []);

  const preload = (p5: p5) => {
    const images = {
      img: p5.loadImage(imag),
      imgu: p5.loadImage(imgu),
      imgr: p5.loadImage(imgr),
      imgl: p5.loadImage(imgl),
      imgd: p5.loadImage(imgd),
      bg: p5.loadImage(backgrounds[map]),
      imgg: p5.loadImage(imagg),
      imgo: p5.loadImage(imago),
      imggb: p5.loadImage(imaggb),
      imggf: p5.loadImage(imggf),
      imggl: p5.loadImage(imaggl),
      imggr: p5.loadImage(imggr),
      imgob: p5.loadImage(imagob),
      imgof: p5.loadImage(imgof),
      imagol: p5.loadImage(imagol),
      imagor: p5.loadImage(imagor),
    };
    setP5Images(images);
  };

  const getRandomPosition = () => {
    const x =
      Math.floor(Math.random() * (CANVAS_WIDTH - SPRITE_SIZE)) +
      SPRITE_SIZE / 2;
    const y =
      Math.floor(Math.random() * (CANVAS_HEIGHT - SPRITE_SIZE)) +
      SPRITE_SIZE / 2;
    return { x, y };
  };

  const sendMovementUpdate = (user: UserPosition, seq: number) => {
    socket.emit("send move", {
      id: socket.id,
      room: roomID,
      x: user.x,
      y: user.y,
      direction: user.direction,
      jumping: user.jumping,
      seq: seq,
    });
  };

  const setup = (p5: p5, canvasParentRef: Element) => {
    const frameRate =
      //@ts-ignore
      window.navigator.connection &&
      //@ts-ignore
      (window.navigator.connection as any).effectiveType === "2g"
        ? 15
        : 60;
    p5.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).parent(canvasParentRef);
    p5.frameRate(frameRate);

    const localUserExists = users.some((user) => user.id === socket.id);
    if (!localUserExists) {
      const { x, y } = getRandomPosition();
      const initialUser = {
        id: socket.id,
        room: roomID,
        x,
        y,
        direction: null,
        jumping: false,
        quit: false,
        name,
        loves: loves || "Nothing entered yet",
      };
      //@ts-ignore
      setUsers((prev) => [...prev, initialUser]);
      const seq = lastSequenceRef.current++;
      socket.emit("send move", {
        id: socket.id,
        room: roomID,
        x,
        y,
        direction: null,
        jumping: false,
        seq,
      });
      // Sync initial state with server response
      //@ts-ignore
      socket.once("receive move", (data) => {
        if (data.all) {
          setUsers(
            data.all.map((u: any) => ({
              id: u.id,
              x: u.x,
              y: u.y,
              direction: u.d,
              name: u.n,
              loves: u.l || "",
              quit: false,
              jumping: u.jumping || false,
              room: roomID,
            }))
          );
        }
      });
    }
    //@ts-ignore
    if (!colorMapRef.current.has(socket.id))
      //@ts-ignore
      colorMapRef.current.set(socket.id, "default");

    p5.mousePressed = () => {
      const mouseX = p5.mouseX;
      const mouseY = p5.mouseY;
      const clickedUser = users.find(
        (user) =>
          mouseX >= user.x &&
          mouseX <= user.x + SPRITE_SIZE &&
          mouseY >= user.y &&
          mouseY <= user.y + SPRITE_SIZE
      );
      if (clickedUser) handleUserClick(clickedUser);
      else setSelectedUser(null);
    };

    p5.keyPressed = () => {
      if (p5.keyCode === 38) keysPressed.current.up = true;
      else if (p5.keyCode === 40) keysPressed.current.down = true;
      else if (p5.keyCode === 37) keysPressed.current.left = true;
      else if (p5.keyCode === 39) keysPressed.current.right = true;
    };

    p5.keyReleased = () => {
      if (p5.keyCode === 38) keysPressed.current.up = false;
      else if (p5.keyCode === 40) keysPressed.current.down = false;
      else if (p5.keyCode === 37) keysPressed.current.left = false;
      else if (p5.keyCode === 39) keysPressed.current.right = false;

      if (
        !keysPressed.current.up &&
        !keysPressed.current.down &&
        !keysPressed.current.left &&
        !keysPressed.current.right
      ) {
        const localUserIdx = users.findIndex((user) => user.id === socket.id);
        if (localUserIdx !== -1 && users[localUserIdx].direction !== null) {
          setUsers((prev) => {
            const newUsers = [...prev];
            newUsers[localUserIdx] = {
              ...newUsers[localUserIdx],
              direction: null,
            };
            return newUsers;
          });
          const seq = lastSequenceRef.current++;
          sendMovementUpdate({ ...users[localUserIdx], direction: null }, seq);
        }
      }
    };
    //@ts-ignore
    canvasRef.current = canvasParentRef as HTMLDivElement;
  };

  const draw = (p5: p5) => {
    if (!p5Images) return;
    p5.background(p5Images.bg);

    const localUserIdx = users.findIndex((user) => user.id === socket.id);
    if (localUserIdx !== -1) {
      let localUser = { ...users[localUserIdx] };
      let hasChanged = false;
      let newDirection = localUser.direction;

      if (keysPressed.current.up) {
        localUser.y = Math.max(SPRITE_SIZE / 2, localUser.y - SPEED);
        newDirection = "up";
        hasChanged = true;
      } else if (keysPressed.current.down) {
        localUser.y = Math.min(
          CANVAS_HEIGHT - SPRITE_SIZE / 2,
          localUser.y + SPEED
        );
        newDirection = "down";
        hasChanged = true;
      } else if (keysPressed.current.left) {
        localUser.x = Math.max(SPRITE_SIZE / 2, localUser.x - SPEED);
        newDirection = "left";
        hasChanged = true;
      } else if (keysPressed.current.right) {
        localUser.x = Math.min(
          CANVAS_WIDTH - SPRITE_SIZE / 2,
          localUser.x + SPEED
        );
        newDirection = "right";
        hasChanged = true;
      } else if (p5.keyIsDown(27)) {
        localUser.quit = true;
        hasChanged = true;
      } else if (
        localUser.direction !== null &&
        !keysPressed.current.up &&
        !keysPressed.current.down &&
        !keysPressed.current.left &&
        !keysPressed.current.right
      ) {
        newDirection = null;
        hasChanged = true;
      }

      if (newDirection !== localUser.direction) {
        localUser.direction = newDirection;
        lastDirectionUpdateRef.current = Date.now();
        hasChanged = true;
      }

      if (p5.keyIsDown(32) && !localUser.jumping) {
        localUser.jumping = true;
        //@ts-ignore
        jumpStateRef.current.set(socket.id, {
          startTime: Date.now(),
          height: 0,
        });
        hasChanged = true;
      }

      if (localUser.jumping) {
        //@ts-ignore
        const jumpData = jumpStateRef.current.get(socket.id);
        if (jumpData) {
          const elapsed = Date.now() - jumpData.startTime;
          if (elapsed < JUMP_DURATION) {
            const t = elapsed / (JUMP_DURATION / 2) - 1;
            jumpData.height = JUMP_HEIGHT * (t * t - 1);
          } else {
            localUser.jumping = false;
            //@ts-ignore
            jumpStateRef.current.delete(socket.id);
            hasChanged = true;
          }
        }
      }

      if (hasChanged) {
        setUsers((prev) => {
          const newUsers = [...prev];
          newUsers[localUserIdx] = localUser;
          return newUsers;
        });

        const now = Date.now();
        if (now - lastMoveTimeRef.current >= throttleMs) {
          const seq = lastSequenceRef.current++;
          sendMovementUpdate(localUser, seq);
          movementBuffer.current = null;
          lastMoveTimeRef.current = now;
        } else {
          movementBuffer.current = {
            x: localUser.x,
            y: localUser.y,
            direction: localUser.direction,
            //@ts-ignore
            jumping: localUser.jumping,

            seq: lastSequenceRef.current,
          };
        }
      }
    }

    const now = Date.now();
    if (movementBuffer.current && now - lastMoveTimeRef.current >= throttleMs) {
      const { x, y, direction, jumping, seq } = movementBuffer.current;
      socket.emit("send move", {
        id: socket.id,
        room: roomID,
        x,
        y,
        direction,
        jumping,
        seq,
      });
      movementBuffer.current = null;
      lastMoveTimeRef.current = now;
    }

    users.forEach((user) => {
      if (user.quit) return;

      const interpolated =
        user.id === socket.id
          ? { x: user.x, y: user.y }
          : interpolatedPositions.get(user.id) || { x: user.x, y: user.y };
      let renderX = interpolated.x;
      let renderY = interpolated.y;

      let jumpOffset = 0;
      if (user.jumping) {
        let jumpData = jumpStateRef.current.get(user.id);
        if (!jumpData) {
          jumpData = { startTime: Date.now(), height: 0 };
          jumpStateRef.current.set(user.id, jumpData);
        }
        const elapsed = Date.now() - jumpData.startTime;
        if (elapsed < JUMP_DURATION) {
          const t = elapsed / (JUMP_DURATION / 2) - 1;
          jumpData.height = JUMP_HEIGHT * (t * t - 1);
          jumpOffset = jumpData.height;
        } else {
          jumpStateRef.current.delete(user.id);
          setUsers((prev) =>
            prev.map((u) => (u.id === user.id ? { ...u, jumping: false } : u))
          );
        }
      }

      renderY += jumpOffset;

      const color =
        colorMapRef.current.get(user.id) ||
        //@ts-ignore
        (Math.abs(user.id.hashCode()) % 2 === 0 ? "g" : "o");
      if (!colorMapRef.current.has(user.id))
        colorMapRef.current.set(user.id, color);

      if (user.id === socket.id) {
        switch (user.direction) {
          case "up":
            p5.image(p5Images.imgu, renderX, renderY, SPRITE_SIZE, SPRITE_SIZE);
            break;
          case "left":
            p5.image(p5Images.imgl, renderX, renderY, SPRITE_SIZE, SPRITE_SIZE);
            break;
          case "down":
            p5.image(p5Images.imgd, renderX, renderY, SPRITE_SIZE, SPRITE_SIZE);
            break;
          case "right":
            p5.image(p5Images.imgr, renderX, renderY, SPRITE_SIZE, SPRITE_SIZE);
            break;
          default:
            p5.image(p5Images.img, renderX, renderY, SPRITE_SIZE, SPRITE_SIZE);
            break;
        }
      } else if (color === "g") {
        switch (user.direction) {
          case "up":
            p5.image(
              p5Images.imggb,
              renderX,
              renderY,
              SPRITE_SIZE,
              SPRITE_SIZE
            );
            break;
          case "down":
            p5.image(
              p5Images.imggf,
              renderX,
              renderY,
              SPRITE_SIZE,
              SPRITE_SIZE
            );
            break;
          case "left":
            p5.image(
              p5Images.imggl,
              renderX,
              renderY,
              SPRITE_SIZE,
              SPRITE_SIZE
            );
            break;
          case "right":
            p5.image(
              p5Images.imggr,
              renderX,
              renderY,
              SPRITE_SIZE,
              SPRITE_SIZE
            );
            break;
          default:
            p5.image(p5Images.imgg, renderX, renderY, SPRITE_SIZE, SPRITE_SIZE);
            break;
        }
      } else {
        switch (user.direction) {
          case "up":
            p5.image(
              p5Images.imgob,
              renderX,
              renderY,
              SPRITE_SIZE,
              SPRITE_SIZE
            );
            break;
          case "down":
            p5.image(
              p5Images.imgof,
              renderX,
              renderY,
              SPRITE_SIZE,
              SPRITE_SIZE
            );
            break;
          case "left":
            p5.image(
              p5Images.imagol,
              renderX,
              renderY,
              SPRITE_SIZE,
              SPRITE_SIZE
            );
            break;
          case "right":
            p5.image(
              p5Images.imagor,
              renderX,
              renderY,
              SPRITE_SIZE,
              SPRITE_SIZE
            );
            break;
          default:
            p5.image(p5Images.imgo, renderX, renderY, SPRITE_SIZE, SPRITE_SIZE);
            break;
        }
      }

      p5.textAlign(p5.CENTER, p5.BOTTOM);
      p5.textSize(16);
      p5.fill(255);
      p5.stroke(0);
      p5.strokeWeight(2);
      p5.text(user.name, renderX + SPRITE_SIZE / 2, renderY - -50);
    });
  };

  useEffect(() => {
    const animate = () => {
      const newPositions = new Map<string, { x: number; y: number }>();
      users.forEach((user) => {
        if (user.id === socket.id || user.quit) return;
        const current = interpolatedPositions.get(user.id) || {
          x: user.x,
          y: user.y,
        };
        newPositions.set(user.id, {
          x: current.x + (user.x - current.x) * 0.1,
          y: current.y + (user.y - current.y) * 0.1,
        });
      });
      setInterpolatedPositions(newPositions);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [users]);

  useEffect(() => {
    return () => {
      if (movementBuffer.current) {
        const { x, y, direction, jumping, seq } = movementBuffer.current;
        socket.emit("send move", {
          id: socket.id,
          room: roomID,
          x,
          y,
          direction,
          jumping,
          seq,
        });
      }
    };
  }, [roomID]);
  //@ts-ignore
  if (!String.prototype.hashCode) {
    //@ts-ignore
    String.prototype.hashCode = function () {
      let hash = 0;
      for (let i = 0; i < this.length; i++) {
        const char = this.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
      }
      return hash;
    };
  }

  const getPopupPosition = (user: UserPosition) => {
    const popupWidth = 170;
    const popupHeight = 150;
    let left = user.x + SPRITE_SIZE / 2 - popupWidth / 2;
    let top = user.y - popupHeight - -85;
    left = Math.max(0, Math.min(left, CANVAS_WIDTH - popupWidth));
    top = Math.max(0, Math.min(top, CANVAS_HEIGHT - popupHeight));
    return { left, top };
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-gray-100 to-blue-200"
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const clickedUser = users.find(
          (user) =>
            x >= user.x &&
            x <= user.x + SPRITE_SIZE &&
            y >= user.y &&
            y <= user.y + SPRITE_SIZE
        );

        if (clickedUser) handleUserClick(clickedUser);
        else setSelectedUser(null);
      }}
    >
      {
        //@ts-ignore
        <Sketch setup={setup} draw={draw} preload={preload} />
      }

      {selectedUser && (
        <div
          className="absolute bg-white p-2 rounded-xl shadow-2xl max-w-xs w-44 text-center border border-white z-50 animate-fade-in"
          style={{
            left: `${getPopupPosition(selectedUser).left}px`,
            top: `${getPopupPosition(selectedUser).top}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-3 right-3 rounded-full w-4 h-4 flex items-center justify-center text-white text-md cursor-pointer transition-transform hover:rotate-90"
            onClick={() => setSelectedUser(null)}
          >
            ×
          </button>
          <h2 className="text-md font-bold bg-black to-cyan-400 bg-clip-text text-transparent font-poppins">
            {selectedUser.name}
          </h2>
          <div className="bg-white my-2 p-2 rounded-md text-gray-800 border border-black">
            <p className="rounded-md text-black text-xs">
              {selectedUser.loves || "Nothing entered yet"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCanvas;
