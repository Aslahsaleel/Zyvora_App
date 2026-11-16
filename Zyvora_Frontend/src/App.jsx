import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import Dashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminCustomers from "./pages/admin/Customers";
import Reports from "./pages/admin/Reports";

function StoreHome() {
  const { user } = useAuth();
  return user?.role === "ADMIN" ? <Navigate to="/admin" replace /> : <Home />;
}
function IndexRedirect() {
  const { user } = useAuth();
  return <Navigate to={user?.role === "ADMIN" ? "/admin" : "/"} replace />;
}
function AppRoutes() {
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route element={<CustomerLayout />}>
      <Route path="/" element={<StoreHome />} />
      <Route element={<ProtectedRoute role="CUSTOMER" />}>
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/order-details/:orderId" element={<OrderDetails />} />
      </Route>
    </Route>
    <Route element={<ProtectedRoute role="ADMIN" />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Route>
    <Route path="*" element={<IndexRedirect />} />
  </Routes>;
}
export default function App() {
  return <AuthProvider><BrowserRouter><AppRoutes /></BrowserRouter></AuthProvider>;
}
