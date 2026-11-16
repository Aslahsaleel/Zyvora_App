import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, UserRound, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Brand from "./Brand";

export default function CustomerHeader() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  return (
    <header className="store-header">
      <div className="store-header-inner">
        <button className="icon-button mobile-menu-button" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <Brand />
        <nav className={`store-nav${open ? " store-nav-open" : ""}`}>
          <NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>Shop</NavLink>
          {user && <NavLink to="/my-orders" onClick={() => setOpen(false)}>My orders</NavLink>}
        </nav>
        <div className="header-tools">
          {user ? (
            <>
              <span className="header-greeting">Hello, {user.username}</span>
              <Link className="icon-button" to="/cart" aria-label="Shopping bag"><ShoppingBag size={19} /></Link>
              <button className="icon-button logout-icon" onClick={handleLogout} aria-label="Sign out"><LogOut size={18} /></button>
            </>
          ) : (
            <Link className="header-account" to="/login"><UserRound size={17} /> Sign in</Link>
          )}
        </div>
      </div>
    </header>
  );
}
