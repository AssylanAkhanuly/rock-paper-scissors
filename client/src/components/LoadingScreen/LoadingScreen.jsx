import React from "react";
import "./loadingScreen.css";
import Loader from "../Loader/Loader";
function LoadingScreen({ text }) {
  return (
    <div className="loading-screen">
      <Loader />
      <p className="loading-text">{text}</p>
    </div>
  );
}

export default LoadingScreen;
