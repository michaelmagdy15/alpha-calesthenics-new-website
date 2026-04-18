import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { handlePaymentWebhook } from '../controllers/webhook.controller';
import { initiateCheckout } from '../controllers/payment.controller';
import { submitAssessment } from '../controllers/assessment.controller';
import { getPaidClients } from '../controllers/admin.controller';
import { uploadAssessmentVideo, streamVideo } from '../controllers/video.controller';

const router = Router();

// Ensure local uploads tmp folder exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const upload = multer({ dest: uploadDir });

// Payment Routes
router.post('/payment/initiate', initiateCheckout);

// Webhook Routes
router.post('/webhook/payment', handlePaymentWebhook);

// Assessment Routes
router.post('/assessment', submitAssessment);
router.post('/assessment/upload', upload.single('video'), uploadAssessmentVideo);

// Video Routes (Natively streaming)
router.get('/videos/:videoId', streamVideo);

// Admin Routes
router.get('/admin/clients', getPaidClients);

export default router;
