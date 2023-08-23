import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mainURL, objToQueryString, useConnection } from "../../common";
import {
  GAME_FINISH,
  GAME_PRESTART,
  GAME_START,
  TIE,
  WAITING,
  update,
} from "../../redux/gameSlice";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import "./main.css";
import ReadyScreen from "../ReadyScreen/ReadyScreen";
import GameScreen from "../GameScreen/GameScreen";
import FinishScreen from "../FinishScreen/FinishScreen";
import TieScreen from "../TieScreen/TieScreen";
function Main() {
  const user = useSelector(({ game }) => game);

  if (user.state === WAITING && user.isConnected)
    return <LoadingScreen text={"Searching for other players..."} />;
  else if (user.state === GAME_PRESTART && !user.isReady)
    return <ReadyScreen />;
  else if (user.state === GAME_PRESTART && user.isReady)
    return <LoadingScreen text={"Waiting for other players..."} />;
  else if (user.state === GAME_START) return <GameScreen />;
  else if (user.state === TIE) return <TieScreen />;
  else if (user.state === GAME_FINISH) return <FinishScreen />;
}

export default Main;
