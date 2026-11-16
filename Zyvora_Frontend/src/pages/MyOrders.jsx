import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, PackageCheck } from "lucide-react";
import { getMyOrders } from "../services/orderService";
import { formatPrice, getErrorMessage } from "../utils/format";
import { Loading, Notice } from "../components/Status";

export default function MyOrders() {
  const [orders, setOrders] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => { getMyOrders().then((data) => setOrders(data.products || [])).catch((err) => setError(getErrorMessage(err, "Unable to load your orders."))).finally(() => setLoading(false)); }, []);
  const grouped = Object.values(orders.reduce((acc, item) => {
    const id = item.order_id;
    if (!acc[id]) acc[id] = { orderId: id, items: [], total: 0 };
    acc[id].items.push(item); acc[id].total += Number(item.total_price || 0); return acc;
  }, {}));
  if (loading) return <Loading label="Finding your orders..." />;
  return <main className="orders-page"><span className="eyebrow">YOUR ZYVORA JOURNEY</span><h1>Order <em>history.</em></h1><p className="muted">Every piece you've chosen, all in one place.</p><Notice>{error}</Notice>
    {!grouped.length ? <div className="empty-state"><PackageCheck size={34} /><h2>No orders just yet.</h2><p>Your purchases will find their home here.</p><Link className="button button-dark" to="/products">Discover the collection</Link></div> :
    <div className="orders-list">{grouped.map((order) => <article className="order-card" key={order.orderId}><div className="order-card-top"><div><span className="eyebrow">ORDER REFERENCE</span><strong>#{order.orderId}</strong></div><span className="order-status">PAYMENT SUCCESSFUL</span></div><div className="order-card-body"><div className="order-thumbs">{order.items.slice(0, 4).map((item, index) => <div key={`${item.product_id}-${index}`}>{item.image_url ? <img src={item.image_url} alt={item.name} /> : "Z."}</div>)}</div><div className="order-card-total"><span>{order.items.length} piece(s)</span><strong>{formatPrice(order.total)}</strong></div><button className="text-link" onClick={() => navigate(`/order-details/${encodeURIComponent(order.orderId)}`, { state: { orderItems: order.items } })}>View details <ArrowUpRight size={16} /></button></div></article>)}</div>}
  </main>;
}
