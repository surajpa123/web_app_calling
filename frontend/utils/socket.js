import socketClient from "socket.io-client";

const SERVER = "http://localhost:5000";

const broadCastEventTypes = {
  ACTIVE_USERS: "ACTIVE_USERS",
};

let socket;

export const connectWithWebSocket = () => {
  socket = socketClient(SERVER);
  socket.on("connection", () => {
    console.log("Connected to the server");
    console.log(socket.id);
  });
};

export const registerNewUser = (userName) => {
  socket.emit("register-new-user", {
    userName: userName,
    socketId: socket.id,
  });
};

export const sendPreOffer = (data) => {
  socket.emit("pre-offer", data);
};
export const sendPreOfferAnswer = (data) => {
  socket.emit("pre-offer-answer", data);
};
export const sendWebRTCOffer = (data) => {
  socket.emit("webRTC-offer", data);
};

export const sendWebRTCAnswer = (data) => {
  socket.emit("webRTC-answer", data);
};
export const sendWebRTCCandidate = (data) => {
  socket.emit("webRTC-candidate", data);
};
export const sendUserHangedUp = (data) => {
  socket.emit("user-hanged-up", data);
};
