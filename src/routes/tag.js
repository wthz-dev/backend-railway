import express from "express";
import {
  getAllTagsHandler,
  getTagByIdHandler,
  createTagHandler,
  updateTagHandler,
  deleteTagHandler,
  getPostsByTagIdHandler,
} from "../controllers/tagController.js";
import { authenticate } from "../middlewares/auth.js";
import { requireAdmin } from "../middlewares/role.js";
import { validateTag } from "../middlewares/validateTag.js";

const router = express.Router();

// =============================================
// Public routes - ไม่ต้องล็อกอิน
// =============================================
router.get("/", getAllTagsHandler);           // ดูแท็กทั้งหมด
router.get("/:id", getTagByIdHandler);        // ดูแท็กตาม ID
router.get("/:id/posts", getPostsByTagIdHandler); // ดูโพสต์ตามแท็ก ID

// =============================================
// Protected routes - ต้องล็อกอินก่อน
// =============================================
router.use(authenticate);

// =============================================
// Admin routes - สำหรับผู้ดูแลระบบเท่านั้น
// =============================================
router.use(requireAdmin); // เฉพาะ admin เท่านั้นที่สามารถจัดการแท็กได้

router.post("/", validateTag, createTagHandler);       // สร้างแท็กใหม่
router.put("/:id", validateTag, updateTagHandler);     // แก้ไขแท็ก
router.delete("/:id", deleteTagHandler);               // ลบแท็ก

export default router;
