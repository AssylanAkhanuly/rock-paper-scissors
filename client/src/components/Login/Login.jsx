import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { buttonClickEffect, startBackgroundMusic } from "../../common";
import { SET_NAME, customUpdate, update } from "../../redux/gameSlice";
import "./login.css";
function Login({ user, setUser }) {
  const [name, setName] = useState("");
  const dispatch = useDispatch();

  const handleEnter = () => {
    // startBackgroundMusic();
    buttonClickEffect();

    let newName = name;
    if (!newName) newName = "User" + Math.floor(Math.random() * 100);
    dispatch(customUpdate({ name: newName }));
  };

  return (
    <div className="login">
      <div className="login-content">
        <h1>Welcome to ROCK-SCISSOR-PAPER</h1>
        <p>
          puzzle together in this modern yet familiar online stacker. play
          against
          <br />
          friends and foes all over the world, or claim a spot on the
          <br />
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
