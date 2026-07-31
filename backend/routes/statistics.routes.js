import { Router } from 'express';
import { getStatistics } from '../controllers/statistics.controller.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(getStatistics));

export default router;
