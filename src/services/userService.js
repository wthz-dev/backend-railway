import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all users with pagination
export const getAllUsers = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        // Don't include password or refreshToken for security
      },
      orderBy: {
        id: 'asc',
      },
    }),
    prisma.user.count(),
  ]);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

// Get user by ID
export const getUserDetails = async (id) => {
  return prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      // Don't include password or refreshToken for security
    },
  });
};

// Create a new user
export const createUserByAdmin = async (name, email, password, role) => {
  return prisma.user.create({
    data: {
      name,
      email,
      password,
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

// Update user
export const updateUser = async (id, data) => {
  const updateData = {};
  
  // Only include fields that are provided
  if (data.name) updateData.name = data.name;
  if (data.email) updateData.email = data.email;
  if (data.password) updateData.password = data.password;
  if (data.role) updateData.role = data.role;
  
  return prisma.user.update({
    where: { id: Number(id) },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};

// Delete user
export const deleteUser = async (id) => {
  return prisma.user.delete({
    where: { id: Number(id) },
  });
};
