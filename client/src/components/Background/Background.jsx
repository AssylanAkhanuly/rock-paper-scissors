import React, { useEffect, useRef } from "react";
import "./background.css";
function Background({ children }) {
  const light = useRef();
  const grid = useRef();
  useEffect(() => {
    grid.current.addEventListener("mousemove", (e) => {
      light.current.style.left = `${e.clientX}px`;
      light.current.style.top = `${e.clientY}px`;
    });
  }, []);
  return (
    <div className="background-container">
      <div ref={grid} className="hex-grid">
        <div ref={light} className="light"></div>
        <div className="grid"></div>
        {children}
      </div>
    </div>
  );
}

export default Background;
