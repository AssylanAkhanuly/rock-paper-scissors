import React, { useEffect } from "react";
import "./chat.css";
import { useSelector } from "react-redux";
import { messageSoundEffect } from "../../common";

function Chat() {
  const user = useSelector(({ game }) => game);
  useEffect(() => {
  }, [user]);
  return (
    <div className="chat active">
      <h1 className="chat-title">CHAT</h1>
      <p className="chat-desc">
        Welcome to Quick Play chat! You can view here all the actions happening
        in the game.
      </p>

      <div className="chat-actions">
        {user.messages.map((message, index) => (
          <div key={index} className="chat-action">
            <p className="chat-action-user">{message.name}</p>
            <p className="chat-action-event">{message.action}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chat;
