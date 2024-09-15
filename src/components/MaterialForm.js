import React, { useState } from 'react';
import { TextField, Button, MenuItem, Typography } from '@mui/material';

const MaterialForm = ({ moduleId, onAddMaterial }) => {
  const [materialData, setMaterialData] = useState({
    title: '',
    material_type: 'video', // Default to 'video'
    upload: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setMaterialData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value, // Handle file uploads
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddMaterial(materialData, moduleId);
    setMaterialData({ title: '', material_type: 'video', upload: null });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Material Title"
        name="title"
        value={materialData.title}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        select
        label="Material Type"
        name="material_type"
        value={materialData.material_type}
        onChange={handleChange}
        fullWidth
        margin="normal"
      >
        <MenuItem value="video">Video</MenuItem>
        <MenuItem value="file">File</MenuItem>
        <MenuItem value="presentation">Presentation</MenuItem>
      </TextField>
      <Button variant="contained" component="label">
        Upload File
        <input
          type="file"
          name="upload"
          onChange={handleChange}
          hidden
        />
      </Button>
      {materialData.upload && <Typography>{materialData.upload.name}</Typography>}
      <Button type="submit" variant="contained" color="primary" style={{ marginLeft: '10px' }}>
        Add Material
      </Button>
    </form>
  );
};

export default MaterialForm;
