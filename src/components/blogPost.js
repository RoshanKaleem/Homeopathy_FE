import React, { useEffect, useState } from "react";
import { createClient } from "contentful";
import { useParams, Link } from "react-router-dom";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Box,
} from "@mui/material";

function BlogPost() {
  const richTextOptions = {
    renderNode: {
      [INLINES.EMBEDDED_ENTRY]: (node, children) => {
        if (node.data.target.sys.contentType.sys.id === "blog") {
          return (
            <a
              href={`/blog/${node.data.target.fields.slug}`}
              className="blog-post-link"
            >
              {node.data.target.fields.title || "Untitled"}
            </a>
          );
        }
        return <span>Unsupported inline entry type</span>;
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node, children) => {
        if (!node.data.target || !node.data.target.fields) {
          return <div>Embedded entry is missing fields</div>;
        }
        if (node.data.target.sys.contentType.sys.id === "codeBlock") {
          return (
            <pre className="code-block">
              <code>{node.data.target.fields.code || "No code available"}</code>
            </pre>
          );
        }
        if (node.data.target.sys.contentType.sys.id === "videoEmbed") {
          return (
            <iframe
              className="video-embed"
              src={node.data.target.fields.embedUrl}
              height="100%"
              width="100%"
              frameBorder="0"
              scrolling="no"
              title={node.data.target.fields.title || "Video"}
              allowFullScreen={true}
            />
          );
        }
        return <div>Unsupported embedded entry type</div>;
      },
      [BLOCKS.EMBEDDED_ASSET]: (node, children) => {
        return (
          <img
            className="embedded-asset"
            src={`https://${node.data.target.fields.file.url}`}
            height={node.data.target.fields.file.details.image.height}
            width={node.data.target.fields.file.details.image.width}
            alt={node.data.target.fields.description || "Embedded asset"}
          />
        );
      },
    },
  };

  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [otherPosts, setOtherPosts] = useState([]);
  const [createdAt, setcreatedAt] = useState([]);
  const options = { year: "numeric", month: "short", day: "numeric" };

  const client = createClient({
    space: "gcyv19fvsawd",
    accessToken: "hQYLhHjVz9EJv9-3cpYKOqxOTkJq1h7Fr0gArAHhEnw",
  });

  useEffect(() => {
    const getPost = async () => {
      try {
        const entry = await client.getEntries({
          content_type: "blog",
          "fields.slug": slug,
        });
        setPost(entry.items[0].fields);

        const date = new Date(entry.items[0].sys.createdAt);
        const formatter = new Intl.DateTimeFormat("en-US", options);
        const formattedDate = formatter.format(date);

        setcreatedAt(formattedDate);
      } catch (error) {
        console.error(error);
      }
    };

    const getOtherPosts = async () => {
      try {
        const entries = await client.getEntries({ content_type: "blog" });
        setOtherPosts(
          entries.items.filter((item) => item.fields.slug !== slug)
        );
      } catch (error) {
        console.error(error);
      }
    };

    getPost();
    getOtherPosts();
  }, [slug]);

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box className="blog-post" sx={{ padding: "20px" }}>
            {/* Post Title */}
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "light" }}
            >
              {post.title}
            </Typography>

            {/* Post Image */}
            {post?.image?.fields?.file?.url && (
              <Box sx={{ marginBottom: "20px" }}>
                <img
                  style={{ width: "100%", borderRadius: "8px" }}
                  src={post?.image?.fields?.file?.url}
                  alt={post.title}
                />
              </Box>
            )}

            {/* Author Information */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              {/* Avatar with tick */}
              <Box sx={{ position: "relative", marginRight: "15px" }}>
                <Avatar
                  src={post.author.fields.authorimage.fields.file.url}
                  alt={post.author.fields.name}
                  sx={{ width: 50, height: 50 }}
                />
                <CheckCircleIcon
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    fontSize: 18,
                    color: "#00C853", // Blue-green color
                    backgroundColor: "white", // Optional: add background color for better visibility
                    borderRadius: "50%",
                  }}
                />
              </Box>

              {/* Author Name and Created At */}
              <Box>
                <Typography
                  variant="subtitle1"
                  component="p"
                  sx={{ color: "grey" }}
                >
                  {post.author.fields.name}
                </Typography>
                <Typography
                  variant="caption"
                  component="p"
                  sx={{ color: "grey" }}
                >
                  {createdAt}
                </Typography>
              </Box>
            </Box>

            {/* Horizontal Line */}
            <hr style={{ marginBottom: "20px" }}></hr>

            {/* Post Content */}
            <Box sx={{ lineHeight: "1.8", fontSize: "1.1rem" }}>
              {documentToReactComponents(post.description, richTextOptions)}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box
            sx={{// Add your desired background color here
              padding: "20px",
              height: "100%"
            }}
          >
            <Typography sx={{color: '#777586'}} variant="h4" component="h2" gutterBottom>
              More Blogs
            </Typography>
            {otherPosts.map((otherPost) => (
              <Card key={otherPost.sys.id} style={{ marginBottom: "20px" }}>
                <CardContent>
                  <Typography sx={{color: '#777586'}} >{otherPost.fields.title}</Typography>
                  <Button
                    size="small"
                    color="primary"
                    component={Link}
                    to={`/blog/${otherPost.fields.slug}`}
                    variant="contained"
                    style={{ marginTop: "10px" }}
                  >
                    Read Blog
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default BlogPost;
