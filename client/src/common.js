import buttonHoverSound from "./assets/buttonHover.mp3";
import buttonClickSound from "./assets/buttonClick.mp3";
import backgroundMusic from "./assets/backgroundMusic.mp3";
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

const ROCK = 1;
const PAPER = 2;
const SCISSORS = 3;

