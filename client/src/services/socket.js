import { io } from "socket.io-client";

const URL = import.meta.env.VITE_SERVER_URL || "http://localhost:4000";
export const socket = io(URL, { autoConnect: true });

// Debug logs
socket.on("connect", () => console.log("Connected to server:", socket.id));
socket.on("connect_error", (err) => console.error("Socket connect error:", err));
socket.on("disconnect", (reason) => console.log("Disconnected:", reason));
