import React, { RefObject, useEffect, useRef } from "react";
import { NearbyPeer } from "../types";

interface VideoProps {
  stream: MediaStream;
  peerId: string;
}

export const Video: React.FC<VideoProps> = ({ stream, peerId }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    if (streamRef.current !== stream) {
      streamRef.current = stream;
      ref.current.srcObject = stream;
      if (stream.active) {
        ref.current
          .play()
          .catch((err) => console.error(`❌ Video error for ${peerId}:`, err));
      }
    }

    return () => {
      if (ref.current) {
        ref.current.pause();
        ref.current.srcObject = null;
      }
    };
  }, [stream, peerId]);

  return (
    <video
      className="w-full h-full object-cover rounded-md"
      playsInline
      autoPlay
      ref={ref}
    />
  );
};

const muteUnmute = (
  videoRef: RefObject<HTMLVideoElement>,
  setMic: (val: boolean) => void
) => {
  if (videoRef.current?.srcObject instanceof MediaStream) {
    const audioTracks = videoRef.current.srcObject.getAudioTracks();
    audioTracks.forEach((track) => (track.enabled = !track.enabled));
    setMic(audioTracks[0]?.enabled ?? false);
  }
};

const cameraOnOff = (
  videoRef: RefObject<HTMLVideoElement>,
  setCam: (val: boolean) => void
) => {
  if (videoRef.current?.srcObject instanceof MediaStream) {
    const videoTracks = videoRef.current.srcObject.getVideoTracks();
    videoTracks.forEach((track) => (track.enabled = !track.enabled));
    setCam(videoTracks[0]?.enabled ?? false);
  }
};

export const VideoContainer: React.FC<{
  name: string;
  mic: boolean;
  cam: boolean;
  nearby: NearbyPeer[];
  userVideoRef: RefObject<HTMLVideoElement>;
  peerStreams: Map<string, MediaStream>;
  setMic: (val: boolean) => void;
  setCam: (val: boolean) => void;
}> = ({
  // name,
  mic,
  cam,
  nearby,
  userVideoRef,
  peerStreams,
  setMic,
  setCam,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {/* Video Grid */}
      <div className="flex flex-wrap gap-2 justify-start">
        {/* User's Video */}
        <div
          className=" bg-transparent bg-opacity-80 rounded-lg p-2 w-60 h-48 fixed bottom-0 right-0 m-2 mr-4 mb-0
            transition-all duration-500 ease-in-out

                hover
                shadow-2xl
                hover"
        >
          <p className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 px-1 py-0.5 rounded">
            You
          </p>

          <video
            className="w-full h-44  object-cover rounded-md"
            muted
            ref={userVideoRef}
            autoPlay
            playsInline
          />
        </div>

        {/* Peer Videos */}
        {nearby.map((peer) => {
          const stream = peerStreams.get(peer.peerID);
          return (
            <div
              key={peer.peerID}
              className="relative bg-transparent bg-opacity-80 rounded-lg p-2 w-60 h-48
                transition-all duration-500 ease-in-out

                hover
                shadow-2xl
                hover"
            >
              <p className="absolute top-1 left-1 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                {peer.name}
              </p>

              {stream && stream.active ? (
                <Video stream={stream} peerId={peer.peerID} />
              ) : (
                <div className="w-full h-44 flex items-center justify-center bg-black bg-opacity-80 rounded-md">
                  <p className="text-white text-xs">{`Loading...`}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-2 fixed bottom-40 right-0 m-4 mr-5 w-60 max-h-48 z-20">
        <button
          onClick={() => muteUnmute(userVideoRef, setMic)}
          className={`h-12 w-8 rounded-md text-white bg-transparent hover:bg-gray-700 transition-colors`}
        >
          <i className={`fa fa-microphone${mic ? "" : "-slash"}`}></i>
        </button>

        <button
          onClick={() => cameraOnOff(userVideoRef, setCam)}
          className={`h-12 w-8 rounded-md text-white bg-transparent hover:bg-gray-700 transition-colors`}
        >
          <i className={`fa fa-camera${cam ? "" : "-retro"}`}></i>
        </button>
      </div>
    </div>
  );
};
