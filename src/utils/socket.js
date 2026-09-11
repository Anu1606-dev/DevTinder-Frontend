import { io } from "socket.io-client";

export const createSocketConnection = () => {
  return io(import.meta.env.VITE_SOCKET_URL || "http://localhost:7777", {
    withCredentials: true,
  });
};