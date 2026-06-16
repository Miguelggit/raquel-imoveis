import { Link } from "react-router-dom";

export default function BrokerSection() {
  return (
    <section className="bg-[#FFF7ED] py-20 px-[6vw]">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
        <div className="flex-shrink-0">
          <div className="w-[220px] h-[280px] rounded-sm overflow-hidden bg-white border-2 border-[#EA580C]/15 shadow-sm">
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
              <div className="w-20 h-20 bg-[#EA580C] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">R</div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Foto da Raquel</p>
            </div>
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center gap-3 mb-4 justify-center md:justify-start">
            <span className="block w-8 h-[1.5px] bg-[#EA580C]" />
            <span className="text-[.72rem] font-medium uppercase tracking-[.14em] text-[#EA580C]">Sua corretora</span>
          </div>
          <blockquote className="text-[clamp(1.2rem,2vw,1.6rem)] font-medium text-gray-800 leading-relaxed mb-6">
            "Há 2 anos ajudando famílias a encontrarem o lar ideal em Caxias do Sul e região. Cada imóvel que apresento foi visitado e selecionado pessoalmente."
          </blockquote>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-[1px] bg-[#EA580C]" />
            <div>
              <p className="font-semibold text-gray-900">Raquel</p>
              <p className="text-sm text-gray-400">Corretora de Imóveis — CRECI XXXXX</p>
            </div>
          </div>
          <div className="mt-8">
            <a href="https://wa.me/5554999999999?text=Olá Raquel!" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#EA580C] text-white no-underline text-sm font-medium rounded-sm transition-all hover:bg-[#C2410C]">
              Converse com a Raquel
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
