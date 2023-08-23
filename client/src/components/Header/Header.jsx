import React from "react";
import {
  buttonClickEffect,
  buttonHoverEffect,
  useConnection,
} from "../../common";
import "./header.css";
import { useSelector } from "react-redux";
function Header() {
  const user = useSelector(({ game }) => game);
  const { closeConnection } = useConnection();
  const logout = () => {
    buttonClickEffect();
    closeConnection();
  };
  
  return (
    <div className="header">
      {user.isConnected && (
        <button
          onClick={() => logout()}
          onPointerEnter={() => buttonHoverEffect()}
          id="leaveroom"
        >
          EXIT
        </button>
      )}
      <h1 className="header-title">HOME</h1>
    </div>
  );
}

export default Header;
