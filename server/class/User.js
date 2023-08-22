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
    this.data = {
      ...this.data,
      ...newData,
    };
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
}
