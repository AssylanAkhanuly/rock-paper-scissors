import http from "http";
import { server as WebSocketServer } from "websocket";
import { RESTART, Room, TIE, USER_READY, USER_SELECTED } from "./class/Room.js";
import {
  checkProtocol,
  isOriginAllowed,
  tryParseMessage,
} from "./utils/common.js";

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

const rooms = [];

const onMessage = (message) => {
  let parsedMessage = tryParseMessage(message);
  const room = rooms[parsedMessage.user.roomIndex];
  const user = room.getUser(parsedMessage.user.connectionID);
  if (user) {
    {
      user.updateData(parsedMessage);

      switch (parsedMessage.type) {
        case USER_READY:
          room.sendAll({
            type: parsedMessage.type,
            message: { name: user.data.name, action: "ready" },
            user: user.data,
          });
          if (room.isAllUsersReady()) room.startGame();
          break;
        case USER_SELECTED:
          room.sendAll({
            type: parsedMessage.type,
            message: { name: user.data.name, action: "selected" },
            user: user.data,
          });
          if (room.isAllUsersSelected()) room.finishGame();
          break;
        case TIE:
          room.resetUsers();
          room.startGame();
          break;
        case RESTART:
          room.resetUsers();
          room.prestartGame();
          room.sendAll({
            type: parsedMessage.type,
            message: { name: user.data.name, action: "restarted" },
            user: user.data,
          });
          break;
      }
    }
  }
};

const onRequest = (request) => {
  let user, roomIndex;

  const connection = checkProtocol(request);
  for (let index = 0; index < rooms.length; index++) {
    const room = rooms[index];
    user = room.connectUser(request, connection);
    if (user) {
      roomIndex = index;
      break;
    }
  }

  if (!user) {
    const newRoom = new Room(rooms.length);
    roomIndex = rooms.length;
    user = newRoom.connectUser(request, connection);
    rooms.push(newRoom);
  }

  user.connection.on("message", onMessage);
  user.connection.on("close", () => {
    rooms[roomIndex].disconnectUser(user.data.connectionID);
    if (!rooms[roomIndex].connections.length) rooms.splice(roomIndex, 1);
  });
};

socket.on("request", onRequest);
