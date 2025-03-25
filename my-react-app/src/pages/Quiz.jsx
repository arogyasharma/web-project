// src/pages/Quiz.js
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [options, setOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchQuestions() {
    try {
      const response = await fetch("https://opentdb.com/api.php?amount=10&type=multiple");
      const data = await response.json();
      const mappedQuestions = data.results.map((q) => ({
        question: q.question,
        correct: q.correct_answer,
        options: shuffleArray([...q.incorrect_answers, q.correct_answer]),
      }));
      setQuestions(mappedQuestions);
      if (mappedQuestions.length > 0) {
        setOptions(mappedQuestions[0].options);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Failed to load questions. Please try again.");
    }
  }

  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  function selectOption(option) {
    if (selected !== null) return; // prevent re-selection
    setSelected(option);
    if (option === questions[currentQuestionIndex].correct) {
      setScore(prevScore => prevScore + 1);
    }
  }

  function handleNext() {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setOptions(shuffleArray([...questions[currentQuestionIndex + 1].options]));
      setSelected(null);
    } else {
      // Pass the score to the result page via state
      navigate('/result', { state: { score, total: questions.length } });
    }
  }

  if (questions.length === 0) {
    return (
      <>
        <Header />
        <main className="main">
          <p>Loading questions...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="main">
        <section className="quiz-section active">
          <div className="quiz-box">
            <h2 className="question-text" dangerouslySetInnerHTML={{ __html: questions[currentQuestionIndex].question }}></h2>
            <div className="option-list">
              {options.map((option, index) => (
                <div
                  key={index}
                  className="option-item"
                  onClick={() => selectOption(option)}
                  style={{
                    backgroundColor: selected
                      ? option === questions[currentQuestionIndex].correct
                        ? "#90EE90"
                        : option === selected
                        ? "#FFB6C1"
                        : "white"
                      : "white",
                    pointerEvents: selected ? "none" : "auto"
                  }}
                  dangerouslySetInnerHTML={{ __html: option }}
                ></div>
              ))}
            </div>
            <div className="quiz-footer">
              <span className="question-progress">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              {selected && (
                <button className="next-button button" id="nextBtn" onClick={handleNext}>
                  Next Question
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Quiz;
