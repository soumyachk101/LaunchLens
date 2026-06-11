import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '2mb' })); // Support up to 2MB log sizes
app.use(express.urlencoded({ extended: true }));

// Routing API
app.get('/', (req, res) => {
  res.json({ message: 'LaunchLens API is running' });
});
app.use('/api', routes);

// Fallback for 404 Not Found
app.use((req, res, next) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route '${req.originalUrl}' not found`
    }
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
