import React, { useEffect, useState } from "react";
import "./finishScreen.css";
import { useDispatch, useSelector } from "react-redux";
import {
  buttonClickEffect,
  buttonHoverEffect,
  useConnection,
} from "../../common";
import {
  GAME_FINISH,
  RESTART,
  USER_LOST,
  USER_WIN,
  customUpdate,
} from "../../redux/gameSlice";

function FinishScreen() {
  const user = useSelector(({ game }) => game);
  const { sendMessage } = useConnection();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("user:", user)
    if (user.state === GAME_FINISH) {
      dispatch(
        customUpdate({
          history: [
            ...user.history,
            {
              opponents: user.users.filter(
                (opponent) => opponent.connectionID !== user.connectionID
              ),
              isWin: user.isWin,
            },
          ],
        })
      );
    }
  }, []);

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
          .map((user, index) => (
            <h1 key={index} className="win-name">
              {user.name}
            </h1>
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
