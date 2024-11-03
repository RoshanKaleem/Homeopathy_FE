import React from 'react';
import { Box, Container, Grid, Typography, Link, Button, Divider } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" color="inherit">
              At the Practice of Classical Homeopathy, we are dedicated to providing personalized, holistic care to help you achieve optimal health. Discover the transformative power of classical homeopathy.
            </Typography>
          </Grid>

          {/* Quick Links Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>
                <Link href="/courses" color="inherit" underline="hover">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/blog" color="inherit" underline="hover">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/testimonial" color="inherit" underline="hover">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/register" color="inherit" underline="hover">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/login" color="inherit" underline="hover">
                  Login
                </Link>
              </li>
            </ul>
          </Grid>

          {/* Contact Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="inherit">
              Reach out to us for a consultation or to learn more about how classical homeopathy can help you.
            </Typography>
            <Typography variant="body2" color="inherit" mt={1}>
              <strong>Email:</strong> info@classicalhomeopathy.com
            </Typography>
            <Typography variant="body2" color="inherit">
              <strong>Phone:</strong> +123-456-7890
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              href="/book-consultancy"
              sx={{ mt: 2 }}
            >
              Schedule a Consultation
            </Button>
          </Grid>

          {/* Social Media Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Typography variant="body2" color="inherit">
              Stay connected and follow us on social media for updates and health tips.
            </Typography>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>
                <Link href="https://www.facebook.com" color="inherit" underline="hover" target="_blank">
                  Facebook
                </Link>
              </li>
              <li>
                <Link href="https://www.twitter.com" color="inherit" underline="hover" target="_blank">
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="https://www.instagram.com" color="inherit" underline="hover" target="_blank">
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="https://www.linkedin.com" color="inherit" underline="hover" target="_blank">
                  LinkedIn
                </Link>
              </li>
            </ul>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: 'white' }} />

        <Typography variant="body2" color="inherit" align="center">
          © {new Date().getFullYear()} Practice of Classical Homeopathy. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
