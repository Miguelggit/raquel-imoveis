import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import HomePage from "./pages/Homepage";
import PropertyPage from "./pages/Propertypage";
import AboutPage from "./pages/Aboutpage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminForm from "./pages/admin/AdminForm";
import AdminPhotos from "./pages/admin/AdminPhotos";
import { useLocation } from "react-router-dom";

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Header />}
      <main>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/imovel/:id" element={<PropertyPage />} />
          <Route path="/sobre" element={<AboutPage />} />
          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/novo" element={<AdminForm />} />
          <Route path="/admin/editar/:id" element={<AdminForm />} />
          <Route path="/admin/fotos/:id" element={<AdminPhotos />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppButton fixo />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
