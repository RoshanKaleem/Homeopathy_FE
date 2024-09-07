import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Grid, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

function MaterialList() {
  const { courseId, moduleId } = useParams();
  const [materials, setMaterials] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(moduleId);
  const navigate = useNavigate();

  // Fetch all materials for the selected module
  useEffect(() => {
    fetch(`http://localhost:8000/api/modules/${selectedModule}/materials/`)
      .then(response => response.json())
      .then(data => setMaterials(data))
      .catch(error => console.error('Error fetching materials:', error));
  }, [selectedModule]);

  // Fetch all modules for the current course
  useEffect(() => {
    fetch(`http://localhost:8000/api/courses/${courseId}/modules/`)
      .then(response => response.json())
      .then(data => setModules(data))
      .catch(error => console.error('Error fetching modules:', error));
  }, []);

  const handleModuleClick = (id) => {
    setSelectedModule(id);
    navigate(`/courses/${courseId}/modules/${id}/materials`);
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
                  {/* Sequential numbering */}
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
                          <source src={`http://localhost:8000${material.upload}`} type="video/mp4" />
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
                          href={`http://localhost:8000${material.upload}`}
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
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MaterialList;
