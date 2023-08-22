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

  constructor(maxUser) {
    this.maxUser = maxUser;
  }

  connectUser(request) {
    if (!isOriginAllowed(request.origin)) {
      request.reject();
      return;
    }

    const connection = request.accept("echo-protocol", request.origin);
    const data = copyObj(request.resourceURL.query);
    const newUser = this.pushUser({ connection, data });

    this.sendAll({
      type: CONNECTION,
      message: { name: data.name, action: "joined" },
      user: newUser.data,
    });

    if (this.getAllUsers().length >= this.maxUser) this.prestartGame();

    return newUser;
  }

  prestartGame() {
    this.state = GAME_PRESTART;
    this.sendAll({
      type: GAME_PRESTART,
      message: { name: "GAME:", action: "game will start soon" },
    });
  }

  disconnectUser(connectionID) {
    const index = this.getIndex(connectionID);
    const user = this.connections[index];

    this.popUser(connectionID);
    this.sendAll({
      type: DISCONNECTION,
      message: {
        name: user.data.name,
        action: "disconnected",
      },
      users: this.getAllUsers(),
    });
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
    console.log("tie", isTie);
    if (isTie) {
      this.state = TIE;
      this.sendAll({
        type: TIE,
        message: { name: "Game:", action: "Tie" },
      });
    } else {
      winners.map((user) => user.win());
      loosers.map((user) => user.loose());

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
    const newUser = new User({
      ...userData,
      inInWaitingList:
        this.state === GAME_PRESTART || this.state === GAME_START,
    });
    this.connections.push(newUser);

    return newUser;
  }

  popUser(connectionID) {
    const index = this.getIndex(connectionID);
    if (index > -1) this.connections.splice(index, 1);
  }

  getIndex(connectionID) {
    return this.connections.findIndex(
      (connection) => connection.data.connectionID === connectionID
    );
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
        user: user.data,
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
}
