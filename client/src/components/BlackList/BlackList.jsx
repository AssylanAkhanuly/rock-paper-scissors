import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./blackList.css";
import { customUpdate } from "../../redux/gameSlice";
import { useBlackList } from "../../common";
function BlackList() {
  const user = useSelector(({ game }) => game);
  const dispatch = useDispatch();

  const {popBlackList} = useBlackList();
  return (
    <div className="modal-list">
      {user.blackList.map((user, index) => (
        <div key={index} className="black-list-container">
          <h1>{user.name}</h1>
          <button onClick={() => popBlackList(user)} className="remove">
            Remove
          </button>
        </div>
      ))}
      {!user.blackList.length && (
        <div className={"lost-container"}>List is empty</div>
      )}
    </div>
  );
}

export default BlackList;
