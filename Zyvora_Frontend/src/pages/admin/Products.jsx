import { useState } from "react";
import { PackagePlus, Trash2 } from "lucide-react";
import { createProduct, deleteProduct } from "../../services/adminService";
import { getErrorMessage } from "../../utils/format";
import { Notice } from "../../components/Status";

const initial = { name: "", description: "", price: "", stock: "", categoryId: "", imageUrl: "" };
export default function AdminProducts() {
  const [form, setForm] = useState(initial); const [deleteId, setDeleteId] = useState("");
  const [busy, setBusy] = useState(false); const [notice, setNotice] = useState(""); const [error, setError] = useState("");
  function update(e) { setForm((current) => ({ ...current, [e.target.name]: e.target.value })); }
  async function submit(e) {
    e.preventDefault(); setBusy(true); setNotice(""); setError("");
    try {
      await createProduct({ ...form, price: Number(form.price), stock: Number(form.stock), categoryId: Number(form.categoryId) });
      setNotice("Product created successfully. It will appear in the customer collection when the backend returns it.");
      setForm(initial);
    } catch (err) { setError(getErrorMessage(err, "Unable to create product.")); }
    finally { setBusy(false); }
  }
  async function remove(e) {
    e.preventDefault(); setBusy(true); setNotice(""); setError("");
    try { const result = await deleteProduct(deleteId); setNotice(typeof result === "string" ? result : "Product deletion request completed."); setDeleteId(""); }
    catch (err) { setError(getErrorMessage(err, "Unable to delete product.")); }
    finally { setBusy(false); }
  }
  return <div><div className="admin-page-heading"><div><span className="eyebrow">CATALOGUE / 02</span><h1>Product <em>operations.</em></h1><p>Create fashion products and manage existing product IDs.</p></div></div><Notice type="success">{notice}</Notice><Notice>{error}</Notice>
    <div className="admin-form-grid"><section className="admin-panel"><div className="panel-heading"><div><span className="eyebrow">NEW ARRIVAL</span><h2>Add a product</h2></div><PackagePlus size={20} /></div><form className="admin-form" onSubmit={submit}>
      <label>Product name<input name="name" value={form.name} onChange={update} required placeholder="e.g. Linen blend shirt" /></label>
      <label>Description<textarea name="description" value={form.description} onChange={update} required rows="3" placeholder="Describe the fit, fabric and details" /></label>
      <div className="form-two-col"><label>Price (INR)<input name="price" type="number" min="0.01" step="0.01" value={form.price} onChange={update} required /></label><label>Stock quantity<input name="stock" type="number" min="0" step="1" value={form.stock} onChange={update} required /></label></div>
      <label>Category ID<input name="categoryId" type="number" min="1" step="1" value={form.categoryId} onChange={update} required placeholder="Existing database category ID" /></label>
      <label>Product image URL<input name="imageUrl" type="url" value={form.imageUrl} onChange={update} required placeholder="https://..." /></label>
      <p className="form-hint">Use a category ID that already exists in your Spring Boot database. The current backend accepts one image URL per new product.</p>
      <button className="button button-dark" disabled={busy}>{busy ? "Saving..." : "Create product"} <PackagePlus size={16} /></button>
    </form></section>
    <section className="admin-panel delete-panel"><div className="panel-heading"><div><span className="eyebrow">REMOVE FROM CATALOGUE</span><h2>Delete a product</h2></div><Trash2 size={20} /></div><p className="muted">Enter the product ID to remove the product and its associated image from the catalogue.</p><form className="admin-form" onSubmit={remove}><label>Product ID<input type="number" min="1" value={deleteId} onChange={(e) => setDeleteId(e.target.value)} required placeholder="Enter product ID" /></label><button className="button button-outline-danger" disabled={busy}>Delete product <Trash2 size={16} /></button></form><div className="admin-info-note">The current backend does not expose an admin product-list endpoint. This page therefore does not display an invented inventory table.</div></section></div>
  </div>;
}
