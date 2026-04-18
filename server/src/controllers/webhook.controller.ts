import { Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../utils/prisma';

/**
 * Verify Paymob HMAC Signature
 * @param payload The entire request body from Paymob
 * @param hmacFromQuery The HMAC string from the query parameters
 * @returns boolean
 */
const verifyPaymobHmac = (payload: any, hmacFromQuery: string): boolean => {
  const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
  if (!hmacSecret) {
    console.error('PAYMOB_HMAC_SECRET is not configured');
    return false;
  }

  // The transaction data is nested under 'obj' key in the callback
  const transaction = payload.obj;
  if (!transaction) return false;

  // List of fields to concatenate in specific order for HMAC calculation
  // Note: Boolean values must be strings "true" or "false"
  const fields = [
    transaction.amount_cents,
    transaction.created_at,
    transaction.currency,
    transaction.error_occured,
    transaction.has_parent_transaction,
    transaction.id,
    transaction.integration_id,
    transaction.is_3d_secure,
    transaction.is_auth,
    transaction.is_capture,
    transaction.is_refunded,
    transaction.is_standalone_payment,
    transaction.is_voided,
    transaction.order?.id || transaction.order, // order can be an object or id
    transaction.owner,
    transaction.pending,
    transaction.source_data?.pan,
    transaction.source_data?.sub_type,
    transaction.source_data?.type,
    transaction.success,
  ];

  // Concatenate all values into a single string
  const concatenatedString = fields.join('');

  // Calculate HMAC SHA512
  const calculatedHmac = crypto
    .createHmac('sha512', hmacSecret)
    .update(concatenatedString)
    .digest('hex');

  return calculatedHmac === hmacFromQuery;
};

/**
 * Handle successful payment webhook from Paymob
 * POST /api/webhook/payment
 */
export const handlePaymentWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const hmacFromQuery = req.query.hmac as string;
    
    // 1. Securely verify the payload signature
    if (!hmacFromQuery || !verifyPaymobHmac(req.body, hmacFromQuery)) {
      console.warn('Invalid Paymob HMAC signature received');
      res.status(401).json({ error: 'Invalid signature' });
      return;
    }

    const { obj: transaction } = req.body;
    const success = transaction.success === true || transaction.success === 'true';
    const email = transaction.billing_data?.email;
    const orderId = transaction.order?.id || transaction.order;

    if (!success) {
      console.info(`Payment failed for order ${orderId}`);
      res.status(200).json({ message: 'Callback received for failed payment' });
      return;
    }

    if (!email) {
      console.error('Email missing in Paymob billing_data');
      res.status(400).json({ error: 'Email missing' });
      return;
    }

    // 2. Update user status to PAID in the database
    const user = await prisma.user.update({
      where: { email },
      data: { status: 'PAID' }
    });

    console.log(`Successfully processed payment for user: ${email}, order: ${orderId}`);
    
    res.status(200).json({ 
      success: true, 
      message: 'Payment confirmed and user updated',
      userId: user.id 
    });
  } catch (error: any) {
    console.error('Error handling Paymob webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};
