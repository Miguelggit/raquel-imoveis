import { useState, useEffect } from "react";
import type { AgenciamentoResumo } from "../types";
import { agenciamentoService } from "../services/api";
import PropertyCard from "./PropertyCard";
import FilterBar from "./FilterBar";

export default function Catalog() {
  const [imoveis, setImoveis] = useState<AgenciamentoResumo[]>([]);
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const SIZE = 9;

  const fetch_ = async (tipo: string, pg: number) => {
    setLoading(true); setImoveis([]);
    try {
      const r = await agenciamentoService.listar({ tipoImovel: tipo || undefined, page: pg, size: SIZE, sort: "criadoEM,desc" });
      setImoveis(r.content); setTotalPages(r.totalPages); setTotalElements(r.totalElements);
    } catch { setImoveis([]); setTotalPages(0); setTotalElements(0); }
    setLoading(false);
  };

  useEffect(() => { fetch_(tipoFiltro, page); }, [tipoFiltro, page]);

  return (
    <section id="catalogo" className="py-28 px-[6vw] bg-white">
      <div className="flex justify-between items-end mb-14 flex-wrap gap-6">
        <div>
          <h2 className="text-[clamp(1.8rem,2.8vw,2.5rem)] font-bold tracking-tight">Nossos agenciamentos</h2>
          <p className="text-sm text-gray-400 mt-1">{totalElements} {totalElements === 1 ? "imóvel disponível" : "imóveis disponíveis"}</p>
        </div>
        <FilterBar tipoAtivo={tipoFiltro} onTipoChange={(t) => { setTipoFiltro(t); setPage(0); }} />
      </div>
      {loading && <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#EA580C] border-t-transparent rounded-full animate-spin" /></div>}
      {!loading && imoveis.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(310px,1fr))] gap-7">
          {imoveis.map((im) => <PropertyCard key={im.id} imovel={im} />)}
        </div>
      )}
      {!loading && !imoveis.length && <div className="text-center py-20"><p className="text-gray-300 text-lg">Nenhum imóvel encontrado para este filtro.</p></div>}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-16">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="px-5 py-2.5 text-sm font-medium uppercase tracking-wide border border-gray-200 rounded-sm bg-transparent text-gray-600 cursor-pointer transition-all hover:border-[#EA580C] hover:text-[#EA580C] disabled:opacity-30 disabled:cursor-not-allowed">Anterior</button>
          <span className="text-sm text-gray-400">{page + 1} de {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="px-5 py-2.5 text-sm font-medium uppercase tracking-wide border border-gray-200 rounded-sm bg-transparent text-gray-600 cursor-pointer transition-all hover:border-[#EA580C] hover:text-[#EA580C] disabled:opacity-30 disabled:cursor-not-allowed">Próxima</button>
        </div>
      )}
    </section>
  );
}
