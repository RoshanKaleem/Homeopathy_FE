import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Button, Box } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function ModuleList() {
  const { courseId } = useParams();
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8000/api/courses/${courseId}/modules/`)
      .then(response => response.json())
      .then(data => setModules(data))
      .catch(error => console.error('Error fetching modules:', error));
  }, [courseId]);

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
              </CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate(`/courses/${courseId}/modules/${module.id}/materials`)}
                >
                  View Materials
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ModuleList;
