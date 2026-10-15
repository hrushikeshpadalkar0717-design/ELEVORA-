import express from 'express';
import multer from 'multer';
import { parseResumeFile } from '../controllers/uploadController.js';

const router = express.Router();

// Configure Multer for in-memory processing (up to 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ];
    if (
      allowed.includes(file.mimetype) ||
      file.originalname.endsWith('.pdf') ||
      file.originalname.endsWith('.docx') ||
      file.originalname.endsWith('.doc')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only .pdf, .docx, and .doc files are supported!'));
    }
  },
});

router.post('/resume', upload.single('resume'), parseResumeFile);

export default router;
