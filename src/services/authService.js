import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = (email, password) => {
  return prisma.user.create({ data: { email, password } });
};

export const findUserByEmail = (email) => {
  return prisma.user.findUnique({ where: { email } });
};
