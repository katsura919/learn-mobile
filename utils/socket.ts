// socket.ts
import { io } from "socket.io-client";
import * as SecureStore from "expo-secure-store";

const apiUrl = "http://10.0.2.2:5000";
const socket = io(apiUrl, {
  transports: ["websocket"],
  autoConnect: false,
});

export const connectSocket = async () => {
  const userData = await SecureStore.getItemAsync("userData");
  const parsed = userData ? JSON.parse(userData) : null;

  if (parsed?.id) {
    socket.connect();

    socket.on("connect", () => {
      console.log("Socket connected with ID:", socket.id);
      socket.emit("joinRoom", parsed.id);
    });
  } else {
    console.log("No user data found, unable to connect to socket.");
  }
};

export default socket;
