import { Check } from "lucide-react";
import { Link } from "react-router-dom";
export default function PaymentSuccess() {
  return <main className="success-page"><div className="success-mark"><Check size={30} /></div><span className="eyebrow">ORDER CONFIRMED</span><h1>Thank you.<br /><em>Good choice.</em></h1><p>Your payment has been verified. Your ZYVORA purchase is now confirmed.</p><div className="success-actions"><Link className="button button-dark" to="/my-orders">View my orders</Link><Link className="text-link" to="/products">Continue exploring ↗</Link></div></main>;
}
