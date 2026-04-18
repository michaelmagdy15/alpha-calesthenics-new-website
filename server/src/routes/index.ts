import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { uploadAssessmentVideo } from '../controllers/video.controller';

const router = Router();

// Ensure local uploads tmp folder exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

// Video Upload Route
router.post('/assessment/upload', upload.single('video'), uploadAssessmentVideo);

export default router;
