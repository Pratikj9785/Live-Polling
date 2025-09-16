import { io } from "socket.io-client";

const URL = import.meta.env.VITE_SERVER_URL || "http://localhost:4000";

export const socket = io(URL, {
  autoConnect: true,
  transports: ["websocket"],
  upgrade: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 500,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  withCredentials: false,
});

// Debug logs
socket.on("connect", () => console.log("Connected to server:", socket.id));
socket.on("connect_error", (err) => console.error("Socket connect error:", err));
socket.on("reconnect_attempt", (n) => console.log("Reconnect attempt:", n));
socket.on("reconnect", (n) => console.log("Reconnected after attempts:", n));
socket.on("disconnect", (reason) => console.log("Disconnected:", reason));
