import http from "http";
import { server as WebSocketServer } from "websocket";
import { RESTART, Room, TIE, USER_READY, USER_SELECTED } from "./class/Room.js";
import { tryParseMessage } from "./utils/common.js";
import express from "express";


//REST API
//Since it is test application. I am using simple array to store user score and history
//In reality, it is recommneded to user DB
const userData = []
const app = express();

app.listen(3000, () =>
  console.log(`Express is running on port 3000`)
);

app.get("/api/user/:connectionID", (req, res, next) => {
  const connectionID = req.params.connectionID
  const user = userData.find(user => user.connectionID === connectionID)

  res.status(200).json(user)
})

var server = http.createServer(function (request, response) {
  console.log(new Date() + " Received request for " + request.url);
  response.writeHead(404);
  response.end();
});
server.listen(8080, function () {
  console.log(new Date() + " Server is listening on port 8080");
});

const socket = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

const room = new Room(2);

const onMessage = (message) => {
  let parsedMessage = tryParseMessage(message);
  const index = room.getIndex(parsedMessage.user.connectionID);
  if (index > -1) {
    {
      const user = room.connections[index];
      user.updateData(parsedMessage);

      let messageAction = "";

      switch (parsedMessage.type) {
        case USER_READY:
          messageAction = "ready";
          if (room.isAllUsersReady()) room.startGame();
          break;
        case USER_SELECTED:
          messageAction = "selected";
          if (room.isAllUsersSelected()) room.finishGame();
          break;
        case TIE:
          room.resetUsers();
          room.startGame();
          break;
        case RESTART:
          messageAction = "restarted";
          room.resetUsers();
          room.prestartGame();
          break;
      }
      room.sendAll({
        type: parsedMessage.type,
        message: { name: user.data.name, action: messageAction },
        user: user.data,
      });
    }
  }
};

const onRequest = (request) => {
  const user = room.connectUser(request);

  user.connection.on("message", onMessage);
  user.connection.on("close", () =>
    room.disconnectUser(user.data.connectionID)
  );
};

socket.on("request", onRequest);
