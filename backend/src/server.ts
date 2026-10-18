import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import analyzeRoutes from './routes/analyzeRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API routes
app.use('/api', analyzeRoutes);

// Root greeting
app.get('/', (req, res) => {
  res.json({
    name: 'AI Resume Analyzer Backend API',
    status: 'online',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// Centralized error handler
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`  AI Resume Analyzer Backend Service Running   `);
  console.log(`  Port: http://localhost:${PORT}                 `);
  console.log(`  Health: http://localhost:${PORT}/api/health    `);
  console.log(`  LLM Provider: ${config.llmProvider}           `);
  console.log(`===============================================`);
});

export default app;
