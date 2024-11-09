import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Topic from "./components/TopicSelector";
import Question from "./components/QuestionSelector";

function App() {
  const [selectedTopic, setSelectedTopic] = useState(null);

  return (
    <>
      <div className="fixed w-screen h-screen bg-main text-white flex items-center justify-center font-roboto">
        <div className="h-full border border-border" style={{ width: "12.5%" }}>
          <Topic
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopic}
          />
        </div>
        <div
          className="h-full border border-border bg-secondary"
          style={{ width: "87.5%" }}>
          <Question selectedTopic={selectedTopic} />
        </div>
      </div>
    </>
  );
}

export default App;
