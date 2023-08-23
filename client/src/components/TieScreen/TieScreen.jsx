import React, { useEffect } from "react";
import "./tieScreen.css";
import { RESTART, TIE } from "../../redux/gameSlice";
import { useConnection } from "../../common";

function TieScreen() {
    const {sendMessage} = useConnection();
  useEffect(() => {
    const interval = setInterval(() => {
      sendMessage({
        type: TIE,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="tie-screen">
      <h1 className="tie-screen-center">Tie!</h1>
    </div>
  );
}

export default TieScreen;
