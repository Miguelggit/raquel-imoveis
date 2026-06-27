export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-br from-[#FFEFD4] via-[#FFF7ED] to-[#FFFDF9]">

      {/* Blob principal — canto superior direito */}
      <div className="absolute top-[-8%] right-[-8%] w-[700px] h-[700px] rounded-full bg-[#EA580C] opacity-[0.22] blur-[130px] pointer-events-none" />
      {/* Blob secundário — canto inferior esquerdo */}
      <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[#EA580C] opacity-[0.16] blur-[110px] pointer-events-none" />
      {/* Blob terciário — centro-esquerdo, profundidade */}
      <div className="absolute top-[30%] left-[10%] w-[320px] h-[320px] rounded-full bg-[#F97316] opacity-[0.09] blur-[90px] pointer-events-none" />

      {/* Forma geométrica — canto inferior direito */}
      <div className="absolute bottom-0 right-0 w-[42%] h-[50%] bg-[#FFEDD5] rounded-tl-[140px] opacity-30 pointer-events-none" />

      {/* Grade de pontos */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #C2410C 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          opacity: 0.07,
        }}
      />

      {/* Detalhe lateral — desktop */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-3 pl-8">
        <div className="w-[1.5px] h-20 bg-gradient-to-b from-transparent to-[#EA580C]/40" />
        <span
          className="text-[.6rem] font-semibold uppercase tracking-[.2em] text-[#EA580C]/50"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Caxias do Sul · RS
        </span>
        <div className="w-[1.5px] h-20 bg-gradient-to-t from-transparent to-[#EA580C]/40" />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 w-full px-5 sm:px-[6vw] pt-32 pb-16 flex flex-col items-center text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EA580C]/10 border border-[#EA580C]/30 mb-8 md:mb-10 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] animate-pulse flex-shrink-0" />
          <span className="text-[.72rem] font-semibold uppercase tracking-[.14em] text-[#EA580C]">
            Caxias do Sul e região
          </span>
        </div>

        {/* Título */}
        <h1 className="text-[clamp(2.6rem,7.5vw,5.8rem)] font-bold leading-[1.06] tracking-[-0.02em] text-gray-900 max-w-[14ch] mb-6 md:mb-8">
          Seu próximo imóvel{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-[#EA580C]">começa aqui.</span>
            <span
              className="absolute inset-x-0 bottom-[6%] h-[30%] bg-[#EA580C]/15 -z-0 -skew-x-1 rounded-sm"
              aria-hidden
            />
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="text-base md:text-lg text-gray-500 max-w-[44ch] leading-relaxed mb-10 md:mb-12">
          Atendimento personalizado, imóveis selecionados a dedo
          e negociação do início ao fim na Serra Gaúcha.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none sm:w-auto">
          <a
            href="#catalogo"
            className="px-8 py-4 bg-[#EA580C] text-white no-underline text-sm font-semibold uppercase tracking-wide rounded-xl transition-all duration-200 hover:bg-[#C2410C] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#EA580C]/25 active:translate-y-0 text-center"
          >
            Ver imóveis
          </a>
          <a
            href="https://wa.me/5554996582058?text=Olá Raquel! Vi seu site e gostaria de conversar."
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-white text-gray-700 no-underline text-sm font-medium uppercase tracking-wide rounded-xl border border-[#EA580C]/20 transition-all duration-200 hover:border-[#EA580C]/60 hover:text-[#EA580C] hover:shadow-md active:bg-orange-50 text-center"
          >
            Falar com a Raquel
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 md:mt-20 w-full max-w-sm sm:max-w-md">
          <div className="flex justify-center bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-5 border border-[#EA580C]/20 shadow-md shadow-[#EA580C]/8">
            <div className="flex-1 flex flex-col items-center gap-1 px-4">
              <p className="text-2xl md:text-3xl font-bold text-gray-900 leading-none">2+</p>
              <p className="text-[.68rem] text-gray-400 uppercase tracking-wider mt-1 text-center leading-tight">Anos no mercado</p>
            </div>
            <div className="w-[1px] bg-[#EA580C]/20 self-stretch my-1" />
            <div className="flex-1 flex flex-col items-center gap-1 px-4">
              <p className="text-2xl md:text-3xl font-bold text-[#EA580C] leading-none">100%</p>
              <p className="text-[.68rem] text-gray-400 uppercase tracking-wider mt-1 text-center leading-tight">Personalizado</p>
            </div>
            <div className="w-[1px] bg-[#EA580C]/20 self-stretch my-1" />
            <div className="flex-1 flex flex-col items-center gap-1 px-4">
              <p className="text-2xl md:text-3xl font-bold text-gray-900 leading-none">Serra</p>
              <p className="text-[.68rem] text-gray-400 uppercase tracking-wider mt-1 text-center leading-tight">Gaúcha</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#EA580C]/40">
        <span className="text-[.6rem] uppercase tracking-[.18em]">Scroll</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-[#EA580C]/40 to-transparent" />
      </div>
    </section>
  );
}
