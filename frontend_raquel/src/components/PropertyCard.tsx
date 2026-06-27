import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { AgenciamentoResumo } from "../types";
import { fotoService } from "../services/api";

interface PropertyCardProps { imovel: AgenciamentoResumo; }

export default function PropertyCard({ imovel }: PropertyCardProps) {
  const [foto, setFoto] = useState<string | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    fotoService.listarPorAgenciamento(imovel.id)
      .then((f) => { if (f.length) setFoto(fotoService.getUrlImagem(f[0].nomeArmazenado)); })
      .catch(() => {});
  }, [imovel.id]);

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

  return (
    <Link
      to={`/imovel/${imovel.id}`}
      className="block no-underline rounded-xl overflow-hidden bg-white border border-[#EA580C]/15 shadow-[0_4px_16px_rgba(234,88,12,0.10)] transition-all duration-300 active:scale-[0.98] md:hover:-translate-y-2 md:hover:shadow-[0_12px_40px_rgba(234,88,12,0.18)] md:hover:border-[#EA580C]/35"
    >
      {/* Imagem */}
      <div className="overflow-hidden relative bg-gray-100">
        {foto ? (
          <>
            {!imgLoaded && <div className="w-full h-[200px] md:h-[220px] bg-gray-100 animate-pulse" />}
            <img
              src={foto}
              alt={imovel.titulo}
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-[200px] md:h-[220px] object-cover transition-all duration-500 md:hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0 absolute inset-0"}`}
            />
          </>
        ) : (
          <div className="w-full h-[200px] md:h-[220px] flex items-center justify-center bg-gray-50 text-gray-300 text-sm">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
          </div>
        )}
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#EA580C] text-white text-[.68rem] font-semibold uppercase tracking-wider rounded-md">
          {imovel.tipoImovel.replace("_", " ")}
        </span>
        {imovel.status === "RESERVADO" && (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500 text-white text-[.68rem] font-semibold uppercase tracking-wider rounded-md">Reservado</span>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-4 md:p-5">
        <p className="text-[.68rem] font-semibold uppercase tracking-wider mb-1 text-[#EA580C]">{imovel.codigoAgs}</p>
        <h3 className="text-[.95rem] font-medium mb-1 text-gray-900 leading-snug">{imovel.titulo}</h3>
        <p className="text-sm mb-3 text-gray-400">{imovel.bairro}, {imovel.cidade}</p>
        <div className="flex gap-3 text-[.78rem] mb-4 pb-4 border-b border-[#EA580C]/10 text-gray-500">
          {imovel.areaM2 > 0 && <span>{imovel.areaM2}m²</span>}
          {imovel.quartos > 0 && <span>{imovel.quartos} {imovel.quartos === 1 ? "quarto" : "quartos"}</span>}
          {imovel.vagasGaragem > 0 && <span>{imovel.vagasGaragem} {imovel.vagasGaragem === 1 ? "vaga" : "vagas"}</span>}
        </div>
        <p className="text-xl font-bold text-[#EA580C] tracking-tight">{fmt(imovel.valorVenda)}</p>
      </div>
    </Link>
  );
}
