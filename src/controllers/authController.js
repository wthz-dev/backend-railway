import {
  createUser,
  findUserByEmail,
  saveRefreshToken,
  getUserById,
} from "../services/authService.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateTokens } from "../utils/jwt.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await createUser(name, email, hashed);
  res.json(user);
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const payload = { userId: user.id, email: user.email, role: user.role };
  const { accessToken, refreshToken } = generateTokens(payload);

  await saveRefreshToken(user.id, refreshToken);

  res.json({ accessToken, refreshToken });
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await findUserByEmail(payload.email);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    await saveRefreshToken(user.id, tokens.refreshToken);
    res.json({
      accessToken: tokens.accessToken,
      newRefreshToken: tokens.refreshToken,
    });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const me = async (req, res) => {
  const user = await getUserById(req.user.userId);
  res.json(user);
};
