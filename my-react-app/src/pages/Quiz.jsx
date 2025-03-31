import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';


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
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15);
  const [timerActive, setTimerActive] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Timer effect
  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      // Show correct answer and disable options for current question only
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion) {
        setSelected(currentQuestion.correct);
      }
    }
    return () => clearInterval(timer);
  }, [timeLeft, timerActive, currentQuestionIndex, questions]);

  // Reset timer and selected answer when moving to next question
  useEffect(() => {
    setTimeLeft(15);
    setTimerActive(true);
    setSelected(null);
  }, [currentQuestionIndex]);

  async function fetchQuestions() {
    try {
      setIsLoading(true);
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
    } finally {
      // Add a small delay to show the loading animation
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  }

  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  function selectOption(option) {
    if (selected !== null || !timerActive) return; 
    setSelected(option);
    setTimerActive(false);
    if (option === questions[currentQuestionIndex].correct) {
      setScore(prevScore => prevScore + 1);
    }
  }

  function getOptionClass(option) {
    if (selected === null) return 'option-item';
    if (option === questions[currentQuestionIndex].correct) {
      return 'option-item correct';
    }
    if (option === selected && option !== questions[currentQuestionIndex].correct) {
      return 'option-item wrong';
    }
    return 'option-item';
  }

  async function saveScore() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('User not logged in, score not saved');
        return;
      }

      const selectedCategory = localStorage.getItem('selectedCategory');
      console.log('Saving score:', { category: selectedCategory, score, totalQuestions: questions.length });

      const response = await fetch(`${API_URL}/api/scores`, {
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save score');
      }

      const data = await response.json();
      console.log('Score saved successfully:', data);
    } catch (error) {
      console.error('Error saving score:', error);
      // Don't show error to user as it's not critical for the quiz experience
    }
  }

  function handleNext() {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setOptions(shuffleArray([...questions[currentQuestionIndex + 1].options]));
      setSelected(null);
    } else {
      // Save score before navigating
      saveScore().then(() => {
        navigate('/result', { state: { score, total: questions.length } });
      });
    }
  }

  if (questions.length === 0) {
    return (
      <>
        <Header />
        <main className="main">
          <section className="quiz-section active">
            <div className="quiz-container">
              <div className="loading-container">
                <div className="loading-circle"></div>
                <div className="loading-text">Loading your quiz...</div>
              </div>
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="main">
        <section className="quiz-section active">
          <div className="quiz-container">
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-circle"></div>
                <div className="loading-text">Loading your quiz...</div>
              </div>
            ) : (
              <>
                <div className="timer-container">
                  <div className={`timer ${timeLeft <= 5 ? 'timer-warning' : ''}`}>
                    Time Left: {timeLeft}s
                  </div>
                </div>
                <div className="question-text">
                  {questions[currentQuestionIndex]?.question}
                </div>
                <div className="option-list">
                  {options.map((option, index) => (
                    <div
                      key={index}
                      className={getOptionClass(option)}
                      onClick={() => selectOption(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
                <div className="quiz-footer">
                  <div className="question-progress">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </div>
                  <button className="button" onClick={handleNext}>
                    {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default Quiz;
