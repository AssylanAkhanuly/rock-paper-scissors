import React, { useEffect } from "react";
import { useConnection } from "../../common";
import { TIE } from "../../redux/gameSlice";
import "./tieScreen.css";

function TieScreen() {
  const { sendMessage } = useConnection();
  useEffect(() => {
    console.log("tie")
    const interval = setInterval(() => {
      sendMessage({
        type: TIE,
      });
    }, 3000);
    return () => clearInterval(interval);
  });
  return (
    <div className="tie-screen">
      <h1 className="tie-screen-center">Tie!</h1>
    </div>
  );
}

export default TieScreen;
