import React, { useEffect, useState } from "react";
import { createClient } from "contentful";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  CircularProgress,
  IconButton,
  Box,
} from "@mui/material";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import "./testimonial.css";

function Testimonial() {
  const richTextOptions = {
    renderNode: {
      [INLINES.EMBEDDED_ENTRY]: (node) => {
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
      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
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
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
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

  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState({}); // Track expanded testimonials

  const client = createClient({
    space: "gcyv19fvsawd",
    accessToken: "hQYLhHjVz9EJv9-3cpYKOqxOTkJq1h7Fr0gArAHhEnw",
  });

  useEffect(() => {
    const getAllEntries = async () => {
      try {
        const entries = await client.getEntries({
          content_type: "testimonials",
        });
        setTestimonials(entries.items);
      } catch (error) {
        console.error("Error fetching entries:", error);
      } finally {
        setLoading(false);
      }
    };

    getAllEntries();
  }, []);

  const toggleExpand = (id) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return (
      <Container maxWidth="lg" className="testimonial-list">
        <CircularProgress />
        <Typography variant="h6" component="div">
          Loading testimonials...
        </Typography>
      </Container>
    );
  }

  if (testimonials.length === 0) {
    return (
      <Container maxWidth="lg" className="testimonial-list">
        <Typography variant="h6" component="div">
          No testimonials available.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className="testimonial-list">
      <br />
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        style={{ fontFamily: "'Georgia', serif", color: "#4A4A4A" }}
      >
        Testimonials
      </Typography>
      <Grid container spacing={3} direction="column">
        {testimonials.map((testimonial) => (
          <Grid item key={testimonial.sys.id}>
            <Card
              style={{
                backgroundColor: "#FAF3E0",
                border: "1px solid #D3CBB8",
                borderRadius: "8px",
              }}
            >
              <CardContent>
                <Box>
                  <div
                    style={{
                      maxHeight: expandedIds[testimonial.sys.id]
                        ? "none"
                        : "100px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "1rem",
                      lineHeight: "1.6",
                      color: "#3E3E3E",
                    }}
                  >
                    {documentToReactComponents(
                      testimonial.fields.testimonial,
                      richTextOptions
                    )}
                  </div>
                  <div
                    style={{
                      backgroundColor: "#EFE7DA",
                    }}
                  >
                    <IconButton
                      onClick={() => toggleExpand(testimonial.sys.id)}
                      sx={{
                        color: "#6B4226",
                        display: "block",
                        margin: "10px auto 0",
                      }}
                    >
                      {expandedIds[testimonial.sys.id] ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Testimonial;
