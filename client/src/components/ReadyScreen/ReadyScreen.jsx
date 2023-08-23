import React from "react";
import "./readyScreen.css";
import { USER_READY } from "../../redux/gameSlice";
import { useConnection } from "../../common";
function ReadyScreen() {
  const {sendMessage} = useConnection();
  return (
    <div className="ready">
      <div className="ready-content">
        <h1>Ready?</h1>
        <p>enter a username to join, or leave it blank to get a random one</p>
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
