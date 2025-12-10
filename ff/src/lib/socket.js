import { io } from "socket.io-client";

let socket = null;
export function initSocket(token) {
  if (socket) return socket;
  socket = io(process.env.REACT_APP_API_BASE_URL || "/", {
    transports: ["websocket", "polling"],
    auth: { token },
  });
  return socket;
}
export function getSocket() { return socket; }