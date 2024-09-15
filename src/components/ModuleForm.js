import React from 'react';
import { TextField, Button } from '@mui/material';
import { Checkbox, FormControlLabel } from '@mui/material';

const ModuleForm = ({ moduleData, setModuleData, onSubmit, onCancel }) => {
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setModuleData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  return (
    <div>
      <TextField
        label="Module Title"
        value={moduleData.title}
        onChange={(e) => setModuleData({ ...moduleData, title: e.target.value })}
        variant="outlined"
        fullWidth
        style={{ marginBottom: '10px' }}
      />      
      <TextField
        label="Module Description"
        value={moduleData.description}
        onChange={(e) => setModuleData({ ...moduleData, description: e.target.value })}
        variant="outlined"
        fullWidth
        style={{ marginBottom: '10px' }}
      />
      {console.log(moduleData)}
      <FormControlLabel
        control={
          <Checkbox
            name="has_quiz"
            checked={moduleData.has_quiz}
            onChange={handleChange}
          />
        }
        label="Has Quiz?"
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

export default ModuleForm;
