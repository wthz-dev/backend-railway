import express from "express";
import {
  getPosts,
  getPostBySlugHandler,
  createPostHandler,
  updatePostHandler,
  deletePostHandler,
  getPostsByTagHandler,
  getTagsHandler,
  getPostsAdmin,
} from "../controllers/postController.js";
import { authenticate } from "../middlewares/auth.js";
import { requireAdmin, requireAuthor } from "../middlewares/role.js";
import { validatePost } from "../middlewares/validatePost.js";

const router = express.Router();

// =============================================
// Public routes - ไม่ต้องล็อกอิน
// =============================================
router.get("/", getPosts);
router.get("/:slug", getPostBySlugHandler);

// =============================================
// Protected routes - ต้องล็อกอินก่อน
// =============================================
router.use(authenticate);

// =============================================
// User routes - สำหรับผู้ใช้ทั่วไป (ต้องล็อกอิน)
// =============================================
// ผู้ใช้ทั่วไปสามารถสร้างโพสต์ได้
router.post("/", createPostHandler);

// ผู้ใช้สามารถแก้ไข/ลบโพสต์ของตัวเองได้
router.get("/get-post-by-slug/:slug", getPostBySlugHandler);
router.put("/update-post-by-slug/:slug", validatePost, updatePostHandler);
router.delete("/delete-post-by-slug/:slug", deletePostHandler);

// =============================================
// Admin routes - สำหรับผู้ดูแลระบบเท่านั้น
// =============================================
// Admin สามารถดูโพสต์ทั้งหมด (รวมถึงที่ยังไม่เผยแพร่)
router.get("/admin/get-all-posts", requireAdmin, getPostsAdmin);

// Admin สามารถแก้ไข/ลบโพสต์ใดๆ ก็ได้
router.put("/admin/:slug", requireAdmin, validatePost, updatePostHandler);
router.delete("/admin/:slug", requireAdmin, deletePostHandler);

export default router;
