import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from '../config/env';

export const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

export async function createOrder(amountPaise: number, receipt: string) {
  return razorpay.orders.create({
    amount: amountPaise,       // Razorpay uses paise (1 INR = 100 paise)
    currency: env.RAZORPAY_CURRENCY,
    receipt,
    payment_capture: true,
  });
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
}
