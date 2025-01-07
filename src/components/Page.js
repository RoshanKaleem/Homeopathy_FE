import React, { useEffect, useState } from "react";
import { createClient } from "contentful";
import { useParams } from "react-router-dom";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import {
  Container,
  Grid,
  Typography,
  Box,
} from "@mui/material";

function Page() {
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
          content_type: "pages",
          "fields.slug": slug,
        });
        setPost(entry.items[0].fields);
        console.log(entry.items)
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
        const entries = await client.getEntries({ content_type: "page" });
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
        <Grid item xs={12} md={12}>
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

            {/* Horizontal Line */}
            <hr style={{ marginBottom: "20px" }}></hr>

            {/* Post Content */}
            <Box sx={{ lineHeight: "1.8", fontSize: "1.1rem" }}>
              {documentToReactComponents(post.description, richTextOptions)}
            </Box>
          </Box>
        </Grid>
        
      </Grid>
    </Container>
  );
}

export default Page;
