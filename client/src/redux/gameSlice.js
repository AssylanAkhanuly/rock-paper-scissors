import { createSlice } from "@reduxjs/toolkit";
import { v4 } from "uuid";

//STATES
export const WAITING = "NO INGAME";
export const GAME_PRESTART = "GAME INSTART";
export const GAME_START = "GAME STARTED";
export const GAME_FINISH = "GAME OVER";


const INITIAL_STATE = {
  connectionID: v4(),
  name: "",
  isReady: false,
  score: 0,
  users: [],
  messages: [],
  state: WAITING,
};

//ACTIONS
export const DISCONNECTION = "DISCONNECTION";
export const SET_NAME = "SET_NAME";
export const CONNECTION = "CONNECTION";
export const USER_READY = "USER_READY";
export const USER_SELECTED = "USER_SELECTED";
export const gameSlice = createSlice({
  name: "game",
  initialState: INITIAL_STATE,
  reducers: {
    customUpdate: (state, action) => (state = { ...state, ...action.payload }),
    update: (state, action) => {
      const user = action.payload.user;
      if (user?.connectionID === state.connectionID) {
        state = {
          ...state,
          ...action.payload.user,
        };
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

export const { update, customUpdate } = gameSlice.actions;
export default gameSlice.reducer;
