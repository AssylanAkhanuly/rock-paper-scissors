import React, { useEffect, useRef } from "react";
import "./gameScreen.css";
import ScissorsAngryImg from "../../assets/scissors-angry.png";
import PaperAngryImg from "../../assets/paper-angry.jpg";
import RockAngryImg from "../../assets/rock-angry.jpg";
import { useState } from "react";
import { USER_SELECTED, customUpdate } from "../../redux/gameSlice";
import { useDispatch } from "react-redux";

const ROCK = 1;
const PAPER = 2;
const SCISSORS = 3;
function GameScreen({ sendMessage }) {
  const dispatch = useDispatch();
  const [selection, setSelection] = useState("");
  const [state, setState] = useState("start");
  const [startTimer, setStartTimer] = useState(5);
  const [finishTimer, setFinishTimer] = useState(5);
  const screenRef = useRef();
  let interval;

  useEffect(() => {
    if (startTimer > 0 && state === "start")
      interval = setTimeout(() => setStartTimer(startTimer - 1), 1000);
    else if (startTimer <= 0 && state === "start") {
      clearInterval(interval);
      screenRef.current.classList.add("active");
      setState("finish");
    } else if (finishTimer > 0 && state === "finish") {
      interval = setTimeout(() => setFinishTimer(finishTimer - 1), 1000);
    } else if (finishTimer <= 0 && state === "finish") {
      clearInterval(interval);
      setState("end");
    } else if (state === "end") {
      sendMessage({
        type: USER_SELECTED,
        selection,
      });
    }

    return () => clearInterval(interval);
  }, [startTimer, finishTimer, state]);

  const select = (option) => {
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
      <h1 className="timer">
        {startTimer
          ? `Game Starts In: ${startTimer}`
          : `Game Ends In: ${finishTimer}`}
      </h1>
      <div ref={screenRef} className="game-screen-content">
        <h1 className="game-screen-title">Select an option</h1>
        <div className="options">
          <div id={ROCK} className="option" onClick={() => select(ROCK)}>
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
          <div id={PAPER} className="option" onClick={() => select(PAPER)}>
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
