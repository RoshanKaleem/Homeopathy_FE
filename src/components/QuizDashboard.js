import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import QuizForm from './QuizForm';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Accordion, AccordionSummary, AccordionDetails, Button, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const QuizDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [isEditingQuiz, setIsEditingQuiz] = useState(false); // Edit state for quizzes
  const [update, setUpdate] = useState(false);
  const [error, setError] = useState(null);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get('/api/courses/');
        setCourses(response.data);
      } catch (error) {
        setError('Error fetching courses');
      }
    };
    fetchCourses();
  }, [update]);

  // Fetch modules when a course is selected
  useEffect(() => {
    const fetchModules = async () => {
      if (selectedCourse) {
        try {
          const response = await axiosInstance.get(`/api/courses/${selectedCourse}/modules/`);
          setModules(response.data);
        } catch (error) {
          setError('Error fetching modules');
        }
      }
    };
    fetchModules();
  }, [selectedCourse, update]);

  // Fetch quiz data when a module is selected
  useEffect(() => {
    const fetchQuizData = async (moduleId) => {
      try {
        const response = await axiosInstance.get(`/api/modules/${moduleId}/quiz/`);
        const updatedModules = modules.map(module =>
          module.id === moduleId ? { ...module, quiz: response.data } : module
        );
        setModules(updatedModules);
      } catch (error) {
        setError('Error fetching quiz data');
      }
    };

    if (currentModuleId) {
      fetchQuizData(currentModuleId);
    }
  }, [currentModuleId, update]);

  // Handle saving the quiz (either create or update)
  const handleSaveQuiz = async (moduleId, quizData) => {
    try {
      const existingQuiz = modules.find(module => module.id === moduleId)?.quiz;
      if (existingQuiz) {
        // Quiz exists, update it
        await axiosInstance.put(`/api/admin/quiz/${existingQuiz.quiz_id}/`, quizData);
      } else {
        // Create a new quiz
        await axiosInstance.post(`/api/admin/modules/${moduleId}/quiz/`, quizData);
      }
      setIsEditingQuiz(false); // Close form
      setUpdate(prev => !prev); // Trigger data refresh
      setError(null);
    } catch (error) {
      setError('Error saving quiz');
    }
  };

  // Handle deleting a question
  const handleDeleteQuestion = async (questionId) => {
    try {
      await axiosInstance.delete(`/api/admin/questions/${questionId}/`);
      setUpdate(prev => !prev); // Trigger refresh
    } catch (error) {
      setError('Error deleting question');
    }
  };

  // Handle editing quiz
  const handleEditQuiz = (moduleId) => {
    setCurrentModuleId(moduleId);
    setIsEditingQuiz(true);
  };

  // Handle canceling quiz edit
  const handleCancelQuiz = () => {
    setIsEditingQuiz(false);
    setCurrentModuleId(null);
  };

  return (
    <div className="admin-dashboard" style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Quiz Manager
      </Typography>

      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}

      <div className="course-list">
        <Typography variant="h6" gutterBottom>
          Courses
        </Typography>
        <List>
          {courses.map(course => (
            <ListItem
              key={course.id}
              button
              onClick={() => setSelectedCourse(course.id)}
              selected={selectedCourse === course.id}
            >
              <ListItemText primary={course.title} />
            </ListItem>
          ))}
        </List>
      </div>

      {selectedCourse && (
        <div className="module-list">
          <Typography variant="h6" gutterBottom>
            Modules for Course {selectedCourse}
          </Typography>
          {modules.map(module => (
            <Accordion key={module.id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`module-${module.id}-content`}
                id={`module-${module.id}-header`}
              >
                <Typography variant="h6">{module.title}</Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Typography variant="body1">{module.description}</Typography>

                {module.quiz ? (
                  <div className="quiz-details" style={{ marginTop: '15px' }}>
                    <Typography variant="h6">Quiz Details</Typography>
                    <Typography>Passing Score: {module.quiz.passing_score}</Typography>

                    <List>
                      {module.quiz.quiz.map(question => (
                        <div key={question.id} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Q: {question.text}
                          </Typography>

                          <IconButton
                            aria-label="delete"
                            onClick={() => handleDeleteQuestion(question.id)}
                            color="secondary"
                          >
                            <DeleteIcon />
                          </IconButton>

                          <List>
                            {question.options.map(option => (
                              <ListItem key={option.id}>
                                <ListItemText
                                  primary={option.text}
                                  secondary={
                                    option.is_correct ? (
                                      <Typography variant="subtitle2" color="success.main">
                                        Correct
                                      </Typography>
                                    ) : (
                                      <Typography variant="subtitle2" color="error.main">
                                        Incorrect
                                      </Typography>
                                    )
                                  }
                                />
                                {option.is_correct ? (
                                  <CheckIcon color="success" />
                                ) : (
                                  <CloseIcon color="error" />
                                )}
                              </ListItem>
                            ))}
                          </List>
                          <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
                        </div>
                      ))}
                    </List>

                    {/* Edit quiz button */}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEditQuiz(module.id)}
                      style={{ marginTop: '10px' }}
                    >
                      Edit Quiz
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setCurrentModuleId(module.id);
                      setIsEditingQuiz(true);
                    }}
                    style={{ marginTop: '10px' }}
                  >
                    Create Quiz
                  </Button>
                )}

                {isEditingQuiz && currentModuleId === module.id && (
                  <QuizForm
                    moduleId={module.id}
                    onSubmit={(quizData) => handleSaveQuiz(module.id, quizData)}
                    onCancel={handleCancelQuiz}
                    existingQuiz={module.quiz || null}
                  />
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizDashboard;
