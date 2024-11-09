import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExport,
  faFileImport,
  faPencil,
  faPlay,
  faPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import NewTopicPopup from "./NewTopicPopup";
import { Tooltip as ReactTooltip } from "react-tooltip";

const QuestionSelector = ({ selectedTopic }) => {
  const [questions, setQuestions] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  useEffect(() => {
    const savedQuestions = localStorage.getItem("questions" + selectedTopic);
    setQuestions(savedQuestions ? JSON.parse(savedQuestions) : []);
  }, [selectedTopic]);

  useEffect(() => {
    localStorage.setItem(
      "questions" + selectedTopic,
      JSON.stringify(questions)
    );
  }, [questions, selectedTopic]);

  const createNewQuestion = () => {
    const questionWithId = {
      id: Date.now(),
      text: "Változasd meg.",
      answers: [],
    };

    setQuestions((prevQuestions) => [...prevQuestions, questionWithId]);
  };

  const editQuestion = (id) => {
    const index = questions.findIndex((question) => question.id === id);

    if (index !== -1) {
      setIsPopupOpen(true);
      setSelectedQuestion(id);
    }
  };

  const exportQuestions = () => {
    const data = new Blob([JSON.stringify(questions)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `questions-${selectedTopic}-${new Date()
      .toISOString()
      .replace(/:/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importQuestions = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = JSON.parse(e.target.result);
        setQuestions(content);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleDeleteQuestion = (id) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((question) => question.id !== id)
    );
    setIsDeletePopupOpen(false);
  };

  return (
    <div className="w-full h-full">
      {selectedTopic ? (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div
            className="w-full border-b border-border flex items-center justify-center bg-main"
            style={{ height: "7.5%" }}>
            <div className="flex-1 text-2xl font-roboto ml-6 font-bold">
              Kérdések
            </div>
            <div className="flex-1 text-2xl font-roboto flex justify-end mr-6 gap-4">
              <FontAwesomeIcon
                data-tooltip-id="tooltip-export"
                icon={faFileExport}
                className="text-white transition-all duration-200 hover:text-yellow cursor-pointer"
                onClick={() => exportQuestions()}
              />

              <FontAwesomeIcon
                data-tooltip-id="tooltip-import"
                icon={faFileImport}
                className="text-white transition-all duration-200 hover:text-blue cursor-pointer"
                onClick={() => importQuestions()}
              />
            </div>
          </div>
          <div
            className="w-full h-full p-4 flex flex-col"
            style={{ height: "92.5%" }}>
            <div className="flex-auto w-full overflow-auto gap-2 flex flex-col max-h-fit">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="w-full px-4 py-2 min-h-fit flex items-center justify-start px-4 border border-border bg-main text-white font-roboto">
                  {question.text}
                  <FontAwesomeIcon
                    icon={faPencil}
                    className="ml-2 text-white opacity-20 cursor-pointer transition-all duration-200 hover:text-blue hover:opacity-100"
                    onClick={() => editQuestion(question.id)}
                  />

                  <FontAwesomeIcon
                    icon={faXmark}
                    className="ml-auto text-white opacity-20 cursor-pointer transition-all duration-200 hover:text-red hover:opacity-100"
                    onClick={() => {
                      setIsDeletePopupOpen(true);
                      setSelectedQuestion(question.id);
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="w-full">
              <div
                className="w-full mt-2 px-4 py-2 min-h-fit flex items-center justify-center px-4 border border-border bg-green text-white font-roboto transition-all duration-200 hover:bg-green-hover cursor-pointer hover:text-black"
                onClick={() => createNewQuestion()}>
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Új kérdés hozzáadása
              </div>
            </div>

            {questions.length > 0 && (
              <div className="w-full px-4 py-2 min-h-fit flex items-center justify-center px-4 border border-border bg-orange text-white font-roboto transition-all duration-200 hover:bg-orange-hover cursor-pointer hover:text-black">
                <FontAwesomeIcon icon={faPlay} className="mr-2" />
                Teszt indítása
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center animate-pulse text-2xl text-red font-roboto">
          Válassz egy témát!
        </div>
      )}

      {isPopupOpen && (
        <NewTopicPopup
          header="Kérdés szerkesztése"
          placeholder="Kérdés szövege"
          defaultName={
            questions.find((question) => question.id === selectedQuestion).text
          }
          input={true}
          button="Mentés"
          onSave={(newQuestion) => {
            const index = questions.findIndex(
              (question) => question.id === selectedQuestion
            );

            if (index !== -1) {
              const updatedQuestions = [...questions];
              updatedQuestions[index].text = newQuestion;

              setQuestions(updatedQuestions);
            }
          }}
          onClose={() => setIsPopupOpen(false)}
        />
      )}

      {isDeletePopupOpen && (
        <NewTopicPopup
          header="Biztosan törölni szeretnéd?"
          button="Törlés"
          buttonColor="red"
          onSave={() => handleDeleteQuestion(selectedQuestion)}
          onClose={() => setIsDeletePopupOpen(false)}
        />
      )}

      {/* Initialize Tooltip */}
      <ReactTooltip
        id="tooltip-export"
        place="bottom"
        content="Kérdések exportálása"
      />

      <ReactTooltip
        id="tooltip-import"
        place="bottom"
        content="Kérdések importálása"
      />
    </div>
  );
};

export default QuestionSelector;
