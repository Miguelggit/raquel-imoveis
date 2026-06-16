import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="px-[6vw] py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link to="/" className="text-2xl font-bold tracking-tight no-underline text-white">Raquel<span className="text-[#EA580C]">.</span></Link>
            <p className="mt-4 text-sm text-white/50 leading-relaxed max-w-xs">Agenciamentos imobiliários em Caxias do Sul e região. Atendimento personalizado.</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[.12em] text-[#EA580C] mb-5">Navegação</h4>
            <ul className="list-none flex flex-col gap-3">
              <li><a href="#catalogo" className="text-sm text-white/50 no-underline hover:text-white transition-colors">Imóveis</a></li>
              <li><Link to="/sobre" className="text-sm text-white/50 no-underline hover:text-white transition-colors">Sobre</Link></li>
              <li><a href="https://wa.me/5554999999999" target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 no-underline hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[.12em] text-[#EA580C] mb-5">Contato</h4>
            <ul className="list-none flex flex-col gap-3">
              <li className="text-sm text-white/50">Caxias do Sul, RS</li>
              <li><a href="tel:+5554999999999" className="text-sm text-white/50 no-underline hover:text-white transition-colors">(54) 9 9999-9999</a></li>
              <li><a href="mailto:contato@raquelimoveis.com.br" className="text-sm text-white/50 no-underline hover:text-white transition-colors">contato@raquelimoveis.com.br</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">© {new Date().getFullYear()} Raquel Imóveis. Todos os direitos reservados.</p>
          <p className="text-xs text-white/30">Desenvolvido por <a href="https://stenix.com.br" target="_blank" rel="noopener noreferrer" className="text-[#EA580C] no-underline hover:underline">Stenix</a></p>
        </div>
      </div>
    </footer>
  );
}
