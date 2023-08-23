import React, { useRef } from "react";
import {
  buttonClickEffect,
  buttonHoverEffect,
  useConnection,
} from "../../common";
import "./header.css";
import { useSelector } from "react-redux";
function Header() {
  const user = useSelector(({ game }) => game);
  const modalRef = useRef();
  const { closeConnection } = useConnection();
  const logout = () => {
    buttonClickEffect();
    closeConnection();
  };

  const toggleModal = () => {
    modalRef.current.classList.toggle("active");
  };
  return (
    <div className="header">
      {user.isConnected ? (
        <button
          onClick={() => logout()}
          onPointerEnter={() => buttonHoverEffect()}
          id="leaveroom"
        >
          EXIT
        </button>
      ) : (
        <h1 className="header-title">HOME</h1>
      )}
      {user.isConnected && (
        <div
          onPointerEnter={() => buttonHoverEffect()}
          onClick={() => toggleModal()}
          className="statistics-container"
        >
          <div id="me">
            <div id="me_username">wins / rounds</div>
            <div id="me_anon">
              {user.score} / {user.history.length}
            </div>
          </div>
          <h1 className="statistics-main">
            {user.history.length
              ? Math.round(user.score / user.history.length * 100)
              : 0}
            %
          </h1>
        </div>
      )}
      <div ref={modalRef} class="dialogs">
        <div class="oob_modal tetra_modal">
          <h2>History</h2>
          <div
            onClick={() => toggleModal()}
            class="tetra_modal_close ns"
            data-hover="tap"
            data-hit="click"
          >
            CLOSE
          </div>
          <div className="history-list">
            {user.history.map((game, index) => (
              <div
                key={index}
                class={game.isWin ? "tetra_modal_warning" : "tetra_modal_loss"}
              >
                <h1>
                  {game.opponents.map((opponent) => opponent.name).join(", ")}
                </h1>
                <h1>{game.isWin ? "Win" : "Lost"}</h1>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
