import React from "react";
import Lottie from "react-lottie";
import animationData from "./loading-state.json";

function Loading() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
    //   preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={defaultOptions} height="100px" width="100px" />;
}

export default Loading;