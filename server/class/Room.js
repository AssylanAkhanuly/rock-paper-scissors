import { copyObj, isOriginAllowed, whoWin } from "../utils/common.js";
import User from "./User.js";

//ACTIONS
export const DISCONNECTION = "DISCONNECTION";
export const CONNECTION = "CONNECTION";
export const USER_READY = "USER_READY";
export const USER_SELECTED = "USER_SELECTED";
export const USER_WIN = "WIN!";
export const USER_LOST = "YOU LOSE";
export const TIE = "TIE";
export const RESTART = "RESTART";

//STATES
const WAITING = "NO INGAME";
const GAME_PRESTART = "GAME INSTART";
const GAME_START = "GAME STARTED";
const GAME_FINISH = "GAME OVER";

export class Room {
  state = WAITING;
  maxUser = 2;
  connections = [];
  roomIndex;
  constructor(roomIndex) {
    this.roomIndex = roomIndex;
  }

  connectUser(request, connection) {
    const data = copyObj(request.resourceURL.query);
    if (this.isInBlackList(data)) return false;

    const newUser = this.pushUser({ connection, data });

    if (newUser) {
      this.sendAll({
        type: CONNECTION,
        message: { name: data.name, action: "joined" },
        user: newUser.data,
      });

      if (this.getAllUsers().length >= this.maxUser) this.prestartGame();
    }
    return newUser;
  }

  resetGame() {
    this.state = WAITING;
    this.sendAll({
      type: WAITING,
      message: { name: "GAME:", action: "searching for other players" },
    });
  }

  prestartGame() {
    this.state = GAME_PRESTART;
    this.sendAll({
      type: GAME_PRESTART,
      message: { name: "GAME:", action: "game will start soon" },
    });
  }

  disconnectUser(connectionID) {
    const user = this.getUser(connectionID);

    this.popUser(connectionID);
    this.sendAll({
      type: DISCONNECTION,
      message: {
        name: user.data.name,
        action: "disconnected",
      },
      users: this.getAllUsers(),
    });

    if (this.getAllUsers().length < this.maxUser) this.resetGame();
  }

  startGame() {
    this.state = GAME_START;
    this.sendAll({
      message: { name: "GAME:", action: "game is started" },
    });
  }

  finishGame() {
    this.state = GAME_FINISH;
    const { winners, loosers, isTie } = whoWin(this.connections);

    if (isTie) {
      this.state = TIE;
      this.sendAll({
        type: TIE,
        message: { name: "Game:", action: "Tie" },
      });
    } else {
      winners.map((winner) => winner.win());
      loosers.map((looser) => looser.loose());

      this.sendUsers(winners, {
        type: USER_WIN,
        message: { name: "GAME:", action: "YOU WIN" },
      });
      this.sendUsers(loosers, {
        type: USER_LOST,
        message: { name: "GAME:", action: "YOU LOST" },
      });
    }
  }

  pushUser(userData) {
    if (this.connections.length >= this.maxUser) return null;
    const newUser = new User({
      ...userData,
      data: {
        ...userData.data,
        roomIndex: this.roomIndex,
      },
    });
    this.connections.push(newUser);

    return newUser;
  }

  popUser(connectionID) {
    const userIndex = this.connections.findIndex(
      (connection) => connection.data.connectionID === connectionID
    );
    if (userIndex > -1) this.connections.splice(userIndex, 1);
  }

  getUser(connectionID) {
    const userIndex = this.connections.findIndex(
      (connection) => connection.data.connectionID === connectionID
    );
    if (userIndex > -1) return this.connections[userIndex];
    return null;
  }

  sendUsers(users, message) {
    users.map((user) =>
      user.sendMessage({
        ...message,
        users: this.getAllUsers(),
        state: this.state,
        user: user.data,
      })
    );
  }

  sendAll(message) {
    this.connections.map((user) =>
      user.sendMessage({
        ...message,
        users: this.getAllUsers(),
        state: this.state,
        user: user.getData(),
      })
    );
  }

  getAllUsers() {
    return this.connections.map((user) => user.data);
  }

  isAllUsersReady() {
    const nonReadyUser = this.connections.find((user) => !user.data.isReady);

    if (nonReadyUser) return false;
    return true;
  }

  isAllUsersSelected() {
    const nonSelectedUser = this.connections.find(
      (user) => user.data.type !== USER_SELECTED
    );

    if (nonSelectedUser) return false;
    return true;
  }

  resetUsers() {
    this.connections.map((user) => user.reset());
  }

  isInBlackList(newUser) {
    let inBlackList = false;

    for (let index = 0; index < this.connections.length; index++) {
      const user = this.connections[index];
      inBlackList = user.isInBlackList(newUser.connectionID);

      if (inBlackList) return true;
    }

    if (!newUser.blackList) return false;

    if (Array.isArray(newUser.blackList))
      inBlackList = this.connections.some((connection) =>
        newUser.blackList.includes(connection.data.connectionID)
      );
    if (inBlackList) return true;

    inBlackList = this.getUser(newUser.blackList);
    if (inBlackList) return true;
    return false;
  }
}
