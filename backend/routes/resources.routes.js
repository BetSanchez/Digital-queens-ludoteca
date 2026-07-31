import { Router } from 'express';
import {
  createResource,
  deleteResource,
  getResource,
  listResources,
  updateResource,
} from '../controllers/resources.controller.js';
import { uploadResourceFiles } from '../middleware/upload.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(listResources));
router.get('/:id', asyncHandler(getResource));
router.post('/', uploadResourceFiles, asyncHandler(createResource));
router.put('/:id', uploadResourceFiles, asyncHandler(updateResource));
router.delete('/:id', asyncHandler(deleteResource));

export default router;
