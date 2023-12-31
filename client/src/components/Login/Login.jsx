import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { buttonClickEffect, startBackgroundMusic } from "../../common";
import { customUpdate } from "../../redux/gameSlice";
import "./login.css";
function Login() {
  const user = useSelector(({ game }) => game);
  const [name, setName] = useState(user.name);
  const dispatch = useDispatch();

  const handleEnter = () => {
    buttonClickEffect();

    let newName = name;
    if (!newName) newName = "User" + Math.floor(Math.random() * 100);
    dispatch(customUpdate({ name: newName, isConnected: true }));
  };

  return (
    <div className="login">
      <div className="login-content">
        <h1 className="login-title">Welcome to ROCK-SCISSOR-PAPER</h1>
        <p>
          puzzle together in this modern yet familiar online stacker. play
          against friends and foes all over the world, or claim a spot on the
          leaderboards - the stacker future is yours!
        </p>
      </div>
      <hr />
      <div className="login-content">
        <p>enter a username to join, or leave it blank to get a random one</p>
        <input
          placeholder="USERNAME"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
        />
      </div>
      <button onClick={() => handleEnter()} className="submit-button">
        Join
      </button>
    </div>
  );
}

export default Login;
