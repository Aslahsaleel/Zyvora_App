import { Outlet, useNavigate } from "react-router-dom";
import { LogOut, ExternalLink } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  async function logout() {
    await signOut();
    navigate("/login");
  }
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-main">
        <header className="admin-topbar">
          <div><span className="admin-top-eyebrow">ZYVORA / CONTROL ROOM</span><strong>Good day, {user?.username || "Administrator"}</strong></div>
          <div className="admin-top-actions">
            <a href="/" target="_blank" rel="noreferrer"><ExternalLink size={16} /> View store</a>
            <button onClick={logout}><LogOut size={16} /> Sign out</button>
          </div>
        </header>
        <main className="admin-content"><Outlet /></main>
      </div>
    </div>
  );
}
