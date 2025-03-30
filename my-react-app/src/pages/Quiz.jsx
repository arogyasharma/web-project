import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';


const categoryMap = {
  'Science': 17,    
  'History': 23,   
  'Geography': 22,  
  'Sports': 21,     
  'Technology': 18, 
  'Movies': 11      
};

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [options, setOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
   
  }, []);

  async function fetchQuestions() {
    try {
      const selectedCategory = localStorage.getItem('selectedCategory');
      const categoryId = categoryMap[selectedCategory];
      
      let apiUrl = "https://opentdb.com/api.php?amount=10&type=multiple";
      if (categoryId) {
        apiUrl += `&category=${categoryId}`;
      }

      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data.results.length === 0) {
        alert("No questions available for this category. Please try another category.");
        navigate('/categories');
        return;
      }

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
    if (selected !== null) return; 
    setSelected(option);
    if (option === questions[currentQuestionIndex].correct) {
      setScore(prevScore => prevScore + 1);
    }
  }

  async function saveScore() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('User not logged in, score not saved');
        return;
      }

      const selectedCategory = localStorage.getItem('selectedCategory');
      const response = await fetch('http://localhost:5000/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category: selectedCategory,
          score: score,
          totalQuestions: questions.length
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save score');
      }
    } catch (error) {
      console.error('Error saving score:', error);
    }
  }

  function handleNext() {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setOptions(shuffleArray([...questions[currentQuestionIndex + 1].options]));
      setSelected(null);
    } else {
      // Save score before navigating
      saveScore();
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
