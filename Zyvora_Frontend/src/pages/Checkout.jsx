import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getCartItems } from "../services/cartService";
import { createPaymentOrder, verifyPayment } from "../services/paymentService";
import { formatPrice, getErrorMessage } from "../utils/format";
import { Loading, Notice } from "../components/Status";
import { useAuth } from "../context/AuthContext";

export default function Checkout() {
  const { user } = useAuth(); const navigate = useNavigate();
  const [cart, setCart] = useState([]); const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true); const [paying, setPaying] = useState(false);
  const [error, setError] = useState(""); const [message, setMessage] = useState("");
  useEffect(() => { getCartItems().then((data) => { setCart(data.cart?.products || []); setTotal(Number(data.cart?.overall_total_price || 0)); }).catch((err) => setError(getErrorMessage(err, "Unable to load your checkout."))).finally(() => setLoading(false)); }, []);
  function loadRazorpay() {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true); script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }
  async function pay() {
    setPaying(true); setError(""); setMessage("");
    try {
      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!key) throw new Error("Add your Razorpay public Key ID to the frontend .env file.");
      if (!cart.length || total <= 0) throw new Error("Your bag is empty.");
      if (!(await loadRazorpay())) throw new Error("Razorpay checkout could not load. Check your connection.");
      const payload = cart.map((item) => ({ productId: Number(item.product_id), quantity: Number(item.quantity), price: Number(item.price_per_unit) }));
      const orderId = await createPaymentOrder(total, payload);
      if (!orderId || typeof orderId !== "string") throw new Error("The server did not return a valid payment order.");
      const options = {
        key, amount: Math.round(total * 100), currency: "INR", name: "ZYVORA",
        description: "Fashion, considered.", order_id: orderId, prefill: { name: user.username },
        theme: { color: "#292923" },
        handler: async (payment) => {
          try { setMessage("Verifying your payment securely..."); await verifyPayment(payment); navigate("/payment-success", { replace: true }); }
          catch (err) { setError(getErrorMessage(err, "Payment verification failed. Please contact support.")); setPaying(false); }
        },
        modal: { ondismiss: () => setPaying(false) }
      };
      const checkout = new window.Razorpay(options);
      checkout.on("payment.failed", (event) => { setError(event.error?.description || "Payment failed. Please try again."); setPaying(false); });
      checkout.open();
    } catch (err) { setError(getErrorMessage(err, "Unable to start payment.")); setPaying(false); }
  }
  if (loading) return <Loading label="Preparing your checkout..." />;
  return <main className="checkout-page"><div className="page-topline"><span className="eyebrow">FINAL DETAILS</span><Link to="/cart"><ArrowLeft size={16} /> Back to bag</Link></div><h1>Almost <em>yours.</em></h1><p className="muted">Review your selection before completing your order.</p><Notice>{error}</Notice><Notice type="success">{message}</Notice>
    <div className="checkout-layout"><section className="checkout-items"><span className="eyebrow">YOUR SELECTION</span>{cart.map((item) => <div className="checkout-line" key={item.product_id}><div className="checkout-thumb">{item.image_url ? <img src={item.image_url} alt={item.name} /> : "Z."}</div><div><h3>{item.name}</h3><p>Quantity: {item.quantity}</p></div><strong>{formatPrice(item.total_price)}</strong></div>)}{!cart.length && <p>Your bag is empty. <Link to="/products">Explore the collection.</Link></p>}</section>
    <aside className="order-summary"><span className="eyebrow">PAYMENT SUMMARY</span><h2>One last look.</h2><div className="summary-row"><span>Subtotal</span><strong>{formatPrice(total)}</strong></div><div className="summary-row"><span>Shipping</span><span>Calculated by store</span></div><div className="summary-row summary-total"><strong>Total</strong><strong>{formatPrice(total)}</strong></div><div className="secure-note"><ShieldCheck size={17} /> Secure payment powered by Razorpay</div><button className="button button-dark button-full" disabled={paying || !cart.length} onClick={pay}>{paying ? "Processing..." : "Pay securely"} <span>↗</span></button></aside></div>
  </main>;
}
