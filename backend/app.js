const express = require("express");
const socket = require("socket.io");
const { ExpressPeerServer } = require("peer");
const { v4: uuidv4 } = require("uuid");
const PORT = 5000;

const app = express();

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use("/peerjs", peerServer);

const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let peers = [];

const broadcastEventTypes = {
  ACTIVE_USERS: "ACTIVE_USERS",
};

io.on("connection", (socket) => {
  socket.emit("connection", null);

  console.log("new user connected");
  console.log(socket.id);

  socket.on("register-new-user", (data) => {
    peers.push({
      userName: data.userName,
      socketId: data.socketId,
    });
    console.log("registered new user");
    console.log(peers);
    io.sockets.emit("broadcast", {
      event: broadcastEventTypes.ACTIVE_USERS,
      activeUsers: peers,
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    peers = peers.filter((peer) => peer.socketId !== socket.id);
    io.sockets.emit("broadcast", {
      event: broadcastEventTypes.ACTIVE_USERS,
      activeUsers: peers,
    });
  });
});
