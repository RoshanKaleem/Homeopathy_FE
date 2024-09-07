import React, { useEffect, useState } from 'react';
import { createClient } from 'contentful';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Grid, Container, CardMedia } from '@mui/material';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

function BlogList() {
  const [blogPosts, setBlogPosts] = useState([]);

  const client = createClient({
    space: 'gcyv19fvsawd',
    accessToken: 'hQYLhHjVz9EJv9-3cpYKOqxOTkJq1h7Fr0gArAHhEnw'
  });

  useEffect(() => {
    const getAllEntries = async () => {
      try {
        const entries = await client.getEntries({ content_type: 'blog' });
        setBlogPosts(entries.items);
      } catch (error) {
        console.error(error);
      }
    };
    getAllEntries();
  }, []);

  return (
    <Container
      maxWidth="lg"
      sx={{
        paddingTop: 4,
        paddingBottom: 4,
        backgroundColor: '#f5f5dc', // Beige background for a classic feel
      }}
    >
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{
          fontFamily: 'Georgia, serif', // Classic serif font
          color: '#4b5320', // Olive color for titles
        }}
      >
        Blog Posts
      </Typography>
      <Grid container spacing={4}>
        {blogPosts.map((post) => {
          const hasImage = !!post.fields.image;

          return (
            <Grid item key={post.sys.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  transition: 'transform 0.3s',
                  backgroundColor: '#faf0e6', // Linen background for card
                  border: '1px solid #d2b48c', // Tan border for a classic touch
                  '&:hover': {
                    transform: 'scale(1.03)',
                  },
                }}
              >
                {hasImage && (
                  <CardMedia
                    sx={{ height: 200 }}
                    image={post.fields.image.fields.file.url}
                    title={post.fields.title}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ 
                      fontWeight: 'bold',
                      fontFamily: 'Georgia, serif', // Classic serif font for titles
                      color: '#4b5320', // Olive color for titles
                    }}
                  >
                    {post.fields.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="div"
                    sx={{
                      marginTop: 2,
                      marginBottom: 2,
                      maxHeight: hasImage ? 150 : 350, // Adjust maxHeight based on image presence
                      overflow: 'hidden',
                      fontFamily: 'Georgia, serif', // Classic serif font for content
                      color: '#4b5320', // Olive color for content
                    }}
                  >
                    {post.fields.description && documentToReactComponents(post.fields.description)}
                  </Typography>
                </CardContent>
               
                <Button
                  size="large"
                  component={Link}
                  to={`/blog/${post.fields.slug}`}
                  sx={{
                    backgroundColor: '#8b4513', // SaddleBrown color for the button
                    color: '#fff', // White text color
                    '&:hover': {
                      backgroundColor: '#5a3d26', // Darker brown on hover
                    },
                    fontFamily: 'Georgia, serif', // Classic serif font for button
                  }}
                >
                  Read Full Blog
                </Button>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}

export default BlogList;
