import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import YAML from "yaml";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/post.js";
import tagRoutes from "./routes/tag.js";
import settingRoutes from "./routes/setting.js";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

// Swagger
const swaggerDocument = YAML.parse(fs.readFileSync("./swagger.yaml", "utf8"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.get("/", (req, res) => {
  res.json({ message: "api ทำงานได้" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/settings", settingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`api ทำงานได้ที่ http://localhost:${PORT}`);
  console.log(`api-docs ทำงานได้ที่ http://localhost:${PORT}/docs`);
});
