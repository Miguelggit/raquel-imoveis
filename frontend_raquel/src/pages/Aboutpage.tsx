import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const DEPOIMENTOS = [
  {
    nome: "Maria Silva",
    texto: "A Raquel foi incrível durante todo o processo de compra do nosso primeiro apartamento. Atenciosa, transparente e sempre disponível. Recomendo de olhos fechados!",
    estrelas: 5,
  },
  {
    nome: "João e Ana Santos",
    texto: "Procurávamos uma casa em Caxias há meses sem sucesso. A Raquel entendeu exatamente o que queríamos e em duas semanas encontrou o imóvel perfeito pra nossa família.",
    estrelas: 5,
  },
  {
    nome: "Carlos Mendes",
    texto: "Profissionalismo do início ao fim. A Raquel cuidou de toda a documentação e negociação. Vendemos nosso terreno pelo valor que esperávamos. Muito obrigado!",
    estrelas: 5,
  },
  {
    nome: "Fernanda Oliveira",
    texto: "O que mais me impressionou foi o atendimento personalizado. A Raquel realmente escuta e se importa. Não é só mais uma corretora, é uma parceira de verdade.",
    estrelas: 5,
  },
];

function Estrelas({ qtd }: { qtd: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < qtd ? "#EA580C" : "#E5E7EB"}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function AboutPage() {
  const [depAtivo, setDepAtivo] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setDepAtivo((p) => (p + 1) % DEPOIMENTOS.length);
        setFadeIn(true);
      }, 400);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const dep = DEPOIMENTOS[depAtivo];

  return (
    <div className="min-h-screen bg-[#FFFDF9]">

      {/* ══ HERO ══ */}
      <section className="relative bg-[#1A0C06] pt-32 pb-28 px-[6vw] overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-[#EA580C]/12 -skew-x-12 translate-x-10" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#EA580C] opacity-[0.14] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#EA580C]/[0.05] to-transparent pointer-events-none" />
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-10 h-[2px] bg-[#EA580C]" />
            <span className="text-[.75rem] font-semibold uppercase tracking-[.16em] text-[#EA580C]">Conheça nossa história</span>
          </div>
          <h1 className="text-[clamp(2.2rem,4.5vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-white max-w-2xl">
            Mais que uma corretora,
            <br />
            <span className="text-[#EA580C]">uma parceira</span> na sua jornada
          </h1>
          <p className="mt-8 text-lg text-white/50 leading-relaxed max-w-xl">
            A Raquel Imóveis nasceu da paixão por conectar pessoas ao lugar ideal.
            Com atendimento personalizado e curadoria cuidadosa, cada agenciamento
            é selecionado pensando em você.
          </p>
        </div>
      </section>

      {/* ══ SOBRE A RAQUEL ══ */}
      <section className="py-24 px-[6vw] bg-gradient-to-br from-[#FFFDF9] via-white to-[#FFF7ED]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[300px_1fr] gap-16 items-start">

          {/* Foto + números */}
          <div className="flex flex-col items-center gap-6">
            <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 border border-gray-100 shadow-md relative">
              <img
                src="/images/foto_3.jpg"
                alt="Raquel - Corretora de Imóveis"
                className="w-full h-full object-cover object-top"
              />
              {/* Badge CRECI */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              </div>
            </div>

            {/* Números abaixo da foto */}
            <div className="w-full grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-b from-[#FFF7ED] to-[#FFE8C8] border border-[#EA580C]/20 rounded-lg p-5 text-center shadow-sm shadow-[#EA580C]/8">
                <p className="text-2xl font-bold text-[#EA580C]">2+</p>
                <p className="text-[.65rem] text-gray-400 uppercase tracking-wider mt-1">Anos no mercado</p>
              </div>
              <div className="bg-gradient-to-b from-[#FFF7ED] to-[#FFE8C8] border border-[#EA580C]/20 rounded-lg p-5 text-center shadow-sm shadow-[#EA580C]/8">
                <p className="text-2xl font-bold text-[#EA580C]">R$ 2M+</p>
                <p className="text-[.65rem] text-gray-400 uppercase tracking-wider mt-1">VGV</p>
              </div>
            </div>
          </div>

          {/* Texto */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="block w-8 h-[1.5px] bg-[#EA580C]" />
              <span className="text-[.72rem] font-semibold uppercase tracking-[.14em] text-[#EA580C]">Quem sou eu</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-6">Raquel</h2>
            <div className="flex flex-col gap-5 text-gray-500 leading-[1.85]">
              <p>
                Sou corretora de imóveis há mais de 2 anos, especializada no mercado
                de Caxias do Sul e região da Serra Gaúcha. Minha missão é tornar a
                experiência de compra e venda de imóveis mais humana, transparente e eficiente.
              </p>
              <p>
                Cada imóvel que apresento foi visitado e avaliado pessoalmente. Não
                trabalho com volume — trabalho com curadoria. Acredito que o imóvel
                certo muda a vida de uma família.
              </p>
              <p>
                Meu compromisso é com você: desde o primeiro contato até a entrega
                das chaves, estarei ao seu lado em cada etapa.
              </p>
            </div>
            <div className="mt-10">
              <a
                href="https://wa.me/5554996582058?text=Olá Raquel! Vi seu site e gostaria de conversar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#EA580C] text-white no-underline text-sm font-semibold uppercase tracking-wide rounded-sm transition-all hover:bg-[#C2410C] hover:-translate-y-0.5 shadow-md shadow-[#EA580C]/20"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Converse comigo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ DEPOIMENTOS ══ */}
      <section className="py-24 px-[6vw] bg-gradient-to-b from-[#FFF7ED] to-[#FFEFD4] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-[10%] text-[12rem] text-[#EA580C]/20 font-serif leading-none">"</div>
          <div className="absolute bottom-10 right-[10%] text-[12rem] text-[#EA580C]/20 font-serif leading-none rotate-180">"</div>
        </div>
        <div className="absolute top-[-10%] right-[-5%] w-[350px] h-[350px] rounded-full bg-[#EA580C] opacity-[0.07] blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <span className="block w-8 h-[1.5px] bg-[#EA580C]" />
              <span className="text-[.72rem] font-semibold uppercase tracking-[.14em] text-[#EA580C]">Depoimentos</span>
              <span className="block w-8 h-[1.5px] bg-[#EA580C]" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">O que dizem nossos clientes</h2>
          </div>

          {/* Depoimento com fade */}
          <div className={`text-center transition-all duration-500 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            {/* Avatar */}
            <div className="w-20 h-20 mx-auto mb-6 bg-[#FFFDF9] rounded-full flex items-center justify-center shadow-sm border-2 border-[#EA580C]/30">
              <span className="text-2xl font-bold text-[#EA580C]">
                {dep.nome.charAt(0)}
              </span>
            </div>

            {/* Estrelas */}
            <div className="flex justify-center mb-6">
              <Estrelas qtd={dep.estrelas} />
            </div>

            {/* Texto */}
            <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium max-w-2xl mx-auto mb-8">
              "{dep.texto}"
            </blockquote>

            {/* Nome */}
            <div className="flex items-center gap-3 justify-center">
              <span className="block w-6 h-[1px] bg-[#EA580C]" />
              <p className="font-semibold text-gray-900">{dep.nome}</p>
              <span className="block w-6 h-[1px] bg-[#EA580C]" />
            </div>
          </div>

          {/* Dots de navegação */}
          <div className="flex justify-center gap-2 mt-12">
            {DEPOIMENTOS.map((_, i) => (
              <button
                key={i}
                onClick={() => { setFadeIn(false); setTimeout(() => { setDepAtivo(i); setFadeIn(true); }, 300); }}
                className={`h-[3px] rounded-none border-none cursor-pointer transition-all ${
                  i === depAtivo ? "w-10 bg-[#EA580C]" : "w-5 bg-[#EA580C]/20 hover:bg-[#EA580C]/40"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══ VALORES ══ */}
      <section className="py-24 px-[6vw] bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <span className="block w-8 h-[1.5px] bg-[#EA580C]" />
              <span className="text-[.72rem] font-semibold uppercase tracking-[.14em] text-[#EA580C]">Nossos pilares</span>
              <span className="block w-8 h-[1.5px] bg-[#EA580C]" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">O que nos diferencia</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🤝", title: "Transparência total", desc: "Todas as informações apresentadas de forma clara e honesta. Sem surpresas, sem letras miúdas." },
              { icon: "👤", title: "Atendimento pessoal", desc: "Entendo suas necessidades, seu momento de vida e seu orçamento para encontrar a melhor opção." },
              { icon: "✨", title: "Curadoria de imóveis", desc: "Cada imóvel foi visitado e avaliado pessoalmente. Qualidade acima de quantidade, sempre." },
            ].map((v, i) => (
              <div key={i} className="bg-gradient-to-b from-[#FFF7ED] to-[#FFFDF9] rounded-xl p-10 border border-[#EA580C]/15 shadow-md shadow-[#EA580C]/5 transition-all hover:-translate-y-2 hover:shadow-xl hover:shadow-[#EA580C]/10 hover:border-[#EA580C]/30">
                <span className="text-4xl block mb-6">{v.icon}</span>
                <h3 className="text-xl font-semibold mb-4">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-[1.8]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ COMO FUNCIONA ══ */}
      <section className="py-24 px-[6vw] bg-gradient-to-b from-[#FFFDF9] to-[#FFF7ED]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <span className="block w-8 h-[1.5px] bg-[#EA580C]" />
              <span className="text-[.72rem] font-semibold uppercase tracking-[.14em] text-[#EA580C]">Simples e rápido</span>
              <span className="block w-8 h-[1.5px] bg-[#EA580C]" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Como funciona</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Escolha", desc: "Navegue pelo catálogo e encontre imóveis que combinam com você" },
              { step: "02", title: "Contato", desc: "Entre em contato via WhatsApp ou pelo formulário do site" },
              { step: "03", title: "Visita", desc: "Agende uma visita e conheça o imóvel pessoalmente" },
              { step: "04", title: "Negociação", desc: "Cuido de toda a documentação e negociação" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 mx-auto mb-5 bg-[#EA580C] border-2 border-[#EA580C] rounded-full flex items-center justify-center shadow-lg shadow-[#EA580C]/30">
                  <span className="text-xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL ══ */}
      <section className="py-24 px-[6vw] bg-[#1A0C06] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[30%] h-full bg-[#EA580C]/10 skew-x-12 -translate-x-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-[#EA580C] opacity-[0.12] blur-[110px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Pronta para encontrar <span className="text-[#EA580C]">seu imóvel</span>?
          </h2>
          <p className="text-white/50 text-lg mb-10">Entre em contato e vamos conversar.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="https://wa.me/5554996582058" target="_blank" rel="noopener noreferrer"
              className="px-8 py-4 bg-[#EA580C] text-white no-underline text-sm font-semibold uppercase tracking-wide rounded-sm transition-all hover:bg-[#C2410C] shadow-lg shadow-[#EA580C]/20">
              Fale no WhatsApp
            </a>
            <Link to="/#catalogo" className="px-8 py-4 bg-transparent text-white no-underline text-sm font-medium uppercase tracking-wide rounded-sm border-[1.5px] border-white/20 transition-all hover:border-white/50">
              Ver imóveis
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
