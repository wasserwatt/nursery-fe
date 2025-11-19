import { io, Socket } from "socket.io-client";
import { VITE_WS_URL } from "../configs/env";
import { getAccessToken } from "../utils/local-storage";

export function createSocket(): Socket {
  const token = getAccessToken();

  const socket = io(VITE_WS_URL, {
    transports: ["polling", "websocket"], // ⭐ ต้องมี polling ด้วย
    auth: token ? { token: `Bearer ${token}` } : undefined,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => console.debug("WS connected:", socket.id));
  socket.on("disconnect", (reason) =>
    console.debug("WS disconnected:", reason)
  );
  socket.on("connect_error", (err) =>
    console.warn("WS connect_error:", err.message)
  );

  return socket;
}
