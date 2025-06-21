import {
  getAllPosts,
  getAllPostsAdmin,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  getPostsByTag,
  getAllTags,
} from "../services/postService.js";
import slugify from "slugify";

// Get all posts with pagination
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const published = req.query.published === "false" ? false : true;
    const result = await getAllPosts(page, limit, published);
    res.json(result);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

export const getPostsAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await getAllPostsAdmin(page, limit);
    res.json(result);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// Get post by slug
export const getPostBySlugHandler = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await getPostBySlug(slug);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if post is published or user is admin
    if (!post.published && req.user?.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

// Create a new post
export const createPostHandler = async (req, res) => {
  try {
    const { title, content, slug, image, tags, published } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    // Generate slug from title if slug is not provided
    if (!slug) {
      slug = slugify(title, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      });
    }

    // console.log("User data:", req.user?.userId || req.user?.id);
    // Create the post
    const post = await createPost(
      { title, slug, content, image, tags, published },
      req.user?.userId || req.user?.id
    );

    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    if (error.code === "P2002" && error.meta?.target?.includes("slug")) {
      return res
        .status(409)
        .json({ error: "A post with this title already exists" });
    }
    res.status(500).json({ error: "Failed to create post" });
  }
};

// Update post
export const updatePostHandler = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, excerpt, content, image, tags, published } = req.body;

    // Check if post exists
    const existingPost = await getPostBySlug(slug);
    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if user is the author or admin
    if (
      existingPost.authorId !== req.user.userId &&
      req.user.role !== "ADMIN"
    ) {
      return res
        .status(403)
        .json({ error: "You do not have permission to update this post" });
    }

    // Generate new slug if title is provided
    let newSlug;
    if (title && title !== existingPost.title) {
      newSlug = slugify(title, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
      });
    }

    // Update the post
    const updatedPost = await updatePost(slug, {
      title,
      newSlug,
      excerpt,
      content,
      image,
      tags,
      published,
    });

    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    if (error.code === "P2002" && error.meta?.target?.includes("slug")) {
      return res
        .status(409)
        .json({ error: "A post with this title already exists" });
    }
    res.status(500).json({ error: "Failed to update post" });
  }
};

// Delete post
export const deletePostHandler = async (req, res) => {
  try {
    const { slug } = req.params;

    // Check if post exists
    const existingPost = await getPostBySlug(slug);
    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if user is the author or admin
    if (
      existingPost.authorId !== req.user.userId &&
      req.user.role !== "ADMIN"
    ) {
      return res
        .status(403)
        .json({ error: "You do not have permission to delete this post" });
    }

    // Delete the post
    await deletePost(slug);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
};

// Get posts by tag
export const getPostsByTagHandler = async (req, res) => {
  try {
    const { tag } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getPostsByTag(tag, page, limit);
    res.json(result);
  } catch (error) {
    console.error("Error fetching posts by tag:", error);
    res.status(500).json({ error: "Failed to fetch posts by tag" });
  }
};

// Get all tags
export const getTagsHandler = async (req, res) => {
  try {
    const tags = await getAllTags();
    res.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ error: "Failed to fetch tags" });
  }
};
