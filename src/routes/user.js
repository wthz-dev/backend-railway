import express from 'express';
import { getUsers, getUserById, createUser, updateUserById, deleteUserById } from '../controllers/userController.js';
import { authenticate } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/role.js';

const router = express.Router();

// All user management routes require authentication
router.use(authenticate);

// Only admin can access user management routes
router.use(requireRole('ADMIN'));

// Get all users with pagination
router.get('/', getUsers);

// Get user by ID
router.get('/:id', getUserById);

// Create a new user
router.post('/', createUser);

// Update user
router.put('/:id', updateUserById);

// Delete user
router.delete('/:id', deleteUserById);

export default router;
