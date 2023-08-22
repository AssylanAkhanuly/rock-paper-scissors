import React from "react";
import "./chat.css";
import { useSelector } from "react-redux";

function Chat() {
  const gameState = useSelector(({ game }) => game);
console.log(gameState.messages)
  return (
    <div className="chat active">
      <h1 className="chat-title">CHAT</h1>
      <p className="chat-desc">
        Welcome to Quick Play chat! Please remember to be civil to your
        opponents - chat is actively monitored.
      </p>

      <div className="chat-actions">
        {gameState.messages.map((message, index) => (
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
