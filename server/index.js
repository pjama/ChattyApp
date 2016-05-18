"use strict";
const PORT = process.env.PORT || 8080; // default port 8080

const http              = require("http");
const express           = require("express");
const app = express();

const UserManager       = require("./user_manager");
var userManager         = new UserManager();

app.use(express.static(__dirname + "/../client/dist"));
app.set("port", PORT);

var server = http.createServer(app);
var io = require("socket.io").listen(server);

/* 
 * Events defined as constants
 */
const EVENT_NEW_CONNECTION  = "connection";
const EVENT_DISCONNECT      = "disconnect";
const EVENT_CHAT_MESSAGE    = "chat_message";
const EVENT_CLIENT_INIT     = "init"
/*
 * Handle new WebSocket connections
 */
io.sockets.on(EVENT_NEW_CONNECTION, (socketConnection) => {
  console.log(`Client Connected: ${socketConnection.id}`);
  userManager.addUser(socketConnection.id, null);

  /* 
   * Register callbacks for various events (chat messages, disconnection, etc.)
   */
  socketConnection.on(EVENT_CHAT_MESSAGE, (data) => {
    // re-emit (broadcast) to other connected clients
    socketConnection.broadcast.emit(EVENT_CHAT_MESSAGE, data);
  });

  socketConnection.on(EVENT_DISCONNECT, () => {
    console.log(`Client Disconnected: ${socketConnection.id}`);
    userManager.removeUser(socketConnection.id);
  });

  let initData = {
    users: userManager.getUsersArray(),
    messages: [
      { user:"Admin", text:"Hello friend" },
      { user:"Admin", text:`For now, I'll refer to you as ${socketConnection.id}` }
    ]
  };

  socketConnection.emit(EVENT_CLIENT_INIT, initData);
});

server.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
