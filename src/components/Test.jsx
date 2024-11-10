import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const shuffle = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const Test = ({ questions, setIsTestStarted }) => {
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [successful, setSuccessful] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [started, setStarted] = useState(false);
  const [testEnded, setTestEnded] = useState(false);
  const [multipleAnswerQuestion, setMultipleAnswerQuestion] = useState(false);
  const [time, setTime] = useState(0); // Time in seconds

  useEffect(() => {
    const shuffledQuestions = shuffle(questions).map((question) => ({
      ...question,
      answers: shuffle(
        question.answers.map((answer) => ({ ...answer, selected: false }))
      ),
    }));

    setCurrentQuestions(shuffledQuestions);
    setMultipleAnswerQuestion(
      shuffledQuestions[currentQuestion].answers.filter(
        (answer) => answer.correct
      ).length > 1
    );
  }, [questions]);

  // Timer
  useEffect(() => {
    let timer;
    if (started && !testEnded) {
      timer = setInterval(() => setTime((prevTime) => prevTime + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [started, testEnded]);

  const handleNextQuestion = () => {
    setAnswered(false);

    if (currentQuestion < currentQuestions.length - 1) {
      const nextQuestionIndex = currentQuestion + 1;
      setCurrentQuestion(nextQuestionIndex);

      // Reset selections for the next question
      const updatedQuestions = currentQuestions.map((question, index) => {
        if (index === nextQuestionIndex) {
          question.answers = question.answers.map((answer) => ({
            ...answer,
            selected: false,
          }));
        }
        return question;
      });
      setCurrentQuestions(updatedQuestions);

      setMultipleAnswerQuestion(
        currentQuestions[nextQuestionIndex].answers.filter(
          (answer) => answer.correct
        ).length > 1
      );
    } else {
      setTestEnded(true);
    }
  };

  const handleCloseTest = () => {
    setIsTestStarted(false);
  };

  const incorrectAnswers = currentQuestions.length - successful;
  const percentage = ((successful / currentQuestions.length) * 100).toFixed(2);
  const timeInMinutes = (time / 60).toFixed(2);

  return (
    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full backdrop-blur-md">
      <div className="border bg-main border-border">
        <div className="flex items-center justify-between px-4 py-2 text-lg font-semibold text-white border-b bg-secondary border-border text-roboto">
          <span>Teszt</span>
          <div className="flex items-center gap-2">
            {started && !testEnded && (
              <span className="text-sm">
                Kérdés: {currentQuestion + 1} / {currentQuestions.length}
              </span>
            )}

            {started && (
              <FontAwesomeIcon
                icon={faTimes}
                className="transition-all duration-200 scale-100 cursor-pointer text-red hover:text-red-hover hover:scale-125"
                onClick={handleCloseTest}
              />
            )}
          </div>
        </div>

        {!started ? (
          <div className="flex flex-col items-center gap-4 p-4">
            <div className="text-lg font-semibold text-center text-white">
              A teszt megkezdéséhez kattints a gombra!
            </div>
            <button
              className="px-4 py-2 text-lg font-semibold text-white transition-all duration-200 rounded-lg bg-green font-roboto hover:bg-green-hover"
              onClick={() => setStarted(true)}>
              Teszt megkezdése
            </button>
          </div>
        ) : testEnded ? (
          <div className="flex flex-col items-center p-4 min-w-96">
            <div className="mb-4 text-lg font-semibold text-white">
              Teszt összegző
            </div>
            <div className="text-center text-white">
              <p>
                Összes kérdés:
                <span className="text-blue">{currentQuestions.length}</span>
              </p>
              <p>
                Helyes válaszok:{" "}
                <span className="text-green">{successful}</span>
              </p>
              <p>
                Helytelen válaszok:{" "}
                <span className="text-red">{incorrectAnswers}</span>
              </p>
              <p>
                Százalék: <span className="text-green">{percentage}%</span>
              </p>
              <p>
                Idő: <span className="text-orange">{timeInMinutes} perc</span>
              </p>
            </div>
            <button
              className="px-4 py-2 mt-4 text-lg font-semibold text-white transition-all duration-200 rounded-lg bg-red font-roboto hover:bg-red-hover"
              onClick={handleCloseTest}>
              Bezárás
            </button>
          </div>
        ) : (
          <div
            className="px-4 py-2"
            style={{ minWidth: "fit-content", maxWidth: "40vw" }}>
            <div className="mb-4 text-xl font-bold text-center whitespace-pre-line">
              {currentQuestions[currentQuestion].text}
            </div>

            <div className="flex flex-col gap-2">
              {currentQuestions[currentQuestion].answers.map(
                (answer, index) => (
                  <div
                    key={index}
                    className={`px-4 py-2 border border-border cursor-pointer transition-all duration-200 ${
                      answered
                        ? answer.correct
                          ? "bg-green text-white"
                          : "bg-red text-white"
                        : "bg-secondary text-white"
                    }`}
                    onClick={() => {
                      if (!answered && !multipleAnswerQuestion) {
                        setAnswered(true);
                        if (answer.correct) setSuccessful(successful + 1);
                      }
                    }}>
                    {multipleAnswerQuestion && (
                      <input
                        type="checkbox"
                        className="p-4 mr-2 cursor-pointer"
                        checked={answer.selected || false}
                        onChange={(e) => {
                          const newQuestions = [...currentQuestions];
                          newQuestions[currentQuestion].answers[
                            index
                          ].selected = e.target.checked;
                          setCurrentQuestions(newQuestions);
                        }}
                      />
                    )}

                    {answer.text}
                  </div>
                )
              )}
            </div>

            {answered && (
              <button
                className="flex items-center justify-center w-full px-4 py-2 mt-4 text-lg font-semibold text-white transition-all duration-200 rounded-md bg-blue font-roboto hover:bg-blue-hover hover:text-black"
                onClick={handleNextQuestion}>
                Következő kérdés
              </button>
            )}

            {!answered && multipleAnswerQuestion && (
              <button
                className="flex items-center justify-center w-full px-4 py-2 mt-4 text-lg font-semibold text-white transition-all duration-200 rounded-md bg-orange font-roboto hover:bg-orange-hover hover:text-black"
                onClick={() => {
                  setAnswered(true);

                  const correctAnswers = currentQuestions[
                    currentQuestion
                  ].answers.filter((answer) => answer.correct);
                  const selectedAnswers = currentQuestions[
                    currentQuestion
                  ].answers.filter((answer) => answer.selected);

                  const allCorrectAnswersSelected =
                    selectedAnswers.length === correctAnswers.length &&
                    selectedAnswers.every((answer) => answer.correct);

                  if (allCorrectAnswersSelected) {
                    setSuccessful(successful + 1);
                  }
                }}>
                Check
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Test;
