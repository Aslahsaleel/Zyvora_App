import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/format";
import { Notice } from "../components/Status";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true); setError("");
    try {
      const user = await signIn(username.trim(), password);
      const requested = location.state?.from?.pathname;
      navigate(requested || (user.role === "ADMIN" ? "/admin" : "/"), { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, "We couldn't sign you in. Check your details and try again."));
    } finally { setLoading(false); }
  }

  return <main className="auth-page">
    <div className="auth-visual"><img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85" alt="Fashion editorial portrait" /><div className="auth-visual-note"><span>THE ZYVORA EDIT</span><strong>Wear what<br /><em>moves you.</em></strong></div></div>
    <div className="auth-form-wrap">
      <Link to="/" className="back-link"><ArrowLeft size={16} /> Back to the store</Link>
      <div className="auth-form-content"><span className="eyebrow">WELCOME BACK</span><h1>Good to see<br /><em>you again.</em></h1><p className="muted">Sign in to continue your ZYVORA experience.</p>
        <form onSubmit={handleSubmit} className="form-stack">
          <label htmlFor="username">Username</label><input id="username" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your username" required />
          <label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required />
          <Notice>{error}</Notice>
          <button className="button button-dark button-full" disabled={loading}>{loading ? "Signing you in..." : "Sign in"} <ArrowUpRight size={17} /></button>
        </form>
        <p className="auth-switch">New to ZYVORA? <Link to="/register">Create an account</Link></p>
      </div>
      <span className="auth-copyright">© 2026 ZYVORA. ALL RIGHTS RESERVED.</span>
    </div>
  </main>;
}
