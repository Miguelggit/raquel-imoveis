import { useState, useEffect, useCallback, useRef } from "react";
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
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!id) return;
    const n = parseInt(id);
    setLoading(true);
    setCurrentIdx(0);

    Promise.all([
      agenciamentoService.buscarPorId(n),
      fotoService.listarPorAgenciamento(n),
      agenciamentoService.listar({ size: 200, sort: "criadoEM,desc" }),
    ])
      .then(([ag, ft, page]) => {
        setImovel(ag);
        setFotos(ft);
        setOutros(page.content.filter((im) => im.id !== n));
      })
      .catch(() => setErro(true))
      .finally(() => setLoading(false));
  }, [id]);

  const prevPhoto = useCallback(
    () => setCurrentIdx((p) => (p - 1 + fotos.length) % fotos.length),
    [fotos.length]
  );
  const nextPhoto = useCallback(
    () => setCurrentIdx((p) => (p + 1) % fotos.length),
    [fotos.length]
  );

  // Swipe no celular: guarda o X inicial e navega conforme a direção do arrasto
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || fotos.length <= 1) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) (dx < 0 ? nextPhoto : prevPhoto)();
    touchStartX.current = null;
  };

  const openLightbox = useCallback((idx: number) => {
    setLightboxIdx(idx);
    setLightboxOpen(true);
  }, []);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  const prevLightbox = useCallback(
    () => setLightboxIdx((p) => (p - 1 + fotos.length) % fotos.length),
    [fotos.length]
  );
  const nextLightbox = useCallback(
    () => setLightboxIdx((p) => (p + 1) % fotos.length),
    [fotos.length]
  );

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevLightbox();
      if (e.key === "ArrowRight") nextLightbox();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, prevLightbox, nextLightbox, closeLightbox]);

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

  // Cópia legada: funciona mesmo sem HTTPS (contexto inseguro), onde
  // navigator.clipboard não existe. Usa um <textarea> temporário.
  const copiarLegado = (texto: string) => {
    try {
      const ta = document.createElement("textarea");
      ta.value = texto;
      ta.style.position = "fixed";
      ta.style.top = "0";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  };

  const marcarCopiado = useCallback(() => {
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }, []);

  const handleCompartilhar = useCallback(async () => {
    if (!imovel) return;
    const url = window.location.href;
    const texto = `${imovel.titulo} — ${imovel.codigoAgs}\n${fmt(imovel.valorVenda)} • ${imovel.bairro}, ${imovel.cidade}`;
    // 1) Web Share API (celular em HTTPS): abre o menu nativo de compartilhamento
    if (navigator.share) {
      try {
        await navigator.share({ title: imovel.titulo, text: texto, url });
        return;
      } catch (err) {
        // Usuário cancelou o menu nativo: não faz nada
        if ((err as Error)?.name === "AbortError") return;
        // Qualquer outra falha: cai nos fallbacks abaixo
      }
    }
    // 2) Clipboard API (contexto seguro / HTTPS)
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        marcarCopiado();
        return;
      } catch {
        // cai no fallback legado
      }
    }
    // 3) Fallback legado (funciona em HTTP, como no demo pela rede local)
    if (copiarLegado(url)) marcarCopiado();
  }, [imovel, marcarCopiado]);

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

  return (
    <div className="min-h-screen bg-[#FFFDF9]">
      {/* ══ GALERIA ══ */}
      <section
        className="group relative w-full h-[72vh] min-h-[500px] max-h-[720px] bg-gray-900 overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Faixa "Vendido" sobre a galeria */}
        {imovel.status === "VENDIDO" && (
          <div className="absolute top-5 left-5 z-20 px-4 py-2 bg-gray-900/90 text-white text-sm font-bold uppercase tracking-[0.15em] rounded-sm select-none">
            Vendido
          </div>
        )}
        {fotos.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 gap-3">
            <span className="text-6xl">📷</span>
            <p className="text-gray-400">Sem fotos disponíveis</p>
          </div>
        ) : (
          <>
            {/* Stack de imagens com crossfade */}
            {fotos.map((f, i) => (
              <img
                key={f.id}
                src={fotoService.getUrlImagem(f.nomeArmazenado)}
                alt={i === currentIdx ? imovel.titulo : ""}
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ease-in-out select-none ${
                  i === currentIdx ? "opacity-100" : "opacity-0"
                }`}
                draggable={false}
              />
            ))}

            {/* Gradiente apenas na base para legibilidade das thumbnails */}
            <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-black/80 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Setas de navegação */}
            {fotos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-black/35 hover:bg-black/65 backdrop-blur-sm border border-solid border-white/25 rounded-full text-white text-2xl flex items-center justify-center cursor-pointer transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                >
                  ‹
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-black/35 hover:bg-black/65 backdrop-blur-sm border border-solid border-white/25 rounded-full text-white text-2xl flex items-center justify-center cursor-pointer transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                >
                  ›
                </button>
              </>
            )}

            {/* Contador */}
            <div className="absolute top-5 right-5 z-10 px-3 py-1 bg-black/45 backdrop-blur-sm rounded-full text-white text-xs font-medium tracking-wide select-none opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
              {currentIdx + 1} / {fotos.length}
            </div>

            {/* Barra inferior: thumbnails + botão "Ver todas" */}
            <div className="absolute bottom-0 left-0 right-0 z-10 flex items-end gap-4 px-5 pb-5 pt-10">
              {fotos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto flex-1 [&::-webkit-scrollbar]:hidden pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {fotos.map((f, i) => (
                    <button
                      key={f.id}
                      onClick={() => setCurrentIdx(i)}
                      className={`flex-shrink-0 w-20 h-[54px] rounded-sm overflow-hidden border-2 border-solid transition-all duration-200 cursor-pointer ${
                        i === currentIdx
                          ? "border-white opacity-100 scale-[1.07] shadow-lg"
                          : "border-white/30 opacity-45 hover:opacity-75 hover:border-white/60"
                      }`}
                    >
                      <img
                        src={fotoService.getUrlImagem(f.nomeArmazenado)}
                        alt=""
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => openLightbox(currentIdx)}
                className="flex-shrink-0 px-4 py-2.5 bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-semibold rounded-sm shadow-md flex items-center gap-2 cursor-pointer hover:bg-white hover:shadow-lg transition-all border-none"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                Ver todas as {fotos.length} fotos
              </button>
            </div>
          </>
        )}
      </section>

      {/* ══ LIGHTBOX ══ */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}
        >
          {/* Fechar */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-6 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white text-lg border border-solid border-white/20 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer z-10"
          >
            ✕
          </button>

          {/* Contador */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium tracking-wide select-none">
            {lightboxIdx + 1} / {fotos.length}
          </div>

          {/* Imagem */}
          <div
            className="px-3 sm:px-16 lg:px-20 w-full flex items-center justify-center max-h-[88vh]"
            onTouchStart={onTouchStart}
            onTouchEnd={(e) => {
              if (touchStartX.current === null || fotos.length <= 1) return;
              const dx = e.changedTouches[0].clientX - touchStartX.current;
              if (Math.abs(dx) > 40) (dx < 0 ? nextLightbox : prevLightbox)();
              touchStartX.current = null;
            }}
          >
            <img
              src={fotoService.getUrlImagem(fotos[lightboxIdx].nomeArmazenado)}
              alt=""
              className="max-w-full max-h-[82vh] sm:max-h-[80vh] object-contain rounded select-none"
              draggable={false}
            />
          </div>

          {/* Setas */}
          {fotos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 border border-solid border-white/20 rounded-full text-white text-2xl flex items-center justify-center cursor-pointer transition-all"
              >
                ‹
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 border border-solid border-white/20 rounded-full text-white text-2xl flex items-center justify-center cursor-pointer transition-all"
              >
                ›
              </button>
            </>
          )}

          {/* Miniaturas */}
          {fotos.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[80vw] pb-1 px-2 [&::-webkit-scrollbar]:hidden">
              {fotos.map((f, i) => (
                <button
                  key={f.id}
                  onClick={(e) => { e.stopPropagation(); setLightboxIdx(i); }}
                  className={`flex-shrink-0 w-16 h-11 rounded overflow-hidden border-2 border-solid transition-all duration-200 cursor-pointer ${
                    i === lightboxIdx
                      ? "border-white opacity-100 scale-110"
                      : "border-transparent opacity-40 hover:opacity-70"
                  }`}
                >
                  <img
                    src={fotoService.getUrlImagem(f.nomeArmazenado)}
                    alt=""
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          )}
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
                {imovel.status === "VENDIDO" && (
                  <span className="px-3 py-1 bg-gray-900 text-white text-[.68rem] font-semibold uppercase tracking-wider rounded-sm">Vendido</span>
                )}
                <button
                  onClick={handleCompartilhar}
                  className="ml-auto inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#EA580C]/25 text-[#EA580C] text-xs font-semibold rounded-sm cursor-pointer hover:bg-[#EA580C] hover:text-white hover:border-[#EA580C] transition-all"
                >
                  {copiado ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      Link copiado!
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                        <path d="m8.59 13.51 6.83 3.98M15.41 6.51 8.59 10.49" />
                      </svg>
                      Compartilhar
                    </>
                  )}
                </button>
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
              <div className="bg-[#FFF7ED]/70 border border-[#EA580C]/10 rounded-sm p-8">
                <h3 className="text-[.7rem] font-semibold uppercase tracking-[.14em] text-[#EA580C] mb-5">Sobre este imóvel</h3>
                <p className="text-gray-600 leading-[1.9] text-[.95rem]">{imovel.descricao}</p>
              </div>
            )}

            {/* Localização */}
            <div className="bg-[#FFF7ED]/70 border border-[#EA580C]/10 rounded-sm p-8">
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
            <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-md">
              <div className="h-1.5 bg-gradient-to-r from-[#EA580C] to-[#F97316]" />
              <div className="p-8">
                <p className="text-[.7rem] text-gray-400 uppercase tracking-wider mb-2">Valor de venda</p>
                <p className="text-[2.2rem] font-bold text-[#EA580C] mb-6 leading-tight">{fmt(imovel.valorVenda)}</p>
                <WhatsAppButton mensagem={`Olá! Tenho interesse no imóvel ${imovel.codigoAgs} — ${imovel.titulo}. Aguardo seu contato. Obrigado!`} />
                <p className="text-[.7rem] text-gray-400 mt-4 text-center">Resposta em até 2 horas</p>
              </div>
            </div>
            <div className="bg-[#FFF7ED] border border-[#EA580C]/10 rounded-lg p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 bg-[#EA580C] rounded-full flex items-center justify-center text-white font-bold text-xl"><img src="/images/Foto_5.jpg" alt="Raquel" className="w-full h-full object-cover object-center rounded-full" /></div>
                <div>
                  <p className="font-semibold text-lg">Raquel Marinho</p>
                  <p className="text-gray-400 text-sm">Corretora de imóveis</p>
                  <p className="text-gray-400 text-sm">CRECI 82238-F</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">Atendimento personalizado para encontrar o imóvel ideal.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══ OUTROS IMÓVEIS ══ */}
      {outros.length > 0 && (
        <section className="bg-[#FAF4EE] border-t border-[#EA580C]/10 py-20 px-[6vw]">
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
