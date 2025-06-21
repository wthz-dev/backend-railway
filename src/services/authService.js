import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUser = (name, email, password) => {
  return prisma.user.create({ data: { name, email, password } });
};

export const findUserByEmail = (email) => {
  return prisma.user.findUnique({ where: { email } });
};

export const saveRefreshToken = (userId, token) => {
  return prisma.user.update({
    where: { id: userId },
    data: { refreshToken: token },
  });
};

export const getUserById = (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
};
