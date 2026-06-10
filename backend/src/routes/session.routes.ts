import { Router } from 'express';
import { createSession, submitInput, analyzeSession } from '../controllers/session.controller.js';

const router = Router();

router.post('/', createSession);
router.post('/:id/input', submitInput);
router.post('/:id/analyze', analyzeSession);

export default router;
