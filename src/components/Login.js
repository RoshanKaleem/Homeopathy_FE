import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Login({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

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
      const response = await axios.post(`http://${process.env.REACT_APP_URL}/token/`, formData);
      if (response.status === 200) {
        console.log(response)
        const token = response.data.access;
        const refresh = response.data.refresh;
        const user = response.data.user;
        localStorage.setItem("token", token);
        localStorage.setItem("refresh", refresh);
        localStorage.setItem("user", JSON.stringify(user));
        setIsAuthenticated(true);
        setSuccessMessage("Sign-In successful!");
        navigate("/"); // Redirect to home or another page on successful login
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({ general: "Invalid username or password" });
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
        Sign In
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
        {errors.general && <Typography color="error">{errors.general}</Typography>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
        >
          Sign In
        </Button>
        <Box sx={{ marginTop: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link href="/register" underline="hover">
              Click here to register
            </Link>
          </Typography>
        </Box>
      </form>
    </Box>
  );
}

export default Login;
