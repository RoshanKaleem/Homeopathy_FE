import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, RadioGroup, FormControlLabel, Radio, Box, Typography } from '@mui/material';

function QuizPage() {
  const { moduleId } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  // Fetch quiz data
  useEffect(() => {
    fetch(`${process.env.REACT_APP_URL}/api/modules/${moduleId}/quiz/`)
      .then(response => response.json())
      .then(data => setQuiz(data.quiz))
      .catch(error => console.error('Error fetching quiz:', error));
  }, [moduleId]);

  const handleAnswerChange = (questionId, optionId) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: optionId
    }));
  };

  const handleSubmit = () => {
    fetch(`${process.env.REACT_APP_URL}/api/modules/${moduleId}/submit-quiz/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ answers })
    })
      .then(response => response.json())
      .then(data => setResult(data))
      .catch(error => console.error('Error submitting quiz:', error));
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">Quiz</Typography>
      {quiz.map(question => (
        <Box key={question.id} sx={{ mb: 3 }}>
          <Typography variant="h6">{question.text}</Typography>
          <RadioGroup
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          >
            {question.options.map(option => (
              <FormControlLabel
                key={option.id}
                value={option.id}
                control={<Radio />}
                label={option.text}
              />
            ))}
          </RadioGroup>
        </Box>
      ))}
      <Button variant="contained" onClick={handleSubmit}>Submit</Button>
      {result && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          {result.passed ? 'You passed the quiz!' : 'You did not pass the quiz.'}
          <br />
          Your score: {result.score}%
        </Typography>
      )}
    </Box>
  );
}

export default QuizPage;
