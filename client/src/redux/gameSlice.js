import { createSlice } from "@reduxjs/toolkit";
import { v4 } from "uuid";
import { saveUser } from "../common";

export const tryParse = (string) => {
  let parsedMessage = string;
  if (isJsonString(string)) parsedMessage = JSON.parse(string);

  return parsedMessage;
};

export const isJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

//STATES
export const WAITING = "NO INGAME";
export const GAME_PRESTART = "GAME INSTART";
export const GAME_START = "GAME STARTED";
export const GAME_FINISH = "GAME OVER";
export const TIE = "TIE";

const INITIAL_STATE = {
  connectionID: sessionStorage.getItem("connectionID") || v4(),
  name: sessionStorage.getItem("name") || "",
  isConnected: false,
  isReady: false,
  score: parseInt(sessionStorage.getItem("score")) || 0,
  users: [],
  messages: [],
  history: JSON.parse(sessionStorage.getItem("history")) || [],
  state: WAITING,
};

//ACTIONS
export const DISCONNECTION = "DISCONNECTION";
export const SET_NAME = "SET_NAME";
export const CONNECTION = "CONNECTION";
export const USER_READY = "USER_READY";
export const USER_SELECTED = "USER_SELECTED";
export const RESTART = "RESTART";
export const USER_WIN = "WIN!";
export const USER_LOST = "YOU LOSE";

export const gameSlice = createSlice({
  name: "game",
  initialState: INITIAL_STATE,
  reducers: {
    clear: (state, action) =>
      (state = {
        ...INITIAL_STATE,
        name: sessionStorage.getItem("name") || "",
        score: parseInt(sessionStorage.getItem("score")) || 0,
        history: JSON.parse(sessionStorage.getItem("history")) || [],
      }),
    customUpdate: (state, action) => {
      console.log(action.payload);
      return (state = { ...state, ...action.payload });
    },
    update: (state, action) => {
      const user = action.payload.user;

      if (user?.connectionID === state.connectionID) {
        state = {
          ...state,
          ...user,
        };
        saveUser(state);
      }
      return (state = {
        ...state,
        users: action.payload.users,
        messages: [...state.messages, action.payload.message],
        state: action.payload.state,
      });
    },
  },
});

export const { update, customUpdate, clear } = gameSlice.actions;
export default gameSlice.reducer;
