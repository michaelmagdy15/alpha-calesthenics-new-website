import { Router } from 'express';
import { handlePaymentWebhook } from '../controllers/webhook.controller';
import { initiateCheckout } from '../controllers/payment.controller';
import { submitAssessment } from '../controllers/assessment.controller';
import { getPaidClients } from '../controllers/admin.controller';

const router = Router();

// Payment Routes
router.post('/payment/initiate', initiateCheckout);

// Webhook Routes
router.post('/webhook/payment', handlePaymentWebhook);

// Assessment Routes
router.post('/assessment', submitAssessment);

// Admin Routes
router.get('/admin/clients', getPaidClients);

export default router;
