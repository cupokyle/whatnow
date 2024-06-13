import React from "react";
import Lottie from "lottie-react"; // Try this if the named import doesn't work
import animationData from "./loading-state.json";

function Loading() {
  if (!Lottie) {
    console.error("Lottie is not defined. Please check the import.");
    return null;
  }

  return <Lottie animationData={animationData} style={{ height: 100, width: 100 }} />;
}

export default Loading;
