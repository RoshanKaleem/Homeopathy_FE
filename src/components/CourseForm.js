import React from 'react';
import { TextField, Button } from '@mui/material';

const CourseForm = ({ courseData, setCourseData, onSubmit, onCancel }) => {
  return (
    <div>
      <TextField
        label="Course Title"
        value={courseData.title}
        onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
        variant="outlined"
        fullWidth
        style={{ marginBottom: '10px' }}
      />
      <TextField
        label="Course Description"
        value={courseData.description}
        onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
        variant="outlined"
        fullWidth
        style={{ marginBottom: '10px' }}
      />
      <Button variant="contained" color="primary" onClick={onSubmit}>
        Save
      </Button>
      <Button variant="outlined" color="secondary" onClick={onCancel} style={{ marginLeft: '10px' }}>
        Cancel
      </Button>
    </div>
  );
};

export default CourseForm;
