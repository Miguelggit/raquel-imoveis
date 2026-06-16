import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import HomePage from "./pages/Homepage";
import PropertyPage from "./pages/Propertypage";
import AboutPage from "./pages/Aboutpage";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/imovel/:id" element={<PropertyPage />} />
          <Route path="/sobre" element={<AboutPage />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton fixo />
    </BrowserRouter>
  );
}