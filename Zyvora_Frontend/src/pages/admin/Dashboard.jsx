import { useEffect, useState } from "react";
import { ArrowUpRight, BadgeIndianRupee, ChartNoAxesCombined, Package, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { getOverallBusiness } from "../../services/adminService";
import { formatPrice, getErrorMessage } from "../../utils/format";
import { Loading, Notice } from "../../components/Status";

export default function Dashboard() {
  const [report, setReport] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { getOverallBusiness().then(setReport).catch((err) => setError(getErrorMessage(err, "Unable to load business overview."))).finally(() => setLoading(false)); }, []);
  if (loading) return <Loading label="Preparing your business overview..." />;
  const categories = Object.entries(report?.categorySales || {});
  return <div><div className="admin-page-heading"><div><span className="eyebrow">OVERVIEW / 01</span><h1>Business <em>at a glance.</em></h1><p>A considered view of your store's performance.</p></div><Link className="button button-dark" to="/admin/reports">View reports <ArrowUpRight size={16} /></Link></div><Notice>{error}</Notice>
    <div className="metric-grid"><article className="metric-card metric-featured"><div><span className="metric-label">TOTAL BUSINESS</span><BadgeIndianRupee size={20} /></div><strong>{formatPrice(report?.totalBusiness)}</strong><p>Overall successful order value</p></article><article className="metric-card"><div><span className="metric-label">CATEGORIES SOLD</span><ChartNoAxesCombined size={20} /></div><strong>{categories.length}</strong><p>Categories with recorded sales</p></article><article className="metric-card"><div><span className="metric-label">UNITS SOLD</span><Package size={20} /></div><strong>{categories.reduce((sum, [, count]) => sum + Number(count), 0)}</strong><p>Total quantity across categories</p></article></div>
    <section className="admin-panel"><div className="panel-heading"><div><span className="eyebrow">PERFORMANCE BREAKDOWN</span><h2>Category sales</h2></div><ShoppingBag size={20} /></div>{categories.length ? <div className="category-sales">{categories.map(([name, count]) => <div className="sales-row" key={name}><span>{name || "Uncategorised"}</span><div className="sales-track"><i style={{ width: `${Math.max(4, Number(count) / Math.max(...categories.map(([, v]) => Number(v))) * 100)}%` }} /></div><strong>{count}</strong></div>)}</div> : <p className="muted">No category sales have been recorded yet.</p>}</section>
    <div className="admin-shortcuts"><Link to="/admin/products"><Package size={18} /><span><strong>Product operations</strong><small>Add new fashion pieces or remove an existing product.</small></span><ArrowUpRight size={17} /></Link><Link to="/admin/customers"><ShoppingBag size={18} /><span><strong>Customer records</strong><small>Update a customer record using its user ID.</small></span><ArrowUpRight size={17} /></Link></div>
  </div>;
}
