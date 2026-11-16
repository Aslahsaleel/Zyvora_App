import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { getCartItems, updateCartItem, removeCartItem } from "../services/cartService";
import { useAuth } from "../context/AuthContext";
import { formatPrice, getErrorMessage } from "../utils/format";
import { Loading, Notice } from "../components/Status";

export default function Cart() {
  const { user } = useAuth(); const navigate = useNavigate();
  const [items, setItems] = useState([]); const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true); const [busyId, setBusyId] = useState(null); const [error, setError] = useState("");
  async function loadCart() {
    try { const data = await getCartItems(); setItems(data.cart?.products || []); setTotal(Number(data.cart?.overall_total_price || 0)); }
    catch (err) { setError(getErrorMessage(err, "Unable to load your bag.")); }
    finally { setLoading(false); }
  }
  useEffect(() => { loadCart(); }, []);
  async function change(item, quantity) {
    if (quantity < 1) return;
    setBusyId(item.product_id); setError("");
    try { await updateCartItem(user.username, item.product_id, quantity); await loadCart(); }
    catch (err) { setError(getErrorMessage(err, "Unable to update quantity.")); }
    finally { setBusyId(null); }
  }
  async function remove(id) {
    setBusyId(id); setError("");
    try { await removeCartItem(user.username, id); await loadCart(); }
    catch (err) { setError(getErrorMessage(err, "Unable to remove this item.")); }
    finally { setBusyId(null); }
  }
  if (loading) return <Loading label="Opening your bag..." />;
  return <main className="cart-page"><div className="page-topline"><span className="eyebrow">YOUR SELECTION</span><Link to="/products"><ArrowLeft size={16} /> Continue shopping</Link></div><h1>Your <em>bag.</em></h1><p className="muted">A few good choices, all in one place.</p><Notice>{error}</Notice>
    {!items.length ? <div className="empty-state"><div className="empty-bag">Z.</div><h2>Your bag is taking a breather.</h2><p>Find something that feels like you.</p><Link className="button button-dark" to="/products">Explore the collection</Link></div> :
    <div className="cart-layout"><section className="cart-lines">{items.map((item) => <article className="cart-line" key={item.product_id}><div className="cart-line-image">{item.image_url ? <img src={item.image_url} alt={item.name} /> : <span>Z.</span>}</div><div className="cart-line-main"><span className="eyebrow">ZYVORA / {item.product_id}</span><h3>{item.name}</h3><p>{item.description}</p><strong>{formatPrice(item.price_per_unit)}</strong><div className="quantity-stepper"><button disabled={busyId === item.product_id || item.quantity <= 1} onClick={() => change(item, item.quantity - 1)} aria-label="Decrease quantity"><Minus size={14} /></button><span>{item.quantity}</span><button disabled={busyId === item.product_id} onClick={() => change(item, item.quantity + 1)} aria-label="Increase quantity"><Plus size={14} /></button></div></div><div className="cart-line-end"><strong>{formatPrice(item.total_price)}</strong><button className="remove-link" disabled={busyId === item.product_id} onClick={() => remove(item.product_id)}><Trash2 size={15} /> Remove</button></div></article>)}</section>
      <aside className="order-summary"><span className="eyebrow">THE TOTAL</span><h2>Order summary</h2><div className="summary-row"><span>Pieces</span><span>{items.length}</span></div><div className="summary-row"><span>Quantity</span><span>{items.reduce((sum, item) => sum + Number(item.quantity), 0)}</span></div><div className="summary-row summary-total"><strong>Subtotal</strong><strong>{formatPrice(total)}</strong></div><p className="summary-note">Shipping and any applicable taxes are calculated at checkout.</p><button className="button button-dark button-full" onClick={() => navigate("/checkout")}>Continue to checkout <span>↗</span></button></aside>
    </div>}
  </main>;
}
