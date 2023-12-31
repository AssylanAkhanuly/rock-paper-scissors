import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import {
  buttonClickEffect,
  buttonHoverEffect,
  useConnection,
} from "../../common";
import BlackList from "../BlackList/BlackList";
import History from "../History/History";
import "./header.css";
function Header() {
  const user = useSelector(({ game }) => game);
  const modalRef = useRef();
  const { closeConnection } = useConnection();
  const logout = () => {
    buttonClickEffect();
    closeConnection();
  };

  const toggleModal = () => {
    buttonClickEffect();
    modalRef.current.classList.toggle("active");
  };
  return (
    <div className="header">
      {user.isConnected ? (
        <button
          onClick={() => logout()}
          onPointerEnter={() => buttonHoverEffect()}
          className="leave-room"
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
          <div id="statistics">
            <div>wins / rounds</div>
            <div className="score">
              {user.score} / {user.history.length}
            </div>
          </div>
          <h1 className="statistics-main">
            {user.history.length
              ? Math.round((user.score / user.history.length) * 100)
              : 0}
            %
          </h1>
        </div>
      )}
      <div ref={modalRef} className="modal-outside">
        <div className="modal">
          <h2>{user.name}</h2>
          <div
            onClick={() => toggleModal()}
            onPointerEnter={() => buttonHoverEffect()}
            className="close-modal"
          >
            CLOSE
          </div>
          <Tabs>
            <TabList className="tabs-list">
              <Tab
                className="tab-header"
                selectedClassName="tab-header-selected"
              >
                History
              </Tab>
              <Tab
                className="tab-header"
                selectedClassName="tab-header-selected"
              >
                Black List
              </Tab>
            </TabList>

            <TabPanel>
              {" "}
              <History />
            </TabPanel>
            <TabPanel>
              <BlackList />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default Header;
