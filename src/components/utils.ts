import { RefObject } from "react";

export const muteUnmute = (
  userVideoRef: RefObject<HTMLVideoElement>,
  setMic: (val: boolean) => void
) => {
  const stream = userVideoRef.current?.srcObject as MediaStream;
  if (!stream) return;
  const enabled = stream.getAudioTracks()[0].enabled;
  stream.getAudioTracks()[0].enabled = !enabled;
  setMic(!enabled);
  document.querySelector(".mute-1")?.classList.toggle("whitened");
};

export const cameraOnOff = (
  userVideoRef: RefObject<HTMLVideoElement>,
  setCam: (val: boolean) => void
) => {
  const stream = userVideoRef.current?.srcObject as MediaStream;
  if (!stream) return;
  const enabled = stream.getVideoTracks()[0].enabled;
  stream.getVideoTracks()[0].enabled = !enabled;
  setCam(!enabled);
  document.querySelector(".camera-1")?.classList.toggle("cameraOff");
};
