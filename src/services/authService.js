import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = (email, password) => {
  return prisma.user.create({ data: { email, password } });
};

export const findUserByEmail = (email) => {
  return prisma.user.findUnique({ where: { email } });
};

export const saveRefreshToken = (userId, token) => {
  return prisma.user.update({
    where: { id: userId },
    data: { refreshToken: token }
  })
}