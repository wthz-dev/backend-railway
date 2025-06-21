/**
 * Middleware to validate post data
 * Checks for required fields and proper data types
 */
export const validatePost = (req, res, next) => {
  const { title, content, published, tags } = req.body;
  const errors = {};

  // Required fields validation
  if (!title || title.trim() === '') {
    errors.title = 'Title is required';
  } else if (title.length < 3 || title.length > 100) {
    errors.title = 'Title must be between 3 and 100 characters';
  }

  if (!content || content.trim() === '') {
    errors.content = 'Content is required';
  }

  // Tags validation (if provided)
  if (tags && !Array.isArray(tags)) {
    errors.tags = 'Tags must be an array';
  }

  // Published status validation (if provided)
  if (published !== undefined && typeof published !== 'boolean') {
    errors.published = 'Published status must be a boolean';
  }

  // If there are validation errors, return them
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  // If validation passes, proceed to the next middleware/controller
  next();
};