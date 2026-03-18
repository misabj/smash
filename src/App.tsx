import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import CartToast from "./components/CartToast";
import { useCart } from "./context/CartContext";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMenu from "./pages/admin/AdminMenu";
import AdminOrders from "./pages/admin/AdminOrders";

export default function App() {
  const { toasts, dismissToast } = useCart();

  return (
    <div className="bg-[var(--color-dark)] text-white min-h-screen">
      <ScrollToTop />
      <CartToast toasts={toasts} onDismiss={dismissToast} />
      <Routes>
        {/* Admin routes — no Navbar/Footer */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        {/* Public routes */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <CartDrawer />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/track" element={<TrackOrderPage />} />
                <Route path="/track/:code" element={<TrackOrderPage />} />
              </Routes>
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
}
