import api from "./api";

export async function createPaymentOrder(totalAmount, cartItems) {
  const { data } = await api.post("/api/payment/create", { totalAmount, cartItems });
  return data;
}
export async function verifyPayment(payment) {
  const { data } = await api.post("/api/payment/verify", {
    razorpayOrderId: payment.razorpay_order_id,
    razorpayPaymentId: payment.razorpay_payment_id,
    razorpaySignature: payment.razorpay_signature
  });
  return data;
}
