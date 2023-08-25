import React from "react";
import { useSelector } from "react-redux";
import {
  GAME_FINISH,
  GAME_PRESTART,
  GAME_START,
  TIE,
  WAITING
} from "../../redux/gameSlice";
import FinishScreen from "../FinishScreen/FinishScreen";
import GameScreen from "../GameScreen/GameScreen";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import ReadyScreen from "../ReadyScreen/ReadyScreen";
import TieScreen from "../TieScreen/TieScreen";
import "./main.css";
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
