import React from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, CardMedia, Link, Box } from '@mui/material';

function HomePage() {
  return (
    <Container maxWidth="lg">
      <Box mt={4}>
        <Typography variant="h2" component="h1" gutterBottom align="center" color="primary">
          Welcome to the Practice of Classical Homeopathy
        </Typography>

        <Typography variant="h6" component="p" paragraph align="center" color="textSecondary">
          A holistic approach to healing that nurtures your body, mind, and spirit. At our practice, we offer personalized treatment plans designed to restore your health using time-honored principles of classical homeopathy.
        </Typography>

        <Box mt={6} mb={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Discover More About Our Offerings
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {/* Blog Section */}
          <Grid item xs={12} sm={6} md={4}>
            <Card raised>
              <CardMedia
                component="img"
                height="200"
                image="https://st2.depositphotos.com/1006899/8421/i/450/depositphotos_84219350-stock-photo-word-blog-suspended-by-ropes.jpg"
                alt="Blog"
              />
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Explore Our Blogs
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                  Stay updated with the latest insights and articles on holistic health and classical homeopathy. Learn about remedies, case studies, and wellness tips curated by our experienced practitioners.
                </Typography>
                <Button
                  size="large"
                  color="primary"
                  variant="contained"
                  component={Link}
                  href="/blog"
                  fullWidth
                >
                  Read Our Blog
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Testimonials Section */}
          <Grid item xs={12} sm={6} md={4}>
            <Card raised>
              <CardMedia
                component="img"
                height="200"
                image="https://t3.ftcdn.net/jpg/05/52/64/84/360_F_552648480_ixeelxn2RPidJO1m0m6DI13aWvPZiliB.jpg"
                alt="Testimonials"
              />
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  What Our Patients Say
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                  Discover how classical homeopathy has transformed the lives of our patients. Read their inspiring stories and feedback about how our treatments have helped them regain balance and wellness.
                </Typography>
                <Button
                  size="large"
                  color="secondary"
                  variant="contained"
                  component={Link}
                  href="/testimonial"
                  fullWidth
                >
                  Read Testimonials
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Courses Section */}
          <Grid item xs={12} sm={6} md={4}>
            <Card raised>
              <CardMedia
                component="img"
                height="200"
                image="https://every-tuesday.com/wp-content/uploads/2016/04/courses.jpg" // Add appropriate course image URL
                alt="Courses"
              />
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Enroll in Our Courses
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                  Learn the foundations and advanced techniques of classical homeopathy through our carefully designed courses. Whether you're a beginner or an experienced practitioner, we have a course for you.
                </Typography>
                <Button
                  size="large"
                  color="primary"
                  variant="contained"
                  component={Link}
                  href="/courses"
                  fullWidth
                >
                  View Courses
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box mt={6}>
          <Typography variant="h4" align="center" gutterBottom>
            Why Choose Classical Homeopathy?
          </Typography>
          <Typography variant="body1" color="textSecondary" align="center" paragraph>
            Classical homeopathy is a natural and holistic system of medicine that seeks to treat the whole person, not just the symptoms. By addressing the root causes of illness, we aim to restore balance and vitality in a gentle yet powerful way.
          </Typography>

          <Typography variant="body1" color="textSecondary" align="center" paragraph>
            With over [X years] of experience, our practitioners are dedicated to helping you achieve optimal health. Whether you're dealing with chronic conditions or looking for preventive care, our personalized approach is designed to meet your unique needs.
          </Typography>
        </Box>

        {/* Additional Call to Action */}
        <Box mt={6} textAlign="center">
          <Button
            size="large"
            color="secondary"
            variant="outlined"
            component={Link}
            href="/contact"
          >
            Contact Us Today for a Consultation
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default HomePage;
