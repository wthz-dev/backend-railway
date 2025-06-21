import { createUser, findUserByEmail } from '../services/authService.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser(email, hashedPassword);
  res.json(user);
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  res.json({ token });
};
