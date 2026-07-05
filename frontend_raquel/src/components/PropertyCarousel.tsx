import { useEffect, useState } from "react";
import type { AgenciamentoResumo } from "../types";
import { agenciamentoService } from "../services/api";
import PropertyCard from "./PropertyCard";

export default function PropertyCarousel() {
  const [imoveis, setImoveis] = useState<AgenciamentoResumo[]>([]);
  useEffect(() => {
    agenciamentoService.listar({ size: 200, sort: "criadoEM,desc" })
      .then((p) => {
        // Curadoria da cliente: imóveis marcados como "destaque" no painel.
        // Fallback: se nenhum estiver marcado, mostra os 12 mais recentes.
        const marcados = p.content.filter((im) => im.destaque);
        setImoveis(marcados.length > 0 ? marcados : p.content.slice(0, 12));
      })
      .catch(() => {});
  }, []);
  if (!imoveis.length) return null;

  return (
    <section className="bg-white py-20 overflow-hidden border-y border-orange-50">
      <div className="px-[6vw] mb-10 flex items-baseline gap-4">
        <span className="text-[.72rem] tracking-[.12em] uppercase text-[#EA580C] font-semibold">Destaques</span>
        <h2 className="text-[clamp(1.4rem,2.2vw,1.8rem)] font-medium text-gray-900 tracking-tight">Agenciamentos recentes</h2>
      </div>
      <div className="relative overflow-hidden">
        <div className="flex gap-6 w-max animate-scroll hover:[animation-play-state:paused]">
          {[...imoveis, ...imoveis].map((im, i) => (
            <div key={`${im.id}-${i}`} className="w-[280px] flex-shrink-0"><PropertyCard imovel={im} /></div>
          ))}
        </div>
      </div>
    </section>
  );
}
