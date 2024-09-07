import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography } from "@mui/material";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    try {
      const response = await axios.post("http://localhost:8000/register/", formData);
      if (response.status === 201) {
        setSuccessMessage("Registration successful!");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ general: "An error occurred. Please try again." });
      }
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "auto",
        marginTop: 8,
        padding: 2,
        boxShadow: 2,
        borderRadius: 2,
        backgroundColor: "white",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      {successMessage && <Typography color="success">{successMessage}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          name="username"
          fullWidth
          margin="normal"
          required
          value={formData.username}
          onChange={handleChange}
          error={!!errors.username}
          helperText={errors.username}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          required
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          required
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
        />
        <TextField
          label="Confirm Password"
          name="password2"
          type="password"
          fullWidth
          margin="normal"
          required
          value={formData.password2}
          onChange={handleChange}
          error={!!errors.password2}
          helperText={errors.password2}
        />
        <TextField
          label="First Name"
          name="first_name"
          fullWidth
          margin="normal"
          value={formData.first_name}
          onChange={handleChange}
          error={!!errors.first_name}
          helperText={errors.first_name}
        />
        <TextField
          label="Last Name"
          name="last_name"
          fullWidth
          margin="normal"
          value={formData.last_name}
          onChange={handleChange}
          error={!!errors.last_name}
          helperText={errors.last_name}
        />
        {errors.general && <Typography color="error">{errors.general}</Typography>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Register
        </Button>
      </form>
    </Box>
  );
}

export default Register;
