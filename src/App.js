import React, { useEffect, useState } from "react";
import { createClient } from "contentful";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Home from "./components/Home";
import BlogList from "./components/blogList";
import BlogPost from "./components/blogPost";
import Testimonial from "./components/Testimonial";
import { useTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Register from "./components/Register";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Page from "./components/Page";
import Course from "./components/Course";
import ModuleList from './components/ModuleList';
import MaterialList from './components/MaterialList';
import QuizPage from "./components/QuizPage";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [pages, setPages] = useState([]);

  const client = createClient({
    space: "gcyv19fvsawd",
    accessToken: "hQYLhHjVz9EJv9-3cpYKOqxOTkJq1h7Fr0gArAHhEnw",
  });

  useEffect(() => {
    const getAllEntries = async () => {
      try {
        const entries = await client.getEntries({ content_type: "pages" });
        setPages(entries.items);
      } catch (error) {
        console.error(error);
      }
    };
    getAllEntries();

    // Check if the user is authenticated by checking for the token
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#6B4226", // Brown color
      },
      secondary: {
        main: "#B5651D", // Burnt orange color
      },
      background: {
        default: "#F5F5DC", // Beige background
      },
    },
    typography: {
      fontFamily: '"Garamond", "Palatino", "Baskerville", serif',
      h6: {
        fontSize: "1.5rem",
        fontStyle: "italic",
      },
      button: {
        textTransform: "none",
        fontWeight: "bold",
        fontSize: "1rem",
        fontFamily: '"Garamond", "Palatino", "Baskerville", serif',
      },
      body1: {
        fontFamily: '"Garamond", "Palatino", "Baskerville", serif',
        fontSize: "1rem",
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
          },
        },
      },
    },
  });

  const drawer = (
    <Box
      sx={{
        width: 250,
        height: "100vh",
        padding: 2,
        backgroundColor: "#F5F5DC",
      }}
      role="presentation"
      onClick={handleDrawerClose}
      onKeyDown={handleDrawerClose}
    >
      <Typography variant="h6" sx={{ marginBottom: 2, color: "#7B3F00" }}>
        Practice of Classical Homoeopathy
      </Typography>
      <Divider />
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/blog">
          <ListItemText primary="Blogs" />
        </ListItem>
        <ListItem button component={Link} to="/testimonial">
          <ListItemText primary="Testimonials" />
        </ListItem>
        <ListItem button component={Link} to="/courses">
          <ListItemText primary="Courses" />
        </ListItem>
        {pages.map((page) => (
          <ListItem
            button
            key={page.sys.id}
            component={Link}
            to={`/page/${page.fields.slug}`}
          >
            <ListItemText primary={page.fields.title} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <AppBar position="static">
            <Toolbar
              sx={{
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: theme.palette.primary.main,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleDrawerOpen}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  sx={{
                    marginLeft: 2,
                    fontFamily: theme.typography.fontFamily,
                    fontStyle: "italic",
                  }}
                >
                  Practice of Classical Homoeopathy
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                {isAuthenticated ? (
                  <Button
                    component={Link}
                    to="/logout"
                    color="inherit"
                    sx={{
                      fontFamily: theme.typography.fontFamily,
                      fontWeight: "bold",
                      color: "#FFF8DC",
                    }}
                  >
                    Logout
                  </Button>
                ) : (
                  <Button
                    component={Link}
                    to="/login"
                    color="inherit"
                    sx={{
                      fontFamily: theme.typography.fontFamily,
                      fontWeight: "bold",
                      color: "#FFF8DC",
                    }}
                  >
                    Sign In
                  </Button>
                )}
              </Box>
            </Toolbar>
          </AppBar>

          <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerClose}>
            {drawer}
          </Drawer>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/testimonial" element={<Testimonial />} />
            <Route path="/page/:slug" element={<Page />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route
              path="/logout"
              element={<Logout setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route path="/courses" element={<Course />} />
            <Route path="/courses/:courseId/modules" element={<ModuleList />} />
            <Route path="/courses/:courseId/modules/:moduleId/materials" element={<MaterialList />} />
            <Route path="/courses/:courseId/modules/:moduleId/quiz" element={<QuizPage />} />
            <Route path="/admin" element={<AdminDashboard/>} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
