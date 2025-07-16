import { IMessage } from "@/interfaces/chat.interface";
import { io, Socket } from "socket.io-client";

export interface RideInfo {
  rideId: string;
  driver: {
    name: string;
    location: {
      coordinates: [number, number];
    };
    vehicleDetails: {
      brand: string;
      vehicleModel: string;
      color: string;
      category: string;
    };
  };
  distance: number;
  totalFare: number;
  estTime: number;
  pickupLocation: string;
  dropOffLocation: string;
  startedTime: string;
  pickupCoords: [number, number];
  dropOffCoords: [number, number];
  OTP: string;
}
export interface ServerToClientEvents {
  "ride-accepted": (data: RideInfo) => void;
  "ride-rejected": (driverId: string) => void;
  "driver-location-update": (data: {
    type: "toPickup" | "toDropOff";
    location: [number, number];
  }) => void;
  "new-ride-req": (data: {
    user: { id: string; name: string };
    pickupCoords: [number, number];
    dropOffCoords: [number, number];
    fare: number;
  }) => void;
  "ride-cancelled": () => void;
  "driver-reached": () => void;
  connect: () => void;
  disconnect: () => void;
  "no-driver-response": () => void;
  "dropOff-reached": (data: { rideId: string; fare: number }) => void;
  "payment-received": () => void;
  "payment-success": () => void;
  "chat-msg": (data: IMessage) => void;
  'ride-error':(data:{message:string})=> void
  'keep-alive':()=>void
}

interface ClientToServerEvents {
  "go-online": (data: { driverId: string }) => void;
  "reject-ride": (userId: string) => void;
  "driver-ride-accepted": (data: {
    token: string;
    userId: string;
    pickupLocation: string;
    dropOffLocation: string;
    distance: number;
    time: number;
    fare: number;
    pickupCoords: [number, number];
    dropOffCoords: [number, number];
  }) => void;
  "no-response": (userId: string) => void;
  "request-ride": (data: {
    category: string;
    pickupCoords: [number, number];
    dropOffCoords: [number, number];
    distance: number;
    offerId: string | null;
    time: number;
    fare: number;
  }) => void;
  "driver-location-update": (data: {
    type: "toPickup" | "toDropOff";
    location: [number, number];
  }) => void;
  "driver-reached": () => void;
  "cancel-ride": (cancelledBy: "driver" | "user") => void;
  "dropOff-reached": () => void;
  "chat-msg": (data: { text: string; sendBy: "user" | "driver" }) => void;
  'keep-alive':()=> void;
}

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  SOCKET_URL,
  {
    withCredentials: true,
    transports: ["websocket"],
    autoConnect: false,
  }
);

export const connectSocket = (token: string, role: "driver" | "user") => {
  socket.auth = { token, role };
  socket.connect();

  socket.on("connect", () => {
    console.log(`Connected as ${role} with ID: ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from socket server");
  });
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("Socket disconnected");
  }
};
