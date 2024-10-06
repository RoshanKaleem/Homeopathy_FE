import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Button, Box } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DownloadIcon from '@mui/icons-material/Download';

function MaterialList() {
  const { courseId, moduleId } = useParams();
  const [materials, setMaterials] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(moduleId);
  const [lockedModules, setLockedModules] = useState([]);
  const navigate = useNavigate();

  // Fetch all materials for the selected module
  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve the JWT token from localStorage

    fetch(`${process.env.REACT_APP_URL}/api/modules/${selectedModule}/materials/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Include the JWT token in the Authorization header
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => setMaterials(data))
      .catch(error => console.error('Error fetching materials:', error));
  }, [selectedModule]);

  // Fetch all modules for the current course
  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve the JWT token from localStorage

    fetch(`${process.env.REACT_APP_URL}/api/courses/${courseId}/modules/`, {
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

  const handleModuleClick = (id) => {
    setSelectedModule(id);
    // navigate(`/courses/${courseId}/modules/${id}/materials`);
  };

  const handleQuizClick = (moduleId) => {
    navigate(`/courses/${courseId}/modules/${moduleId}/quiz`);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={3}>
        {/* Left Section: Materials of the selected module */}
        <Grid item xs={12} md={8}>
          <Typography variant="h3" gutterBottom>Materials</Typography>
          <Grid container spacing={3}>
            {materials.map((material, index) => (
              <Grid item xs={12} key={material.id}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 3,
                    transition: '0.3s',
                    '&:hover': {
                      boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <Typography variant="h5" sx={{ alignSelf: 'flex-start', mb: 2 }}>
                    {index + 1}. {material.title}
                  </Typography>

                  <CardContent sx={{ width: '100%' }}>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      Type: {material.material_type}
                    </Typography>

                    {/* Conditional rendering for video and file materials */}
                    {material.material_type === 'video' && (
                      <Box sx={{ width: '100%', textAlign: 'center' }}>
                        <video controls style={{ width: '100%', maxWidth: '800px' }}>
                          <source src={`${process.env.REACT_APP_URL}${material.upload}`} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </Box>
                    )}

                    {material.material_type === 'file' && (
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<DownloadIcon />}
                          href={`${process.env.REACT_APP_URL}${material.upload}`}
                          download
                        >
                          Download File
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Right Section: List of all modules for the current course */}
        <Grid item xs={12} md={4}>
          <Typography variant="h4" gutterBottom>Modules</Typography>
          <Box sx={{ maxHeight: '80vh', overflowY: 'auto', pr: 2 }}>
            {modules.map(module => (
              <Card
                key={module.id}
                sx={{
                  mb: 2,
                  transition: '0.3s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
                  }
                }}
                onClick={() => handleModuleClick(module.id)}
              >
                <CardContent>
                  <Typography variant="h6">{module.title}</Typography>
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
                  {module.has_quiz && module.locked && (
                    <Button
                      variant="outlined"
                      onClick={() => handleQuizClick(module.id)}
                    >
                      Take Quiz
                    </Button>
                  )}
                </Box>
              </Card>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MaterialList;
