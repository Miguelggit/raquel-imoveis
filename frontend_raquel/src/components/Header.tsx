import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SellPropertyModal from "./SellPropertyModal";
import { authService } from "../services/api";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [busca, setBusca] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Só aparece para quem está logada (a Raquel). Reavalia a cada troca de página.
  const logada = authService.isLoggedIn();

  // Transparente apenas no topo da home (sobre o Hero) e com menu fechado
  const transparent = location.pathname === "/" && !scrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const irParaCatalogo = (e: React.MouseEvent) => {
    e.preventDefault(); setMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" }), 300);
    } else { document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" }); }
  };

  const handleBuscaChange = (value: string) => {
    setBusca(value);
    if (location.pathname === "/") {
      const p = new URLSearchParams();
      if (value.trim()) p.set("busca", value.trim());
      navigate(`/?${p}`, { replace: true });
    }
  };

  const handleBuscaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (busca.trim()) { navigate(`/?busca=${encodeURIComponent(busca.trim())}`); setBusca(""); setMenuOpen(false); }
  };

  const navLink = transparent
    ? "text-white/85 hover:text-white"
    : "text-gray-500 hover:text-[#EA580C]";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-[68px] flex items-center justify-between px-4 sm:px-[6vw] transition-all duration-300 ${
          transparent
            ? "bg-transparent border-b border-transparent"
            : "bg-[#FFFDF9]/96 backdrop-blur-md border-b border-[#EA580C]/15 shadow-[0_2px_16px_rgba(234,88,12,0.08)]"
        }`}
      >
        {/* Logo / marca RM */}
        <Link to="/" className="flex items-center gap-2.5 no-underline group">
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#EA580C] text-white text-sm font-bold tracking-tight shadow-sm shadow-[#EA580C]/30 transition-transform group-hover:scale-105">
            RM
          </span>
          <span className="flex flex-col leading-none">
            <span className={`text-[1.05rem] font-bold tracking-tight transition-colors ${transparent ? "text-white" : "text-gray-900"}`}>
              Raquel Marinho
            </span>
            <span className={`text-[.55rem] font-semibold uppercase tracking-[.22em] transition-colors ${transparent ? "text-white/60" : "text-[#EA580C]"}`}>
              Imóveis
            </span>
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-8 list-none">
          <li><a href="#catalogo" onClick={irParaCatalogo} className={`text-xs font-medium uppercase tracking-wider no-underline transition-colors cursor-pointer ${navLink}`}>Imóveis</a></li>
          <li><Link to="/sobre" className={`text-xs font-medium uppercase tracking-wider no-underline transition-colors ${navLink}`}>Sobre</Link></li>
          <li><button onClick={() => setSellOpen(true)} className={`text-xs font-medium uppercase tracking-wider bg-transparent border-none cursor-pointer transition-colors ${navLink}`}>Venda seu imóvel</button></li>
        </ul>

        <div className="hidden md:flex items-center gap-4">
          {location.pathname === "/" && (
            <form onSubmit={handleBuscaSubmit} className="relative">
              <input type="text" value={busca} onChange={(e) => handleBuscaChange(e.target.value)} placeholder="Buscar imóvel..."
                className={`w-44 px-3 py-1.5 text-sm rounded-lg outline-none transition-all focus:w-56 ${
                  transparent
                    ? "border border-white/40 bg-white/10 text-white placeholder-white/60 backdrop-blur-sm focus:border-white focus:bg-white/20"
                    : "border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:border-[#EA580C] focus:bg-white"
                }`} />
            </form>
          )}
          <a href="https://wa.me/5554996582058?text=Olá!" target="_blank" rel="noopener noreferrer"
            className={`text-xs font-semibold uppercase tracking-wide px-5 py-2 rounded-lg border-[1.5px] transition-all cursor-pointer no-underline ${
              transparent
                ? "border-white/70 text-white hover:bg-white hover:text-gray-900"
                : "border-[#EA580C] text-[#EA580C] hover:bg-[#EA580C] hover:text-white"
            }`}>Contato</a>
          {logada && (
            <Link to="/admin"
              className={`text-xs font-semibold uppercase tracking-wide px-4 py-2 rounded-lg transition-all no-underline ${
                transparent
                  ? "bg-white/15 text-white border border-white/40 hover:bg-white/25"
                  : "bg-[#EA580C]/10 text-[#EA580C] hover:bg-[#EA580C] hover:text-white"
              }`}>Painel</Link>
          )}
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-2 ${transparent ? "[&>span]:bg-white" : "[&>span]:bg-gray-900"}`}>
          <span className="block w-6 h-0.5 transition-all" /><span className="block w-6 h-0.5 transition-all" /><span className="block w-4 h-0.5 transition-all" />
        </button>

        {menuOpen && (
          <div className="absolute top-[68px] left-0 right-0 bg-white border-b border-gray-100 shadow-lg p-6 flex flex-col gap-4 md:hidden">
            <a href="#catalogo" onClick={irParaCatalogo} className="text-sm font-medium text-gray-700 no-underline hover:text-[#EA580C] cursor-pointer">Imóveis</a>
            <Link to="/sobre" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 no-underline hover:text-[#EA580C]">Sobre</Link>
            <button onClick={() => { setSellOpen(true); setMenuOpen(false); }} className="text-left text-sm font-medium text-[#EA580C] bg-transparent border-none cursor-pointer p-0">Venda seu imóvel</button>
            <a href="https://wa.me/5554996582058" target="_blank" rel="noopener noreferrer" className="text-center text-sm font-semibold uppercase tracking-wide px-5 py-2.5 bg-[#25D366] text-white rounded-sm no-underline">WhatsApp</a>
            {logada && (
              <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-center text-sm font-semibold uppercase tracking-wide px-5 py-2.5 bg-[#EA580C] text-white rounded-sm no-underline">Painel administrativo</Link>
            )}
          </div>
        )}
      </nav>
      <SellPropertyModal aberto={sellOpen} onFechar={() => setSellOpen(false)} />
    </>
  );
}
