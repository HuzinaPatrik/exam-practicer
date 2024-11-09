import React, { useState, useEffect } from "react";
import NewTopicPopup from "./NewTopicPopup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const TopicSelector = ({ selectedTopic, setSelectedTopic }) => {
  const [topics, setTopics] = useState(() => {
    const savedTopics = localStorage.getItem("topics");
    return savedTopics ? JSON.parse(savedTopics) : [];
  });

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("topics", JSON.stringify(topics));
  }, [topics]);

  const handleSaveNewTopic = (newTopic) => {
    const topicWithId = { id: Date.now(), text: newTopic }; // Add unique ID
    setTopics((prevTopics) => [...prevTopics, topicWithId]);
  };

  const handleDeleteTopic = (id) => {
    setTopics((prevTopics) => prevTopics.filter((topic) => topic.id !== id));
    setIsDeletePopupOpen(false);
  };

  const confirmDelete = (id) => {
    setDeleteIndex(id);
    setIsDeletePopupOpen(true);
  };

  const saveTopic = () => {
    const data = new Blob([JSON.stringify(topics)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `topics-${new Date().toISOString().replace(/:/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadTopic = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = JSON.parse(e.target.result);
        setTopics(content);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="w-full max-h-5/6 flex flex-col gap-2 items-center mt-2">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className={`w-5/6 px-4 h-12 flex items-center justify-center border ${
              topic.id === selectedTopic ? "text-black" : "text-white"
            } border-border cursor-pointer bg-green transition-all duration-200 bg-green-hover hover:text-black font-roboto`}
            onClick={() => {
              if (selectedTopic === topic.id) setSelectedTopic(null);
              else setSelectedTopic(topic.id);
            }}>
            {topic.text}
            <FontAwesomeIcon
              icon={faTrash}
              className="cursor-pointer ml-2 text-inherit hover:text-red"
              onClick={() => confirmDelete(topic.id)}
            />
          </div>
        ))}
      </div>
      <div className="w-full max-h-1/6 flex items-center justify-center border-t border-border flex-col gap-2">
        <div
          className="px-4 py-2 first:mt-2 bg-green text-white rounded-lg cursor-pointer transition-all duration-200 hover:text-black hover:bg-green-hover font-roboto"
          onClick={() => setIsPopupOpen(true)}>
          Új téma rögzítése
        </div>

        <div
          className="px-4 py-2 bg-blue text-white rounded-lg cursor-pointer transition-all duration-200 hover:text-black hover:bg-blue-hover font-roboto"
          onClick={saveTopic}>
          Témák mentése
        </div>

        <div
          className="px-4 py-2 bg-orange text-white rounded-lg cursor-pointer transition-all duration-200 hover:text-black hover:bg-orange-hover font-roboto"
          onClick={loadTopic}>
          Témák betöltése
        </div>
      </div>
      {isPopupOpen && (
        <NewTopicPopup
          header="Új téma rögzítése"
          input={true}
          button="Mentés"
          onSave={handleSaveNewTopic}
          onClose={() => setIsPopupOpen(false)}
        />
      )}

      {isDeletePopupOpen && (
        <NewTopicPopup
          header="Biztosan törölni szeretnéd?"
          button="Törlés"
          buttonColor="red"
          onSave={() => handleDeleteTopic(deleteIndex)}
          onClose={() => setIsDeletePopupOpen(false)}
        />
      )}
    </div>
  );
};

export default TopicSelector;
