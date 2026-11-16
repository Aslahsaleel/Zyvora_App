import { Outlet } from "react-router-dom";
import CustomerHeader from "../components/CustomerHeader";

export default function CustomerLayout() {
  return (
    <div className="customer-shell">
      <div className="announcement-bar">COMPLIMENTARY SHIPPING ON ORDERS OVER ₹2,999</div>
      <CustomerHeader />
      <Outlet />
      <footer className="store-footer">
        <div><span className="footer-brand">ZYVORA.</span><p>Considered fashion. A more personal point of view.</p></div>
        <div className="footer-meta"><span>© 2026 ZYVORA</span><span>MADE TO BE WORN, MADE TO LAST</span></div>
      </footer>
    </div>
  );
}
