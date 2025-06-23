import express from "express";
import { getSettingsHandler, updateSettingsHandler, resetSettingsHandler } from "../controllers/settingController.js";
import { authenticate } from "../middlewares/auth.js";
import { requireAdmin } from "../middlewares/role.js";

const router = express.Router();

// Public routes
router.get("/", getSettingsHandler);

// Admin routes (protected)
router.put("/", authenticate, requireAdmin, updateSettingsHandler);
router.post("/reset", authenticate, requireAdmin, resetSettingsHandler);

export default router;
