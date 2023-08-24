import React from "react";
import "./footer.css";
import { useSelector } from "react-redux";
function Footer() {
  const user = useSelector(({ game }) => game);
  return (
    <div className="footer">
      <div id="room_switchbracket">
        {user.name}
        <div id="swb_addendum">exit to change your name</div>
      </div>
      <div id="room_ingame_warning">
        {user.state}
        <br />
        <div id="igw_addendum">
          <div id="igw_spectate" >
            ROOM NUmber: {user.roomIndex}
          </div>
        </div>
      </div>

      <h1 className="footer-text">Welcome to platform</h1>
    </div>
  );
}

export default Footer;
