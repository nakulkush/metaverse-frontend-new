// import React, { useRef, useEffect } from "react";
// import * as tf from "@tensorflow/tfjs";
// import * as blazeface from "@tensorflow-models/blazeface";
// import Webcam from "react-webcam";
// import "./Model.css";
// import { ModelProps } from "../types";

// function Model({ setFaces }: ModelProps) {
//   const webcamRef = useRef<Webcam>(null);

//   const runHandpose = async () => {
//     const net = await blazeface.load();
//     setInterval(() => {
//       detect(net);
//     }, 1000);
//   };

//   const detect = async (net: blazeface.BlazeFaceModel) => {
//     if (
//       webcamRef.current &&
//       webcamRef.current.video &&
//       webcamRef.current.video.readyState === 4
//     ) {
//       const video = webcamRef.current.video;
//       const videoWidth = video.videoWidth;
//       const videoHeight = video.videoHeight;

//       video.width = videoWidth;
//       video.height = videoHeight;

//       const faces = await net.estimateFaces(video);
//       setFaces(faces.length);
//     }
//   };

//   useEffect(() => {
//     runHandpose();
//   }, []);

//   return (
//     <div className="model">
//       <Webcam
//         ref={webcamRef}
//         style={{
//           width: "0px",
//           height: "0px",
//         }}
//       />
//     </div>
//   );
// }

// export default Model;
