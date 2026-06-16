import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SellPropertyModal from "./SellPropertyModal";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const irParaCatalogo = (e: React.MouseEvent) => {
    e.preventDefault(); setMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" }), 300);
    } else { document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" }); }
  };

  const handleBusca = (e: React.FormEvent) => {
    e.preventDefault();
    if (busca.trim()) { navigate(`/?busca=${encodeURIComponent(busca.trim())}`); setBusca(""); setMenuOpen(false); }
  };

  const isTransparentPage = location.pathname === "/" || location.pathname.startsWith("/imovel");
  const showSolid = scrolled || !isTransparentPage;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 h-[68px] flex items-center justify-between px-[6vw] transition-all duration-400 ${
        showSolid ? "bg-white/95 backdrop-blur-md border-b border-[#EA580C]/20 shadow-sm" : "bg-transparent"
      }`}>
        <Link to="/" className={`text-2xl font-bold tracking-tight no-underline transition-colors ${showSolid ? "text-gray-900" : "text-white"}`}>
          Raquel<span className="text-[#EA580C]">.</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8 list-none">
          <li><a href="#catalogo" onClick={irParaCatalogo} className={`text-xs font-medium uppercase tracking-wider no-underline transition-colors hover:text-[#EA580C] cursor-pointer ${showSolid ? "text-gray-500" : "text-white/75"}`}>Imóveis</a></li>
          <li><Link to="/sobre" className={`text-xs font-medium uppercase tracking-wider no-underline transition-colors hover:text-[#EA580C] ${showSolid ? "text-gray-500" : "text-white/75"}`}>Sobre</Link></li>
          <li><button onClick={() => setSellOpen(true)} className={`text-xs font-medium uppercase tracking-wider bg-transparent border-none cursor-pointer transition-colors hover:text-[#EA580C] ${showSolid ? "text-gray-500" : "text-white/75"}`}>Venda seu imóvel</button></li>
        </ul>

        <div className="hidden md:flex items-center gap-4">
          {isTransparentPage && (
            <form onSubmit={handleBusca} className="relative">
              <input type="text" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar imóvel..."
                className={`w-44 px-3 py-1.5 text-sm rounded-sm border transition-all focus:outline-none focus:w-56 ${
                  showSolid ? "border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-[#EA580C]" : "border-white/30 bg-white/10 text-white placeholder-white/50 focus:border-white/60"
                }`} />
            </form>
          )}
          <a href="https://wa.me/5554999999999?text=Olá!" target="_blank" rel="noopener noreferrer"
            className={`text-xs font-semibold uppercase tracking-wide px-5 py-2 rounded-sm border-[1.5px] transition-all cursor-pointer hover:bg-[#EA580C] hover:border-[#EA580C] hover:text-white ${
              showSolid ? "border-[#EA580C] text-[#EA580C]" : "border-white/50 text-white"
            }`}>Contato</a>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-1 ${showSolid ? "[&>span]:bg-gray-900" : "[&>span]:bg-white"}`}>
          <span className="block w-6 h-0.5 transition-all" /><span className="block w-6 h-0.5 transition-all" /><span className="block w-4 h-0.5 transition-all" />
        </button>

        {menuOpen && (
          <div className="absolute top-[68px] left-0 right-0 bg-white border-b border-gray-100 shadow-lg p-6 flex flex-col gap-4 md:hidden">
            <a href="#catalogo" onClick={irParaCatalogo} className="text-sm font-medium text-gray-700 no-underline hover:text-[#EA580C] cursor-pointer">Imóveis</a>
            <Link to="/sobre" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 no-underline hover:text-[#EA580C]">Sobre</Link>
            <button onClick={() => { setSellOpen(true); setMenuOpen(false); }} className="text-left text-sm font-medium text-[#EA580C] bg-transparent border-none cursor-pointer p-0">Venda seu imóvel</button>
            <a href="https://wa.me/5554999999999" target="_blank" rel="noopener noreferrer" className="text-center text-sm font-semibold uppercase tracking-wide px-5 py-2.5 bg-[#25D366] text-white rounded-sm no-underline">WhatsApp</a>
          </div>
        )}
      </nav>
      <SellPropertyModal aberto={sellOpen} onFechar={() => setSellOpen(false)} />
    </>
  );
}
