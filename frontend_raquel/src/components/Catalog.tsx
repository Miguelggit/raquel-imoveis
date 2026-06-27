import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import type { AgenciamentoResumo } from "../types";
import { agenciamentoService } from "../services/api";
import PropertyCard from "./PropertyCard";
import FilterBar from "./FilterBar";

function CardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden bg-white border border-[#EA580C]/10 shadow-sm animate-pulse">
      <div className="w-full h-[200px] bg-gray-100" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-2.5 bg-gray-100 rounded w-1/4" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="flex gap-3 mt-1">
          <div className="h-3 bg-gray-100 rounded w-10" />
          <div className="h-3 bg-gray-100 rounded w-10" />
          <div className="h-3 bg-gray-100 rounded w-10" />
        </div>
        <div className="h-5 bg-gray-100 rounded w-1/3 mt-2" />
      </div>
    </div>
  );
}

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [imoveis, setImoveis] = useState<AgenciamentoResumo[]>([]);
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [buscaInput, setBuscaInput] = useState(searchParams.get("busca") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const SIZE = 9;

  const busca = searchParams.get("busca") ?? "";

  useEffect(() => {
    setBuscaInput(searchParams.get("busca") ?? "");
  }, [searchParams]);

  const handleBuscaChange = (value: string) => {
    setBuscaInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const p = new URLSearchParams();
      if (value.trim()) p.set("busca", value.trim());
      setSearchParams(p, { replace: true });
      setPage(0);
    }, 300);
  };

  const limparBusca = () => {
    setBuscaInput("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSearchParams({}, { replace: true });
    setPage(0);
  };

  const fetch_ = async (tipo: string, pg: number, q: string) => {
    setLoading(true);
    try {
      const r = await agenciamentoService.listar({
        tipoImovel: tipo || undefined,
        page: q ? 0 : pg,
        size: q ? 200 : SIZE,
        sort: "criadoEM,desc",
      });
      if (q) {
        const termo = q.toLowerCase();
        const filtrados = r.content.filter((im) =>
          [im.titulo, im.cidade, im.bairro, im.tipoImovel].join(" ").toLowerCase().includes(termo)
        );
        setImoveis(filtrados);
        setTotalPages(1);
        setTotalElements(filtrados.length);
      } else {
        setImoveis(r.content);
        setTotalPages(r.totalPages);
        setTotalElements(r.totalElements);
      }
    } catch {
      setImoveis([]); setTotalPages(0); setTotalElements(0);
    }
    setLoading(false);
    setInitialLoad(false);
  };

  useEffect(() => {
    fetch_(tipoFiltro, page, busca);
  }, [tipoFiltro, page, busca]);

  const mostrarSkeleton = loading && initialLoad;
  const mostrarCards = !mostrarSkeleton && imoveis.length > 0;
  const mostrarVazio = !loading && !initialLoad && imoveis.length === 0;

  return (
    <section id="catalogo" className="py-14 md:py-28 px-4 sm:px-[6vw] bg-gradient-to-b from-[#FAF4EE] via-[#FFF7ED] to-[#FAF4EE]">

      {/* Cabeçalho: empilhado no mobile, lado a lado no desktop */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-5 md:gap-6 mb-8 md:mb-14">
        <div>
          <h2 className="text-[clamp(1.6rem,2.8vw,2.5rem)] font-bold tracking-tight">Nossos agenciamentos</h2>
          <p className="text-sm text-gray-400 mt-1 transition-all duration-300">
            {busca
              ? `${totalElements} ${totalElements === 1 ? "resultado" : "resultados"} para "${busca}"`
              : `${totalElements} ${totalElements === 1 ? "imóvel disponível" : "imóveis disponíveis"}`}
          </p>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          {/* Campo de busca */}
          <div className="relative w-full md:w-80">
            <svg
              className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${loading && buscaInput ? "text-[#EA580C]" : "text-gray-400"}`}
              width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={buscaInput}
              onChange={(e) => handleBuscaChange(e.target.value)}
              placeholder="Buscar por título, bairro, cidade..."
              className="w-full pl-9 pr-8 py-3 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 outline-none focus:border-[#EA580C] focus:bg-white focus:shadow-[0_0_0_3px_rgba(234,88,12,0.08)] transition-all duration-200"
            />
            {buscaInput && (
              <button
                onClick={limparBusca}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500 hover:text-gray-700 border-none cursor-pointer transition-all duration-150 text-xs"
              >✕</button>
            )}
          </div>

          {/* Barra de progresso sutil ao buscar */}
          <div className="w-full md:w-80 h-[2px] rounded-full overflow-hidden bg-transparent">
            <div className={`h-full bg-[#EA580C] rounded-full transition-all duration-500 ${loading ? "w-full opacity-40" : "w-0 opacity-0"}`} />
          </div>

          <FilterBar tipoAtivo={tipoFiltro} onTipoChange={(t) => { setTipoFiltro(t); setPage(0); }} />
        </div>
      </div>

      {/* Skeleton no carregamento inicial */}
      {mostrarSkeleton && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      )}

      {/* Cards com fade enquanto recarrega */}
      {mostrarCards && (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7 transition-opacity duration-300 ${loading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
          {imoveis.map((im) => <PropertyCard key={im.id} imovel={im} />)}
        </div>
      )}

      {/* Estado vazio */}
      {mostrarVazio && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </div>
          <p className="text-gray-300 text-base">
            {busca ? `Nenhum imóvel encontrado para "${busca}".` : "Nenhum imóvel encontrado para este filtro."}
          </p>
          {busca && (
            <button onClick={limparBusca} className="mt-3 text-sm text-[#EA580C] bg-transparent border-none cursor-pointer hover:underline">
              Limpar busca
            </button>
          )}
        </div>
      )}

      {/* Paginação */}
      {!busca && totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2.5 text-sm font-medium uppercase tracking-wide border border-gray-200 rounded-lg bg-transparent text-gray-600 cursor-pointer transition-all hover:border-[#EA580C] hover:text-[#EA580C] disabled:opacity-30 disabled:cursor-not-allowed"
          >Anterior</button>
          <span className="text-sm text-gray-400 min-w-[80px] text-center">{page + 1} de {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-4 py-2.5 text-sm font-medium uppercase tracking-wide border border-gray-200 rounded-lg bg-transparent text-gray-600 cursor-pointer transition-all hover:border-[#EA580C] hover:text-[#EA580C] disabled:opacity-30 disabled:cursor-not-allowed"
          >Próxima</button>
        </div>
      )}
    </section>
  );
}
