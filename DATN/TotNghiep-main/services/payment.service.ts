// services/payment.service.ts
import axios from './axios';

export const checkoutCart = (cartId: number) =>
  axios.post(
    `/api/payment/checkout/cart/${cartId}/online-payment`
  );
