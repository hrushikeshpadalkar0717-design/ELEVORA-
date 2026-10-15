import express from 'express';
import {
  getUserResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  syncResumes,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All resume routes require authentication
router.use(protect);

router.route('/')
  .get(getUserResumes)
  .post(createResume);

router.post('/sync', syncResumes);

router.route('/:id')
  .get(getResumeById)
  .put(updateResume)
  .delete(deleteResume);

export default router;
