import { useState, useEffect } from "react";
import { agenciamentoService, fotoService } from "../services/api";

const FALLBACK = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80",
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const page = await agenciamentoService.listar({ size: 5, sort: "criadoEM,desc" });
        const urls: string[] = [];
        for (const im of page.content) {
          if (urls.length >= 5) break;
          try { const f = await fotoService.listarPorAgenciamento(im.id); if (f.length) urls.push(fotoService.getUrlImagem(f[0].nomeArmazenado)); } catch {}
        }
        setSlides(urls.length > 0 ? urls : FALLBACK);
      } catch { setSlides(FALLBACK); }
      setCarregando(false);
    })();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides]);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {carregando && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-20">
          <div className="w-8 h-8 border-2 border-[#EA580C] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {slides.map((img, i) => (
        <div key={i} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`} style={{ backgroundImage: `url(${img})` }}>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </div>
      ))}

      <div className="absolute inset-0 z-10 flex flex-col justify-end px-[6vw] pb-[9vh]">
        <div className="flex items-center gap-3 mb-4">
          <span className="block w-8 h-[1.5px] bg-[#EA580C]" />
          <span className="text-[.72rem] font-medium uppercase tracking-[.14em] text-[#EA580C]">Caxias do Sul e região</span>
        </div>
        <h1 className="text-[clamp(2.5rem,5.5vw,4.5rem)] font-bold leading-[1.1] tracking-tight text-white max-w-[650px]">
          Encontre o imóvel dos seus <em className="not-italic text-[#EA580C]">sonhos</em>
        </h1>
        <p className="mt-5 text-base text-white/70 max-w-[420px] leading-relaxed">
          Agenciamentos selecionados com a curadoria de quem entende o mercado imobiliário da Serra Gaúcha.
        </p>
        <div className="flex gap-4 mt-10 flex-wrap">
          <a href="#catalogo" className="px-8 py-3.5 bg-[#EA580C] text-white no-underline text-sm font-semibold uppercase tracking-wide rounded-sm transition-all hover:bg-[#C2410C] hover:-translate-y-0.5">Ver imóveis</a>
          <a href="https://wa.me/5554999999999" target="_blank" rel="noopener noreferrer" className="px-8 py-3.5 bg-transparent text-white no-underline text-sm font-medium uppercase tracking-wide rounded-sm border-[1.5px] border-white/50 transition-all hover:bg-white/10">Fale conosco</a>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-[3vh] left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {slides.map((_, i) => (<button key={i} onClick={() => setCurrent(i)} className={`h-[2px] rounded-none border-none cursor-pointer transition-all ${i === current ? "w-12 bg-[#EA580C]" : "w-7 bg-white/35 hover:bg-white/50"}`} />))}
        </div>
      )}
      <div className="absolute bottom-[3.5vh] right-[6vw] z-10 text-xs tracking-wider text-white/50">
        <b className="text-[#EA580C] font-semibold">{String(current + 1).padStart(2, "0")}</b> / {String(slides.length).padStart(2, "0")}
      </div>
    </section>
  );
}
