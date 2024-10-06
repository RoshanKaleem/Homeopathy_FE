import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Button, Box } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function ModuleList() {
  const { courseId } = useParams();
  const [modules, setModules] = useState([]);
  const [lockedModules, setLockedModules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve the JWT token from localStorage

    fetch(`http://${process.env.REACT_APP_URL}/api/courses/${courseId}/modules/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Include the JWT token in the Authorization header
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        setModules(data);
        // Check if modules are locked
        setLockedModules(data.filter(module => module.has_quiz && !module.passed).map(module => module.id));
      })
      .catch(error => console.error('Error fetching modules:', error));
  }, [courseId]);

  console.log(modules)
  const handleModuleClick = (moduleId) => {
    navigate(`/courses/${courseId}/modules/${moduleId}/materials`);
  };

  const handleQuizClick = (moduleId) => {
    navigate(`/courses/${courseId}/modules/${moduleId}/quiz`);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h3" gutterBottom>Modules</Typography>
      <Grid container spacing={3}>
        {modules.map(module => (
          <Grid item xs={12} sm={6} md={4} key={module.id}>
            <Card
              sx={{
                transition: '0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
                }
              }}
            >
              <CardContent>
                <Typography variant="h5">{module.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {module.description}
                </Typography>
                {module.has_quiz && (
                    <Typography variant="body2" color="warning.main">
                      {lockedModules.includes(module.id) ? "Quiz Available" : "Quiz Passed"}
                    </Typography>
                  )}
              </CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={() => handleModuleClick(module.id)}
                disabled={module.locked}  // Disable if the module is locked
              >
                {module.locked ? "Locked" : "View Materials"}
              </Button>
                {module.has_quiz && lockedModules.includes(module.id) && (
                  <Button
                    variant="outlined"
                    onClick={() => handleQuizClick(module.id)}
                  >
                    Take Quiz
                  </Button>
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ModuleList;
