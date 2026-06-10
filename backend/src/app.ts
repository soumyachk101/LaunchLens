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
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

export default app;
