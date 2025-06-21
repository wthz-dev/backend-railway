export const requireRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
};

export const requireAdmin = requireRole("ADMIN");
export const requireUser = requireRole("USER");
export const requireEditor = requireRole("EDITOR");
export const requireAuthor = requireRole("AUTHOR");
export const requireSubscriber = requireRole("SUBSCRIBER");
export const requireContributor = requireRole("CONTRIBUTOR");
