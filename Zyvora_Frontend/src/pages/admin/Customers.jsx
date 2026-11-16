import { useState } from "react";
import { UserRoundPen } from "lucide-react";
import { modifyUser } from "../../services/adminService";
import { getErrorMessage } from "../../utils/format";
import { Notice } from "../../components/Status";

const empty = { userId: "", username: "", email: "", role: "CUSTOMER" };
export default function AdminCustomers() {
  const [form, setForm] = useState(empty); const [busy, setBusy] = useState(false); const [notice, setNotice] = useState(""); const [error, setError] = useState("");
  function update(e) { setForm((current) => ({ ...current, [e.target.name]: e.target.value })); }
  async function submit(e) {
    e.preventDefault(); setBusy(true); setNotice(""); setError("");
    try { const result = await modifyUser(form); setNotice(`Updated ${result.username || form.username} successfully.`); setForm(empty); }
    catch (err) { setError(getErrorMessage(err, "Unable to update this user.")); }
    finally { setBusy(false); }
  }
  return <div><div className="admin-page-heading"><div><span className="eyebrow">CUSTOMER RECORDS / 03</span><h1>People, <em>not numbers.</em></h1><p>Update an existing user record with the details provided by your customer support workflow.</p></div></div><Notice type="success">{notice}</Notice><Notice>{error}</Notice>
    <section className="admin-panel customer-edit-panel"><div className="panel-heading"><div><span className="eyebrow">EDIT USER RECORD</span><h2>Modify a customer</h2></div><UserRoundPen size={21} /></div><form className="admin-form" onSubmit={submit}>
      <label>User ID<input name="userId" type="number" min="1" value={form.userId} onChange={update} required placeholder="Existing user ID" /></label>
      <div className="form-two-col"><label>Username<input name="username" value={form.username} onChange={update} required placeholder="Updated username" /></label><label>Email address<input name="email" type="email" value={form.email} onChange={update} required placeholder="name@example.com" /></label></div>
      <label>Account role<select name="role" value={form.role} onChange={update}><option value="CUSTOMER">CUSTOMER</option><option value="ADMIN">ADMIN</option></select></label>
      <p className="form-hint">Your backend provides a modify-user endpoint, but does not provide an admin endpoint to list all users. Enter the user ID and full updated details manually. Assign ADMIN only to trusted staff.</p>
      <button className="button button-dark" disabled={busy}>{busy ? "Updating..." : "Save user changes"} <UserRoundPen size={16} /></button>
    </form></section>
  </div>;
}
