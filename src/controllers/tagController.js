import {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
  getPostsByTagId,
} from "../services/tagService.js";

// Get all tags
export const getAllTagsHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const tags = await getAllTags(page, limit);
    res.status(200).json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ error: "Failed to fetch tags" });
  }
};

// Get tag by ID
export const getTagByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await getTagById(id);

    if (!tag) {
      return res.status(404).json({ error: "Tag not found" });
    }

    res.status(200).json(tag);
  } catch (error) {
    console.error("Error fetching tag:", error);
    res.status(500).json({ error: "Failed to fetch tag" });
  }
};

// Create a new tag
export const createTagHandler = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Tag name is required" });
    }

    const tag = await createTag(name);
    res.status(201).json(tag);
  } catch (error) {
    console.error("Error creating tag:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Tag with this name already exists" });
    }
    res.status(500).json({ error: "Failed to create tag" });
  }
};

// Update a tag
export const updateTagHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Tag name is required" });
    }

    const tag = await updateTag(id, name);
    res.json(tag);
  } catch (error) {
    console.error("Error updating tag:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Tag with this name already exists" });
    }
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Tag not found" });
    }
    res.status(500).json({ error: "Failed to update tag" });
  }
};

// Delete a tag
export const deleteTagHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteTag(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting tag:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Tag not found" });
    }
    if (error.message === "Cannot delete tag that is used in posts") {
      return res.status(400).json({ error: "Cannot delete tag that is used in posts" });
    }
    res.status(500).json({ error: "Failed to delete tag" });
  }
};

// Get posts by tag ID
export const getPostsByTagIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getPostsByTagId(id, page, limit);
    res.json(result);
  } catch (error) {
    console.error("Error fetching posts by tag:", error);
    res.status(500).json({ error: "Failed to fetch posts by tag" });
  }
};
