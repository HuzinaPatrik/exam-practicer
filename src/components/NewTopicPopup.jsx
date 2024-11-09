import React, { useState } from "react";
import classNames from "classnames";

const NewTopicPopup = ({
  onSave,
  onClose,
  header,
  input,
  button,
  buttonColor,
}) => {
  const [topicName, setTopicName] = useState("");

  const handleSave = () => {
    if (!input || topicName.trim()) {
      onSave(topicName);
      setTopicName(""); // Reset input field after saving
      onClose(); // Close popup
    }
  };

  const bgColor = buttonColor ? `bg-red` : "bg-green";
  const hoverColor = buttonColor
    ? `hover:bg-red-hover`
    : "hover:bg-green-hover";

  const buttonClasses = classNames(
    "w-full py-2 text-white rounded-lg transition-all duration-200 font-roboto",
    bgColor,
    hoverColor
  );

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-96">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red transition-all duration-200 hover:text-red-hover">
          X
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center text-black font-roboto">
          {header}
        </h2>
        {input && (
          <input
            type="text"
            placeholder="Téma neve"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            className="w-full p-2 border border-gray rounded mb-4 focus:outline-none focus:border-blue text-black font-roboto"
          />
        )}
        <button onClick={handleSave} className={buttonClasses}>
          {button}
        </button>
      </div>
    </div>
  );
};

export default NewTopicPopup;
