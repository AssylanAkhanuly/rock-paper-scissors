import React from "react";
import "./finishScreen.css";
import { useSelector } from "react-redux";
import { buttonClickEffect, buttonHoverEffect } from "../../common";
import { RESTART } from "../../redux/gameSlice";

function FinishScreen({ sendMessage }) {
  const user = useSelector(({ game }) => game);

  const restart = () => {
    buttonClickEffect();

    sendMessage({
      type: RESTART,
    });
  };
  return (
    <div className="finish-screen">
      <h1 className="finish-screen-title">Winner!</h1>
      <div className="finish-screen-center">
        {user.users
          .filter((user) => user.isWin)
          .map((user) => (
            <h1 className="win-name">{user.name}</h1>
          ))}
      </div>
      <button
        onClick={() => restart()}
        onPointerEnter={() => buttonHoverEffect()}
        className="replay-button"
      >
        Replay
      </button>
    </div>
  );
}

export default FinishScreen;
