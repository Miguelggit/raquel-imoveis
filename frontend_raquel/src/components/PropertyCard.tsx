import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { AgenciamentoResumo } from "../types";
import { fotoService } from "../services/api";

interface PropertyCardProps { imovel: AgenciamentoResumo; }

export default function PropertyCard({ imovel }: PropertyCardProps) {
  const [foto, setFoto] = useState<string | null>(null);
  useEffect(() => { fotoService.listarPorAgenciamento(imovel.id).then((f) => { if (f.length) setFoto(fotoService.getUrlImagem(f[0].nomeArmazenado)); }).catch(() => {}); }, [imovel.id]);

  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

  return (
    <Link to={`/imovel/${imovel.id}`} className="block no-underline rounded-lg overflow-hidden bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#EA580C]/20">
      <div className="overflow-hidden relative">
        {foto ? <img src={foto} alt={imovel.titulo} className="w-full h-[230px] object-cover transition-transform duration-500 hover:scale-105" />
          : <div className="w-full h-[230px] flex items-center justify-center bg-gray-50 text-gray-300 text-sm">Sem foto</div>}
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#EA580C] text-white text-[.68rem] font-semibold uppercase tracking-wider rounded-sm">{imovel.tipoImovel}</span>
        {imovel.status === "RESERVADO" && <span className="absolute top-3 right-3 px-2.5 py-1 bg-amber-500 text-white text-[.68rem] font-semibold uppercase tracking-wider rounded-sm">Reservado</span>}
      </div>
      <div className="p-5">
        <p className="text-[.68rem] font-semibold uppercase tracking-wider mb-1 text-[#EA580C]">{imovel.codigoAgs}</p>
        <h3 className="text-[.95rem] font-medium mb-1 text-gray-900">{imovel.titulo}</h3>
        <p className="text-sm mb-3 text-gray-400">{imovel.bairro}, {imovel.cidade}</p>
        <div className="flex gap-4 text-[.78rem] mb-4 pb-4 border-b border-gray-100 text-gray-500">
          {imovel.areaM2 > 0 && <span>{imovel.areaM2}m²</span>}
          {imovel.quartos > 0 && <span>{imovel.quartos} {imovel.quartos === 1 ? "quarto" : "quartos"}</span>}
          {imovel.vagasGaragem > 0 && <span>{imovel.vagasGaragem} {imovel.vagasGaragem === 1 ? "vaga" : "vagas"}</span>}
        </div>
        <p className="text-xl font-bold text-[#EA580C]">{fmt(imovel.valorVenda)}</p>
      </div>
    </Link>
  );
}
