import React from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, CardMedia, Link } from '@mui/material';

function HomePage() {
  return (
    <Container maxWidth="lg">
      <br/>
      <Typography variant="h2" component="h1" gutterBottom align="center">
        Practice of Classical Homeopathy
      </Typography>

      <hr/>
      <br/>
      <Typography variant="h6" component="p" paragraph align="center">
        Welcome to our practice! Explore our blogs and testimonials to learn more about classical homeopathy and how it can benefit you.
      </Typography>
      <br/>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image="https://st2.depositphotos.com/1006899/8421/i/450/depositphotos_84219350-stock-photo-word-blog-suspended-by-ropes.jpg"
              alt="Blog Image"
            />
            <CardContent>
              <Typography variant="h5" component="div">
                Explore Our Blogs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Read insightful articles and updates about classical homeopathy. Stay informed and engaged with our latest posts.
              </Typography>
              <br/>
              <Button
                size="large"
                color="primary"
                variant="contained"
                component={Link}
                href="/blog"
                fullWidth
              >
                View Blogs
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image="https://t3.ftcdn.net/jpg/05/52/64/84/360_F_552648480_ixeelxn2RPidJO1m0m6DI13aWvPZiliB.jpghttps://t3.ftcdn.net/jpg/05/52/64/84/360_F_552648480_ixeelxn2RPidJO1m0m6DI13aWvPZiliB.jpg"
              alt="Testimonial Image"
            />
            <CardContent>
              <Typography variant="h5" component="div">
                Read Testimonials
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Discover how our practice has positively impacted our patients through their personal stories and feedback.
              </Typography>
              <br/>
              <Button
                size="large"
                color="secondary"
                variant="contained"
                component={Link}
                href="/testimonial"
                fullWidth
              >
                View Testimonials
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default HomePage;
