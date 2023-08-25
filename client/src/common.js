import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { w3cwebsocket } from "websocket";
import buttonClickSound from "./assets/buttonClick.mp3";
import buttonHoverSound from "./assets/buttonHover.mp3";
import messageSound from "./assets/messageSound.mp3";
import { clear, customUpdate, update } from "./redux/gameSlice";

export const mainURL = "ws://localhost:8080/";
export const objToQueryString = (obj) => {
  return (
    "?" +
    Object.keys(obj)
      .map((key) => {
        if (Array.isArray(obj[key]))
          return obj[key]
            .map((el) => `${key}=${encodeURIComponent(el.connectionID)}`)
            .join("&");
        return `${key}=${encodeURIComponent(obj[key])}`;
      })
      .join("&")
  );
};

export const buttonHoverEffect = (e) => {
  try {
    new Audio(buttonHoverSound).play();
  } catch (e) {
    console.log(e);
  }
};
export const buttonClickEffect = () => {
  new Audio(buttonClickSound).play();
};


export const messageSoundEffect = () => {
  try {
    new Audio(messageSound).play();
  } catch (e) {
    console.log(e);
  }
};

export const countDownEffect = (tick) => {
  try {
    const sound = require(`./assets/${tick}.mp3`);
    new Audio(sound).play();
  } catch (e) {}
};
export function useCountDown(deafultSecond) {
  const [secondsLeft, setSecondsLeft] = useState(deafultSecond);

  useEffect(() => {
    if (secondsLeft < 0) return;

    const timeout = setTimeout(() => {
      countDownEffect(secondsLeft);
      setSecondsLeft(secondsLeft - 1);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [secondsLeft]);
  function start(seconds) {
    setSecondsLeft(seconds);
  }

  return { start, secondsLeft };
}

let connection;

export function useConnection() {
  const user = useSelector(({ game }) => game);
  const dispatch = useDispatch();

  const sendMessage = (message) => {
    const { messages, users, history, blackList, ...other } = user;
    const stringMessage = JSON.stringify({
      ...message,
      user: { ...other, ...message?.user },
    });
    connection.send(stringMessage);
  };

  const closeConnection = () => {
    connection.close();
    dispatch(clear());
  };

  const onOpen = () => {
    console.log("Connection is established");
  };

  const onMessage = useCallback(
    (message) => {
      const parsedMessage = JSON.parse(message.data);
      dispatch(update(parsedMessage));
    },
    [dispatch]
  );

  const onClose = () => {
    console.log("Connection is lost");
    connection = null;
  };

  useEffect(() => {
    if (!connection && user.isConnected) {
      const { users, messages, history, ...other } = user;
      const query = objToQueryString(other);

      console.log("query:", query);
      connection = new w3cwebsocket(mainURL + query, "echo-protocol");

      connection.onopen = onOpen;
      connection.onmessage = onMessage;
      connection.onclose = onClose;
    }
  }, [user, onMessage]);

  return { sendMessage, closeConnection };
}

export const saveUser = (user) => {
  const { connectionID, name, score, history, blackList } = user;

  sessionStorage.setItem("connectionID", connectionID);
  sessionStorage.setItem("name", name);
  sessionStorage.setItem("score", score);
  sessionStorage.setItem("history", JSON.stringify(history));
  sessionStorage.setItem("blackList", JSON.stringify(blackList));
};

export function useBlackList() {
  const user = useSelector(({ game }) => game);
  const dispatch = useDispatch();
  const isInBlackList = (checkUser) => {
    const foundUser = user.blackList.find(
      (blackUser) => blackUser.connectionID === checkUser.connectionID
    );
    if (foundUser) return true;
    return false;
  };
  const pushBlackList = (blackUser) => {
    dispatch(
      customUpdate({
        blackList: [...user.blackList, blackUser],
      })
    );
  };

  const popBlackList = (whiteUser) => {
    const removedArr = user.blackList.filter(
      (blackUser) => blackUser.connectionID !== whiteUser.connectionID
    );
    dispatch(customUpdate({ blackList: removedArr }));
  };

  return {
    isInBlackList,
    popBlackList,
    pushBlackList,
  };
}
