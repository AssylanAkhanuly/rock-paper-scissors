import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { w3cwebsocket } from "websocket";
import { mainURL, objToQueryString } from "../../common";
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

  let client = useRef();
  const dispatch = useDispatch();

  const sendMessage = (message) => {
    const { messages, users, ...other } = user;
    const stringMessage = JSON.stringify({
      ...message,
      user: { ...other, ...message?.user },
    });
    client.current.send(stringMessage);
  };

  const onOpen = () => {
    console.log("Connection is established");
  };

  const onMessage = (message) => {
    const parsedMessage = JSON.parse(message.data);
    console.log(parsedMessage);
    dispatch(update(parsedMessage));
  };

  const onClose = () => {
    console.log("Connection is lost");
  };

  useEffect(() => {
    const { users, messages, ...other } = user;
    const query = objToQueryString(other);

    client.current = new w3cwebsocket(mainURL + query, "echo-protocol");

    client.current.onopen = onOpen;
    client.current.onmessage = onMessage;
    client.current.onclose = onClose;
  }, []);
  if (user.state === WAITING && user.name)
    return <LoadingScreen text={"Searching for other players..."} />;
  else if (user.state === GAME_PRESTART && !user.isReady)
    return <ReadyScreen sendMessage={sendMessage} />;
  else if (user.state === GAME_PRESTART && user.isReady)
    return <LoadingScreen text={"Waiting for other players..."} />;
  else if (user.state === GAME_START)
    return <GameScreen sendMessage={sendMessage} />;
  else if (user.state === TIE) return <TieScreen sendMessage={sendMessage} />;
  else if (user.state === GAME_FINISH)
    return <FinishScreen sendMessage={sendMessage} />;
}

export default Main;
