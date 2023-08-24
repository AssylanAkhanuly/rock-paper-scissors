import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { buttonHoverEffect, useBlackList } from "../../common";
import { customUpdate } from "../../redux/gameSlice";
import "./playersList.css";
function PlayersList() {
  const user = useSelector(({ game }) => game);
  const dispatch = useDispatch();
  const { pushBlackList, popBlackList, isInBlackList } = useBlackList();

  const handleClickPlayerItem = (user) => {
    if (isInBlackList(user)) popBlackList(user);
    else pushBlackList(user);
  };
  return (
    <div className="playersList">
      <h1 className="playersList-title">
        Opponents: {user.users.length ? user.users.length - 1 : 0}
      </h1>
      <ul className="player-list">
        {user.users
          .filter((opponent) => opponent.connectionID !== user.connectionID)
          .map((user, index) => (
            <li
              onClick={() => handleClickPlayerItem(user)}
              onPointerEnter={() => buttonHoverEffect()}
              key={index}
              className={
                isInBlackList(user)
                  ? "player-list-item player-black-list"
                  : "player-list-item"
              }
            >
              <h1 className="add-black-list">ADD </h1>
              <h1 className="remove-black-list">remove </h1>
              <div className="player-info">
                <h1 className="player-iter">{index + 1}.</h1>
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
