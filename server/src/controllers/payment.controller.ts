import { Request, Response } from 'express';
import { PaymobService, PaymobBillingData } from '../services/paymob.service';
import { prisma } from '../utils/prisma';

// Pricing in Cents
const PACKAGE_PRICES: Record<string, number> = {
  'alpha-elite': 150000, // 1500 EGP
  'alpha-athlete': 80000,  // 800 EGP
};

/**
 * Initiate Paymob Checkout Flow
 * POST /api/payment/initiate
 */
export const initiateCheckout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { packageId, email, firstName, lastName, phone, city } = req.body;

    // Validate Package
    const amountCents = PACKAGE_PRICES[packageId];
    if (!amountCents) {
      res.status(400).json({ error: 'Invalid package ID' });
      return;
    }

    if (!email || !firstName || !lastName || !phone) {
      res.status(400).json({ error: 'Missing required customer details' });
      return;
    }

    // Step 1: Authenticate
    const token = await PaymobService.authenticate();

    // Step 2: Register Order
    const orderId = await PaymobService.registerOrder(token, amountCents);

    // Step 3: Generate Payment Key
    const integrationId = parseInt(process.env.PAYMOB_INTEGRATION_ID_CARD || '0');
    
    if (!integrationId) {
      throw new Error('PAYMOB_INTEGRATION_ID_CARD is not configured');
    }

    const billingData: PaymobBillingData = {
      email,
      first_name: firstName,
      last_name: lastName,
      phone_number: phone,
      city: city || 'Cairo',
      country: 'EG',
      street: 'N/A', // Required by Paymob
      state: city || 'Cairo',
    };

    const paymentKey = await PaymobService.generatePaymentKey(
      token,
      orderId,
      amountCents,
      integrationId,
      billingData
    );

    // Ensure user exists in our DB (upsert)
    await prisma.user.upsert({
      where: { email },
      update: { name: `${firstName} ${lastName}` },
      create: {
        email,
        name: `${firstName} ${lastName}`,
        status: 'PENDING'
      }
    });

    // Provide the iframe URL or just the token for the frontend to use
    // Paymob Iframe URL format: https://accept.paymob.com/api/acceptance/iframes/{{IFRAME_ID}}?payment_token={{PAYMENT_TOKEN}}
    const iframeId = process.env.PAYMOB_IFRAME_ID;
    const checkoutUrl = iframeId 
      ? `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentKey}`
      : null;

    res.status(200).json({
      message: 'Checkout initiated',
      paymentToken: paymentKey,
      orderId,
      checkoutUrl
    });
  } catch (error: any) {
    console.error('Checkout Initiation Error:', error);
    res.status(500).json({ error: 'Failed to initiate checkout', details: error.message });
  }
};
