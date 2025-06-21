import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
app.use(express.json());

// Swagger
const swaggerDocument = YAML.parse(fs.readFileSync('./swagger.yaml', 'utf8'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
