import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { registerUser } from "../services/authService";
import { getErrorMessage } from "../utils/format";
import { Notice } from "../components/Status";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  function update(event) { setForm((current) => ({ ...current, [event.target.name]: event.target.value })); }
  async function submit(event) {
    event.preventDefault(); setLoading(true); setError("");
    try { await registerUser(form); navigate("/login", { state: { registered: true } }); }
    catch (err) { setError(getErrorMessage(err, "Registration failed. Please try again.")); }
    finally { setLoading(false); }
  }
  return <main className="auth-page">
    <div className="auth-visual"><img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85" alt="Fashion collection" /><div className="auth-visual-note"><span>MAKE IT YOURS</span><strong>A wardrobe<br /><em>with intention.</em></strong></div></div>
    <div className="auth-form-wrap"><Link to="/" className="back-link"><ArrowLeft size={16} /> Back to the store</Link>
      <div className="auth-form-content"><span className="eyebrow">BECOME A MEMBER</span><h1>Your style.<br /><em>Your story.</em></h1><p className="muted">Create an account and discover a more considered way to dress.</p>
        <form onSubmit={submit} className="form-stack">
          <label htmlFor="username">Username</label><input id="username" name="username" value={form.username} onChange={update} placeholder="Choose a username" autoComplete="username" required />
          <label htmlFor="email">Email address</label><input id="email" name="email" type="email" value={form.email} onChange={update} placeholder="you@example.com" autoComplete="email" required />
          <label htmlFor="password">Password</label><input id="password" name="password" type="password" value={form.password} onChange={update} placeholder="At least 8 characters" autoComplete="new-password" minLength={8} required />
          <Notice>{error}</Notice><button className="button button-dark button-full" disabled={loading}>{loading ? "Creating account..." : "Create account"} <ArrowUpRight size={17} /></button>
        </form><p className="auth-switch">Already a member? <Link to="/login">Sign in</Link></p>
      </div><span className="auth-copyright">© 2026 ZYVORA. ALL RIGHTS RESERVED.</span>
    </div>
  </main>;
}
