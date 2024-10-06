import React from "react";
import axios from "axios";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Logout({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const refresh = localStorage.getItem("refresh");

    if (!refresh) {
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_URL}/logout/`,
        { refresh_token: refresh },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      setIsAuthenticated(false); // Update the authentication state
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout failure (optional)
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Are you sure you want to log out?
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        sx={{ marginTop: 2 }}
      >
        Logout
      </Button>
    </Box>
  );
}

export default Logout;
