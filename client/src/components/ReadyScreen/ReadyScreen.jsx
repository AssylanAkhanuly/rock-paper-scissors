import React from "react";
import "./readyScreen.css";
import { USER_READY } from "../../redux/gameSlice";
import { useConnection } from "../../common";
function ReadyScreen() {
  const {sendMessage} = useConnection();
  return (
    <div className="ready">
      <div className="ready-content">
        <h1 className="ready-title">Ready?</h1>
        <p>The game will start after all users are ready</p>
      </div>

      <button
        onClick={() =>
          sendMessage({
            type: USER_READY,
            isReady: true,
          })
        }
        className="submit-button"
      >
        Ready!
      </button>
    </div>
  );
}

export default ReadyScreen;
