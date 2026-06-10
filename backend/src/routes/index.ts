import { Router } from 'express';
import sessionRoutes from './session.routes.js';

const router = Router();

// Route mappings
router.use('/sessions', sessionRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

export default router;
