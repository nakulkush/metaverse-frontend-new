import { Socket } from "socket.io-client";

export interface MessageData {
  room: string;
  senderId: string;
  senderName: string;
  message: string;
  time: string;
}

export interface ChatProps {
  socket: Socket;
  room: string;
  name: string;
}

export interface UserPosition {
  id: string;
  room: string;
  x: number;
  y: number;
  direction: string | null;
  quit: boolean;
  name: string;
  loves?: string; // Add this line
  jumping?: boolean;
  seq?: number; // Add this line
  // Add this line
}

export interface ModelProps {
  setFaces: (faces: number) => void; // Matches Room.tsx usage
}

export interface NearbyPeer {
  peerID: string;
  name: string;
  stream: MediaStream | null;
}

export interface WhiteboardState {
  [clusterID: string]: any; // Optional for clustering
}
