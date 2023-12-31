import React, { useEffect, useRef, useState } from "react";
import PaperAngryImg from "../../assets/paper-angry.jpg";
import RockAngryImg from "../../assets/rock-angry.jpg";
import ScissorsAngryImg from "../../assets/scissors-angry.png";
import {
  buttonClickEffect,
  buttonHoverEffect,
  useConnection,
  useCountDown
} from "../../common";
import { USER_SELECTED } from "../../redux/gameSlice";
import "./gameScreen.css";

const ROCK = 1;
const PAPER = 2;
const SCISSORS = 3;
function GameScreen() {
  const [selection, setSelection] = useState(0);
  const [state, setState] = useState("start");
  const screenRef = useRef();
  const { sendMessage } = useConnection();
  const { secondsLeft, start } = useCountDown(5);

  useEffect(() => {
    if (secondsLeft < 0) {
      if (state === "start") {
        screenRef.current.classList.add("active");
        setState("finish");
        start(5);
      } else if (state === "finish") {
        sendMessage({
          type: USER_SELECTED,
          selection,
        });
      }
    }
  }, [secondsLeft]);

  const select = (option) => {
    buttonClickEffect();
    if (selection) {
      const element = document.getElementById(selection);
      element.classList.remove("active");
    }
    setSelection(option);
    const newElement = document.getElementById(option);
    newElement.classList.add("active");
  };

  return (
    <div className="game-screen">
      {secondsLeft >= 0 && (
        <h1 className={state === "start" ? "start-timer" : "finish-timer"}>
          {state === "start" ? secondsLeft : `Game finished in: ${secondsLeft}`}
        </h1>
      )}
      <div ref={screenRef} className="game-screen-content">
        <h1 className="game-screen-title">Select an option</h1>
        <div className="options">
          <div
            onPointerEnter={() => buttonHoverEffect()}
            id={ROCK}
            className="option"
            onClick={() => select(ROCK)}
          >
            <img
              width={150}
              height={150}
              src={RockAngryImg}
              alt="rock"
              className="option-img"
            />
            <hr />
            <h2 className="option-desc">Rock</h2>
          </div>
          <div
            onPointerEnter={() => buttonHoverEffect()}
            id={SCISSORS}
            className="option"
            onClick={() => select(SCISSORS)}
          >
            <img
              width={150}
              height={150}
              src={ScissorsAngryImg}
              alt="rock"
              className="option-img"
            />

            <hr />

            <h2 className="option-desc">Scissors</h2>
          </div>
          <div
            onPointerEnter={() => buttonHoverEffect()}
            id={PAPER}
            className="option"
            onClick={() => select(PAPER)}
          >
            <img
              width={150}
              height={150}
              src={PaperAngryImg}
              alt="rock"
              className="option-img"
            />
            <hr />

            <h2 className="option-desc">Paper</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameScreen;
