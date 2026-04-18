import axios from 'axios';

export interface PaymobBillingData {
  apartment?: string;
  email: string;
  floor?: string;
  first_name: string;
  street: string;
  building?: string;
  phone_number: string;
  shipping_method?: string;
  postal_code?: string;
  city: string;
  country: string;
  last_name: string;
  state: string;
}

export interface PaymobOrderResponse {
  id: number;
  created_at: string;
  delivery_needed: boolean;
  merchant: any;
  collector: any;
  amount_cents: number;
  currency: string;
  is_payment_locked: boolean;
  is_return: boolean;
  is_cancel: boolean;
  is_returned: boolean;
  is_canceled: boolean;
  merchant_order_id: string | null;
  items: any[];
}

export class PaymobService {
  private static baseUrl = 'https://accept.paymob.com/api';
  private static apiKey = process.env.PAYMOB_API_KEY || '';

  /**
   * Step 1: Authentication Request
   * Returns an authentication token, which is valid for 60 minutes.
   */
  static async authenticate(): Promise<string> {
    try {
      const response = await axios.post(`${this.baseUrl}/auth/tokens`, {
        api_key: this.apiKey,
      });
      return response.data.token;
    } catch (error: any) {
      console.error('Paymob Auth Error:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Paymob');
    }
  }

  /**
   * Step 2: Order Registration
   * Registers the order to Paymob's database.
   */
  static async registerOrder(token: string, amountCents: number, currency: string = 'EGP'): Promise<number> {
    try {
      const response = await axios.post(`${this.baseUrl}/ecommerce/orders`, {
        auth_token: token,
        delivery_needed: false,
        amount_cents: amountCents,
        currency: currency,
        items: [],
      });
      return response.data.id;
    } catch (error: any) {
      console.error('Paymob Order Registration Error:', error.response?.data || error.message);
      throw new Error('Failed to register order with Paymob');
    }
  }

  /**
   * Step 3: Payment Key Generation
   * Generates a payment key used to initiate the payment.
   */
  static async generatePaymentKey(
    token: string,
    orderId: number,
    amountCents: number,
    integrationId: number,
    billingData: PaymobBillingData,
    currency: string = 'EGP'
  ): Promise<string> {
    try {
      const response = await axios.post(`${this.baseUrl}/ecommerce/payment_keys`, {
        auth_token: token,
        amount_cents: amountCents,
        expiration: 3600, // 1 hour
        order_id: orderId,
        billing_data: billingData,
        currency: currency,
        integration_id: integrationId,
      });
      return response.data.token;
    } catch (error: any) {
      console.error('Paymob Payment Key Error:', error.response?.data || error.message);
      throw new Error('Failed to generate Paymob payment key');
    }
  }
}
