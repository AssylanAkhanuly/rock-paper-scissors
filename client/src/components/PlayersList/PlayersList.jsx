import React from "react";
import "./playersList.css";
import { useSelector } from "react-redux";
import { buttonHoverEffect } from "../../common";
function PlayersList() {
  const gameState = useSelector(({ game }) => game);
  return (
    <div className="playersList">
      <h1 className="playersList-title">Players: {gameState.users.length}</h1>
      <ul className="player-list">
        {gameState.users.map((user, index) => (
          <li onPointerEnter={()=> buttonHoverEffect()} key={index} className="player-list-item">
            <div className="player-info">
              <h1 className="player-iter">{index+ 1}.</h1>
              <h1 className="player-name">{user.name}</h1>
            </div>

            <span className="player-score">{user.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlayersList;
