import { Link } from "react-router-dom";import { FaInstagram } from 'react-icons/fa';

const InstagramIcon = () => <FaInstagram size={30} />;   

export default function Footer() {
  return (
    <footer className="bg-[#1C1008] text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#EA580C]/60 to-transparent" />
      <div className="absolute top-[-10%] right-[-5%] w-[350px] h-[350px] rounded-full bg-[#EA580C] opacity-[0.05] blur-[100px] pointer-events-none" />
      <div className="px-[6vw] py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link to="/" className="text-2xl font-bold tracking-tight no-underline text-white">Raquel<span className="text-[#EA580C]">.</span></Link>
            <p className="mt-4 text-sm text-white/50 leading-relaxed max-w-xs">Agenciamentos imobiliários em Caxias do Sul e região. Atendimento personalizado.</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[.12em] text-[#EA580C] mb-5">Navegação</h4>
            <ul className="list-none flex flex-col gap-3">
              <li><a href="/" className="text-sm text-white/50 no-underline hover:text-white transition-colors">Imóveis</a></li>
              <li><Link to="/sobre" className="text-sm text-white/50 no-underline hover:text-white transition-colors">Sobre</Link></li>
              <li><a href="https://wa.me/5554996582058" target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 no-underline hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[.12em] text-[#EA580C] mb-5">Contato</h4>
            <ul className="list-none flex flex-col gap-3">
              <li className="text-sm text-white/50">Caxias do Sul, RS</li>
              <li>
                <a href="tel:+5554996582058" className="text-sm text-white/50 no-underline hover:text-white transition-colors">(54) 9 9658-2058</a>
              </li>
              <li>
                <a href="mailto:raquelmarinhoimoveis25@gmail.com" className="text-sm text-white/50 no-underline hover:text-white transition-colors">raquelmarinhoimoveis25@gmail.com</a>
              </li>
              <li>
                <a href="https://instagram.com/raquelmarinhoimoveis" target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 no-underline hover:text-white transition-colors"> <div className="flex align-center gap-2">{InstagramIcon()} raquelmarinhoimoveis</div></a>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-12 text-[.7rem] text-white/30 leading-relaxed max-w-3xl">
          As informações e os valores dos imóveis são meramente informativos, podem sofrer alterações sem aviso prévio e não constituem oferta ou proposta comercial. Consulte a corretora para condições e valores atualizados.
        </p>
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">© {new Date().getFullYear()} Raquel Imóveis. Todos os direitos reservados.</p>
          <a href="https://www.stenix.com.br" target="_blank" rel="noopener noreferrer" className="no-underline flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
            <span className="text-xs text-white/70">Desenvolvido por</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 66" height="22" aria-label="Stenix">
              <polygon points="30,3 54,17 54,45 30,59 6,45 6,17" fill="#0D9488" stroke="#054D46" strokeWidth="2.5" strokeLinejoin="round"/>
              <polygon points="30,9 47,19 47,43 30,53 13,43 13,19" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" strokeLinejoin="round"/>
              <line x1="30" y1="31" x2="30" y2="11" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="30" y1="31" x2="14" y2="42" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="30" y1="31" x2="46" y2="42" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="30" cy="31" r="4.5" fill="#FFFFFF" opacity="0.95"/>
              <circle cx="30" cy="11" r="4" fill="#FFFFFF" opacity="0.9"/>
              <circle cx="14" cy="42" r="4" fill="#FFFFFF" opacity="0.9"/>
              <circle cx="46" cy="42" r="4" fill="#FFFFFF" opacity="0.9"/>
              <text x="68" y="40" fontFamily="'Sora', sans-serif" fontSize="32" fontWeight="600" letterSpacing="4" fill="#F1F5F9">STENIX</text>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
