import React, { useState } from 'react';

const QuizForm = ({ moduleId, onSubmit, onCancel }) => {
  const [quizData, setQuizData] = useState({
    passing_score: '',
    questions: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuizData({
      ...quizData,
      [name]: value
    });
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const questions = [...quizData.questions];
    questions[index] = {
      ...questions[index],
      [name]: value
    };
    setQuizData({
      ...quizData,
      questions
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, e) => {
    const { name, value, checked } = e.target;
    const questions = [...quizData.questions];
    const options = [...questions[questionIndex].options];
    if (name === 'text') {
      options[optionIndex] = {
        ...options[optionIndex],
        text: value
      };
    } else if (name === 'is_correct') {
      options[optionIndex] = {
        ...options[optionIndex],
        is_correct: checked
      };
    }
    questions[questionIndex] = {
      ...questions[questionIndex],
      options
    };
    setQuizData({
      ...quizData,
      questions
    });
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, { text: '', options: [] }]
    });
  };

  const addOption = (questionIndex) => {
    const questions = [...quizData.questions];
    const options = [...questions[questionIndex].options];
    options.push({ text: '', is_correct: false });
    questions[questionIndex] = {
      ...questions[questionIndex],
      options
    };
    setQuizData({
      ...quizData,
      questions
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(quizData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Passing Score:</label>
        <input
          type="number"
          name="passing_score"
          value={quizData.passing_score}
          onChange={handleChange}
        />
      </div>

      <div>
        <h4>Questions</h4>
        {quizData.questions.map((question, questionIndex) => (
          <div key={questionIndex}>
            <label>Question:</label>
            <input
              type="text"
              name="text"
              value={question.text}
              onChange={(e) => handleQuestionChange(questionIndex, e)}
            />
            <div>
              <h5>Options</h5>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <input
                    type="text"
                    name="text"
                    value={option.text}
                    placeholder="Option text"
                    onChange={(e) => handleOptionChange(questionIndex, optionIndex, e)}
                  />
                  <label>
                    <input
                      type="checkbox"
                      name="is_correct"
                      checked={option.is_correct}
                      onChange={(e) => handleOptionChange(questionIndex, optionIndex, e)}
                    />
                    Correct
                  </label>
                </div>
              ))}
              <button type="button" onClick={() => addOption(questionIndex)}>Add Option</button>
            </div>
          </div>
        ))}
        <button type="button" onClick={addQuestion}>Add Question</button>
      </div>

      <button type="submit">Submit Quiz</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default QuizForm;
