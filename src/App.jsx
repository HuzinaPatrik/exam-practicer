import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Topic from "./components/TopicSelector";

function App() {
  return (
    <>
      <div className="fixed w-screen h-screen bg-main text-white flex items-center justify-center font-roboto">
        <div className="h-full border border-border" style={{ width: "12.5%" }}>
          <Topic />
        </div>
        <div
          className="h-full border border-border bg-secondary"
          style={{ width: "87.5%" }}></div>
      </div>
    </>
  );
}

export default App;
