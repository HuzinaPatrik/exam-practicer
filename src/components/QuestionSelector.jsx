import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleDown,
  faArrowAltCircleRight,
  faArrowRight,
  faFileExport,
  faFileImport,
  faPencil,
  faPlay,
  faPlus,
  faXmark,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import NewTopicPopup from "./NewTopicPopup";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Test from "./Test";

const QuestionSelector = ({ selectedTopic }) => {
  const [questions, setQuestions] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerPopupOpen, setIsAnswerPopupOpen] = useState(false);
  const [isTestStarted, setIsTestStarted] = useState(false);

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

  const createNewAnswer = (questionIndex) => {
    const answerWithId = {
      text: "Változasd meg.",
      correct: false,
    };

    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers.push(answerWithId);
    setQuestions(updatedQuestions);
  };

  const editAnswer = (questionIndex, answerIndex) => {
    setIsAnswerPopupOpen(true);
    setSelectedAnswer({
      questionIndex,
      answerIndex,
    });
  };

  const startTest = () => {
    setIsTestStarted(true);
  };

  return (
    <>
      <div className="w-full h-full">
        {selectedTopic ? (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div
              className="flex items-center justify-center w-full border-b border-border bg-main"
              style={{ height: "7.5%" }}>
              <div className="flex-1 ml-6 text-2xl font-bold font-roboto">
                Kérdések ({questions.length} db)
              </div>
              <div className="flex justify-end flex-1 gap-4 mr-6 text-2xl font-roboto">
                <FontAwesomeIcon
                  data-tooltip-id="tooltip-export"
                  icon={faFileExport}
                  className="text-white transition-all duration-200 cursor-pointer hover:text-yellow"
                  onClick={() => exportQuestions()}
                />

                <FontAwesomeIcon
                  data-tooltip-id="tooltip-import"
                  icon={faFileImport}
                  className="text-white transition-all duration-200 cursor-pointer hover:text-blue"
                  onClick={() => importQuestions()}
                />
              </div>
            </div>
            <div
              className="flex flex-col w-full h-full p-4"
              style={{ height: "92.5%" }}>
              <div className="flex flex-col flex-auto w-full gap-2 overflow-auto max-h-fit">
                {questions.map((question, questionIndex) => (
                  <div
                    key={question.id}
                    className="flex flex-col w-full px-4 py-2 text-white border min-h-fit border-border bg-main font-roboto">
                    <div className="flex items-center justify-start w-full h-fit">
                      <FontAwesomeIcon
                        icon={faArrowAltCircleRight}
                        className={`mr-2 cursor-pointer ${
                          question.opened
                            ? "rotate-90 text-orange opacity-100"
                            : "text-white opacity-20 rotate-0"
                        } transition-all duration-200 hover:text-orange hover:opacity-100 hover:rotate-90`}
                        onClick={() => {
                          const updatedQuestions = [...questions];
                          updatedQuestions[questionIndex].opened =
                            !question.opened;
                          setQuestions(updatedQuestions);
                        }}
                      />

                      {question.text}

                      <FontAwesomeIcon
                        icon={faPencil}
                        className="ml-2 text-white transition-all duration-200 cursor-pointer opacity-20 hover:text-blue hover:opacity-100"
                        onClick={() => editQuestion(question.id)}
                      />

                      <FontAwesomeIcon
                        icon={faXmark}
                        className="ml-auto text-white transition-all duration-200 cursor-pointer opacity-20 hover:text-red hover:opacity-100"
                        onClick={() => {
                          setIsDeletePopupOpen(true);
                          setSelectedQuestion(question.id);
                        }}
                      />

                      <FontAwesomeIcon
                        icon={faCopy}
                        className="ml-2 text-white transition-all duration-200 cursor-pointer opacity-20 hover:text-blue hover:opacity-100"
                        onClick={() => {
                          const updatedQuestions = [...questions];
                          updatedQuestions.push({
                            id: Date.now(),
                            text: question.text,
                            answers: question.answers.map((answer) => ({
                              text: answer.text,
                              correct: answer.correct,
                            })),
                          });
                          setQuestions(updatedQuestions);
                        }}
                      />
                    </div>

                    {question.opened && (
                      <div className="flex flex-col items-start w-full gap-2 px-4 py-2 mt-2 text-white border min-h-fit border-border bg-main font-roboto">
                        {question.answers.map((answer, answerIndex) => (
                          <div
                            key={answerIndex}
                            className="flex items-center justify-start w-full px-4 py-2 text-white border min-h-fit border-border bg-main font-roboto">
                            <input
                              type="checkbox"
                              className="mr-2"
                              checked={answer.correct}
                              onChange={(e) => {
                                const updatedQuestions = [...questions];
                                updatedQuestions[questionIndex].answers[
                                  answerIndex
                                ].correct = e.target.checked;
                                setQuestions(updatedQuestions);
                              }}
                            />
                            {answer.text}
                            {answer.correct && (
                              <span className="ml-2 text-green">(Helyes)</span>
                            )}

                            <FontAwesomeIcon
                              icon={faPencil}
                              className="ml-2 text-white transition-all duration-200 cursor-pointer opacity-20 hover:text-blue hover:opacity-100"
                              onClick={() =>
                                editAnswer(questionIndex, answerIndex)
                              }
                            />

                            <FontAwesomeIcon
                              icon={faXmark}
                              className="ml-auto text-white transition-all duration-200 cursor-pointer opacity-20 hover:text-red hover:opacity-100"
                              onClick={() => {
                                const updatedQuestions = [...questions];
                                updatedQuestions[questionIndex].answers.splice(
                                  answerIndex,
                                  1
                                );
                                setQuestions(updatedQuestions);
                              }}
                            />

                            <FontAwesomeIcon
                              icon={faCopy}
                              className="ml-2 text-white transition-all duration-200 cursor-pointer opacity-20 hover:text-blue hover:opacity-100"
                              onClick={() => {
                                const updatedQuestions = [...questions];
                                updatedQuestions[questionIndex].answers.push({
                                  text: answer.text,
                                  correct: answer.correct,
                                });
                                setQuestions(updatedQuestions);
                              }}
                            />
                          </div>
                        ))}

                        <div
                          className="flex items-center justify-center w-full px-4 py-2 text-sm text-white transition-all duration-200 border cursor-pointer min-h-fit border-border bg-green font-roboto hover:bg-green-hover hover:text-black"
                          onClick={() => createNewAnswer(questionIndex)}>
                          <FontAwesomeIcon icon={faPlus} className="mr-2" />
                          Új válasz hozzáadása
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="w-full">
                <div
                  className="flex items-center justify-center w-full px-4 py-2 mt-2 text-white transition-all duration-200 border cursor-pointer min-h-fit border-border bg-green font-roboto hover:bg-green-hover hover:text-black"
                  onClick={() => createNewQuestion()}>
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Új kérdés hozzáadása
                </div>
              </div>

              {questions.length > 0 && (
                <div
                  className="flex items-center justify-center w-full px-4 py-2 text-white transition-all duration-200 border cursor-pointer min-h-fit border-border bg-orange font-roboto hover:bg-orange-hover hover:text-black"
                  onClick={() => startTest()}>
                  <FontAwesomeIcon icon={faPlay} className="mr-2" />
                  Teszt indítása
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full text-2xl animate-pulse text-red font-roboto">
            Válassz egy témát!
          </div>
        )}

        {isPopupOpen && (
          <NewTopicPopup
            header="Kérdés szerkesztése"
            placeholder="Kérdés szövege"
            defaultName={
              questions.find((question) => question.id === selectedQuestion)
                .text
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

        {isAnswerPopupOpen && (
          <NewTopicPopup
            header="Válasz szerkesztése"
            placeholder="Válasz szövege"
            defaultName={
              questions[selectedAnswer.questionIndex].answers[
                selectedAnswer.answerIndex
              ].text
            }
            input={true}
            button="Mentés"
            onSave={(newAnswer) => {
              const updatedQuestions = [...questions];
              updatedQuestions[selectedAnswer.questionIndex].answers[
                selectedAnswer.answerIndex
              ].text = newAnswer;

              setQuestions(updatedQuestions);
              setIsAnswerPopupOpen(false);
            }}
            onClose={() => setIsAnswerPopupOpen(false)}
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

      {isTestStarted && (
        <Test questions={questions} setIsTestStarted={setIsTestStarted} />
      )}
    </>
  );
};

export default QuestionSelector;
