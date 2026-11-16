import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { formatPrice } from "../utils/format";

export default function OrderDetails() {
  const { orderId } = useParams(); const { state } = useLocation(); const navigate = useNavigate();
  const items = state?.orderItems || [];
  if (!items.length) return <main className="orders-page"><h1>Order <em>details.</em></h1><p className="muted">Open this order from your order history to view its purchased items.</p><button className="button button-dark" onClick={() => navigate("/my-orders")}>Back to my orders</button></main>;
  const total = items.reduce((sum, item) => sum + Number(item.total_price || 0), 0);
  return <main className="orders-page"><div className="page-topline"><span className="eyebrow">ORDER REFERENCE / {orderId}</span><Link to="/my-orders"><ArrowLeft size={16} /> Back to orders</Link></div><h1>The details.</h1><p className="muted">Payment status: <span className="order-status">SUCCESSFUL</span></p><div className="detail-items">{items.map((item, index) => <article className="detail-item" key={`${item.product_id}-${index}`}><div className="checkout-thumb">{item.image_url ? <img src={item.image_url} alt={item.name} /> : "Z."}</div><div><h3>{item.name}</h3><p>{item.description}</p><p>Quantity: {item.quantity} · Unit price: {formatPrice(item.price_per_unit)}</p></div><strong>{formatPrice(item.total_price)}</strong></article>)}</div><div className="detail-total"><span>ORDER TOTAL</span><strong>{formatPrice(total)}</strong></div></main>;
}
