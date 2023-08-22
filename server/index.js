import http from "http";
import { server as WebSocketServer } from "websocket";
import { Room, USER_READY, USER_SELECTED } from "./class/Room.js";
import { tryParseMessage } from "./utils/common.js";

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
          break
        case USER_SELECTED:
          messageAction = "selected";
          if (room.isAllUsersSelected()) room.finishGame();
          break
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

  // const onClose = (e) => {};
};

socket.on("request", onRequest);
