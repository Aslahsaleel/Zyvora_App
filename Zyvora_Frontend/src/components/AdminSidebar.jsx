import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, Users, ChartNoAxesCombined, Store } from "lucide-react";
import Brand from "./Brand";

const links = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/reports", label: "Business reports", icon: ChartNoAxesCombined }
];

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-brand"><Brand /><span className="admin-label">STUDIO / ADMIN</span></div>
      <div className="admin-side-caption">WORKSPACE</div>
      <nav className="admin-side-nav">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => isActive ? "active" : ""}>
            <Icon size={18} strokeWidth={1.7} /><span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="admin-sidebar-bottom"><Store size={17} /><span>ZYVORA COMMERCE</span></div>
    </aside>
  );
}
