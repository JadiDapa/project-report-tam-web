import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_BASE_API_URL_SOCKET);
