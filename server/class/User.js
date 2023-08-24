import { isJsonString } from "../utils/common.js";

export default class User {
  connection = null;
  data = null;

  constructor({ connection, data }) {
    const { score } = data;

    this.connection = connection;
    this.data = { ...data, isReady: false, score: parseInt(score) };
  }
  sendMessage(message) {
    let stringMessage = message;
    if (!isJsonString(message)) stringMessage = JSON.stringify(message);

    this.connection.sendUTF(stringMessage);
  }
  updateData(newData) {
    const { user, ...other } = newData;
    this.data = {
      ...this.data,
      ...other,
    };
  }

  getData() {
    const { blackList, ...other } = this.data;
    return other;
  }

  isInBlackList(connectionID) {
    if (!this.data.blackList) return false;

    if (Array.isArray(this.data.blackList))
      return this.data.blackList.includes(connectionID);
    return this.data.blackList === connectionID;
  }

  sendAll(message) {
    this.connections.map((connection) => connection.sendMessage(message));
  }

  win() {
    this.data.score += 1;
    this.data.isWin = true;
  }

  loose() {
    this.data.isWin = false;
  }
  reset() {
    this.data = {
      ...this.data,
      isWin: null,
      isReady: false,
      selection: null,
    };
  }
}
