import React from "react";
import "./history.css";
import { useSelector } from "react-redux";
function History() {
  const user = useSelector(({ game }) => game);
  return (
    <div className="modal-list">
      {user.history.map((game, index) => (
        <div
          key={index}
          className={game.isWin ? "win-container" : "lost-container"}
        >
          <h1>{game.opponents.map((opponent) => opponent.name).join(", ")}</h1>
          <h1>{game.isWin ? "Win" : "Lost"}</h1>
        </div>
      ))}
      {!user.history.length && (
        <div className={"lost-container"}>History is empty</div>
      )}
    </div>
  );
}

export default History;
