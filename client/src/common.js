import buttonHoverSound from "./assets/buttonHover.mp3";
import buttonClickSound from "./assets/buttonClick.mp3";
import backgroundMusic from "./assets/backgroundMusic.mp3";
import { useEffect, useState } from "react";
export const mainURL = "ws://localhost:8080/";
export const objToQueryString = (obj) => {
  return (
    "?" +
    Object.keys(obj)
      .map((key) => {
        return `${key}=${encodeURIComponent(obj[key])}`;
      })
      .join("&")
  );
};

export const buttonHoverEffect = (e) => {
  new Audio(buttonHoverSound).play();
};
export const buttonClickEffect = () => {
  new Audio(buttonClickSound).play();
};
export const startBackgroundMusic = () => {
  new Audio(backgroundMusic).play();
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
      countDownEffect(secondsLeft)
      setSecondsLeft(secondsLeft - 1)
    }, 1000);
    return () => clearTimeout(timeout);
  }, [secondsLeft]);
  function start(seconds) {
    setSecondsLeft(seconds);
  }

  return {start, secondsLeft}
}
