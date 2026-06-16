import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import type { Agenciamento, AgenciamentoResumo, Foto } from "../types";
import { agenciamentoService, fotoService } from "../services/api";
import WhatsAppButton from "../components/WhatsAppButton";
import PropertyCard from "../components/PropertyCard";

export default function PropertyPage() {
  const { id } = useParams<{ id: string }>();
  const [imovel, setImovel] = useState<Agenciamento | null>(null);
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [outros, setOutros] = useState<AgenciamentoResumo[]>([]);
  const [fa, setFa] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    if (!id) return;
    const n = parseInt(id);
    setLoading(true);
    setFa(0);

    Promise.all([
      agenciamentoService.buscarPorId(n),
      fotoService.listarPorAgenciamento(n),
      agenciamentoService.listar({ size: 12, sort: "criadoEM,desc" }),
    ])
      .then(([ag, ft, page]) => {
        setImovel(ag);
        setFotos(ft);
        setOutros(page.content.filter((im) => im.id !== n).slice(0, 4));
      })
      .catch(() => setErro(true))
      .finally(() => setLoading(false));
  }, [id]);

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center pt-[68px]">
        <div className="w-10 h-10 border-2 border-[#EA580C] border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (erro || !imovel)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-[68px] gap-6">
        <span className="text-4xl">🏠</span>
        <p className="text-gray-400 text-lg">Imóvel não encontrado.</p>
        <Link to="/" className="px-6 py-3 bg-[#EA580C] text-white no-underline text-sm font-semibold rounded-sm">
          ← Voltar
        </Link>
      </div>
    );

  const mainUrl = fotos.length > 0 ? fotoService.getUrlImagem(fotos[fa].nomeArmazenado) : null;

  return (
    <div className="min-h-screen bg-white">
      {/* ══ GALERIA ══ */}
      <section className="relative w-full h-[65vh] min-h-[450px] max-h-[650px] bg-gray-100">
        {mainUrl ? (
          <>
            <img src={mainUrl} alt={imovel.titulo} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            {fotos.length > 1 && (
              <>
                <button
                  onClick={() => setFa((p) => (p - 1 + fotos.length) % fotos.length)}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 border-none rounded-full flex items-center justify-center cursor-pointer text-gray-800 text-xl shadow-md transition-all hover:bg-[#EA580C] hover:text-white"
                >
                  ‹
                </button>
                <button
                  onClick={() => setFa((p) => (p + 1) % fotos.length)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 border-none rounded-full flex items-center justify-center cursor-pointer text-gray-800 text-xl shadow-md transition-all hover:bg-[#EA580C] hover:text-white"
                >
                  ›
                </button>
              </>
            )}
            <div className="absolute bottom-4 left-6">
              <span className="px-3 py-1.5 bg-white/90 rounded-sm text-gray-800 text-xs font-medium shadow-sm">
                {fa + 1} / {fotos.length}
              </span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl">📷</span>
          </div>
        )}
      </section>

      {/* Thumbnails */}
      {fotos.length > 1 && (
        <div className="flex gap-2 px-6 py-3 overflow-x-auto bg-gray-50 border-b border-gray-100">
          {fotos.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setFa(i)}
              className={`flex-shrink-0 w-[90px] h-[60px] rounded-sm overflow-hidden border-2 transition-all cursor-pointer ${
                i === fa ? "border-[#EA580C]" : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <img src={fotoService.getUrlImagem(f.nomeArmazenado)} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* ══ CONTEÚDO ══ */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-10">
          <Link to="/" className="no-underline text-gray-400 hover:text-[#EA580C]">Home</Link>
          <span className="text-gray-300">/</span>
          <Link to="/#catalogo" className="no-underline text-gray-400 hover:text-[#EA580C]">Imóveis</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-600 truncate max-w-[200px]">{imovel.titulo}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          {/* Coluna principal */}
          <div className="flex flex-col gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4 flex-wrap">
                <span className="px-3 py-1 bg-[#EA580C] text-white text-[.68rem] font-semibold uppercase tracking-wider rounded-sm">{imovel.tipoImovel}</span>
                <span className="px-3 py-1 bg-[#EA580C]/10 text-[#EA580C] text-[.68rem] font-semibold uppercase tracking-wider rounded-sm">{imovel.codigoAgs}</span>
                {imovel.status === "RESERVADO" && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[.68rem] font-semibold uppercase tracking-wider rounded-sm">Reservado</span>
                )}
              </div>
              <h1 className="text-3xl md:text-[2.5rem] font-bold tracking-tight leading-tight mb-3">{imovel.titulo}</h1>
              <p className="text-gray-400 flex items-center gap-2">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                {imovel.bairro}, {imovel.cidade}{imovel.rua && ` — ${imovel.rua}, ${imovel.numero}`}
              </p>
            </div>

            {/* Características */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { v: imovel.areaM2, l: "m²", s: imovel.areaM2 > 0 },
                { v: imovel.quartos, l: "Quartos", s: imovel.quartos > 0 },
                { v: imovel.banheiros, l: "Banheiros", s: imovel.banheiros > 0 },
                { v: imovel.vagasGaragem, l: "Vagas", s: imovel.vagasGaragem > 0 },
              ]
                .filter((c) => c.s)
                .map((c, i) => (
                  <div key={i} className="bg-[#FFF7ED] border border-[#EA580C]/10 rounded-sm p-5 text-center">
                    <p className="text-2xl font-bold text-[#EA580C] mb-1">{c.v}</p>
                    <p className="text-[.7rem] text-gray-400 uppercase tracking-wider">{c.l}</p>
                  </div>
                ))}
            </div>

            {/* Descrição */}
            {imovel.descricao && (
              <div className="bg-gray-50 border border-gray-100 rounded-sm p-8">
                <h3 className="text-[.7rem] font-semibold uppercase tracking-[.14em] text-[#EA580C] mb-5">Sobre este imóvel</h3>
                <p className="text-gray-600 leading-[1.9] text-[.95rem]">{imovel.descricao}</p>
              </div>
            )}

            {/* Localização */}
            <div className="bg-gray-50 border border-gray-100 rounded-sm p-8">
              <h3 className="text-[.7rem] font-semibold uppercase tracking-[.14em] text-[#EA580C] mb-5">Localização</h3>
              <div className="grid grid-cols-2 gap-5 text-sm">
                {[
                  { l: "Cidade", v: imovel.cidade },
                  { l: "Bairro", v: imovel.bairro },
                  { l: "Rua", v: imovel.rua ? `${imovel.rua}, ${imovel.numero}` : null },
                  { l: "Complemento", v: imovel.complemento },
                ]
                  .filter((x) => x.v)
                  .map((x, i) => (
                    <div key={i}>
                      <p className="text-gray-400 text-[.7rem] uppercase tracking-wider mb-1">{x.l}</p>
                      <p className="text-gray-800 font-medium">{x.v}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Coluna lateral */}
          <div className="lg:sticky lg:top-[92px] lg:self-start flex flex-col gap-5">
            <div className="bg-white border border-gray-100 rounded-lg p-8 shadow-sm">
              <p className="text-[.7rem] text-gray-400 uppercase tracking-wider mb-2">Valor de venda</p>
              <p className="text-[2.2rem] font-bold text-[#EA580C] mb-6 leading-tight">{fmt(imovel.valorVenda)}</p>
              <WhatsAppButton mensagem={`Olá! Tenho interesse no imóvel ${imovel.codigoAgs} — ${imovel.titulo}`} />
              <p className="text-[.7rem] text-gray-400 mt-4 text-center">Resposta em até 2 horas</p>
            </div>
            <div className="bg-[#FFF7ED] border border-[#EA580C]/10 rounded-lg p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-[#EA580C] rounded-full flex items-center justify-center text-white font-bold text-xl">R</div>
                <div>
                  <p className="font-semibold text-lg">Raquel</p>
                  <p className="text-gray-400 text-sm">Corretora de imóveis</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">Atendimento personalizado para encontrar o imóvel ideal.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══ OUTROS IMÓVEIS ══ */}
      {outros.length > 0 && (
        <section className="bg-gray-50 border-t border-gray-100 py-20 px-[6vw]">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="block w-6 h-[1.5px] bg-[#EA580C]" />
                  <span className="text-[.7rem] font-semibold uppercase tracking-[.12em] text-[#EA580C]">Explore mais</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Outros imóveis que podem te interessar</h2>
              </div>
              <Link
                to="/#catalogo"
                className="hidden md:flex items-center gap-2 text-sm font-medium text-[#EA580C] no-underline hover:underline"
              >
                Ver todos →
              </Link>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
              {outros.map((im) => (
                <PropertyCard key={im.id} imovel={im} />
              ))}
            </div>
            <Link
              to="/#catalogo"
              className="mt-8 md:hidden flex items-center justify-center gap-2 text-sm font-medium text-[#EA580C] no-underline hover:underline"
            >
              Ver todos os imóveis →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
