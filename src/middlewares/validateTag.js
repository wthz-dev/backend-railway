/**
 * Middleware to validate tag data
 * Checks for required fields and proper data types
 */
export const validateTag = (req, res, next) => {
  const { name } = req.body;
  const errors = {};

  // Required fields validation
  if (!name) {
    errors.name = "Tag name is required";
  } else if (typeof name !== "string") {
    errors.name = "Tag name must be a string";
  } else if (name.trim().length === 0) {
    errors.name = "Tag name cannot be empty";
  } else if (name.trim().length > 50) {
    errors.name = "Tag name cannot exceed 50 characters";
  }

  // If there are validation errors, return them
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  // Clean up the tag name - trim whitespace
  req.body.name = name.trim();
  
  next();
};
