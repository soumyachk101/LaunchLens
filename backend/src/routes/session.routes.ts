import { Router } from 'express';
import { 
  createSession, 
  submitInput, 
  analyzeSession,
  getSessions,
  getSessionStats,
  getSessionById,
  updateSessionStatus
} from '../controllers/session.controller.js';

const router = Router();

router.get('/', getSessions);
router.get('/stats', getSessionStats);
router.get('/:id', getSessionById);

router.post('/', createSession);
router.post('/:id/input', submitInput);
router.post('/:id/analyze', analyzeSession);

router.patch('/:id', updateSessionStatus);

export default router;
