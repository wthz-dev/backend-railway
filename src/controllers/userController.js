import { getAllUsers, getUserDetails, createUserByAdmin, updateUser, deleteUser } from '../services/userService.js';
import bcrypt from 'bcrypt';

// Get all users with pagination
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await getAllUsers(page, limit);
    res.json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserDetails(Number(id));
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required' });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create the user
    const user = await createUserByAdmin(name, email, hashedPassword, role);
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Update user
export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    
    // Check if user exists
    const existingUser = await getUserDetails(Number(id));
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (password) {
      // Hash the new password
      updateData.password = await bcrypt.hash(password, 10);
    }
    
    // Update the user
    const updatedUser = await updateUser(Number(id), updateData);
    res.json(updatedUser);
  } catch (error) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user
export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const existingUser = await getUserDetails(Number(id));
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Delete the user
    await deleteUser(Number(id));
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
