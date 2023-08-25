import React from "react";
import Loader from "../Loader/Loader";
import "./loadingScreen.css";
function LoadingScreen({ text }) {
  return (
    <div className="loading-screen">
      <Loader />
      <p className="loading-text">{text}</p>
    </div>
  );
}

export default LoadingScreen;
