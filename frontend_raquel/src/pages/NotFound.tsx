import { Link } from "react-router-dom";

// Tela padrão exibida para qualquer rota inexistente (404).
export default function NotFound() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 bg-gradient-to-b from-[#FAF4EE] via-[#FFF7ED] to-[#FAF4EE]">
      <div className="text-center max-w-md">
        <p className="text-[clamp(4rem,14vw,8rem)] font-bold leading-none tracking-tight text-[#EA580C]">
          404
        </p>
        <h1 className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight text-gray-900">
          Página não encontrada
        </h1>
        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
          O endereço que você tentou acessar não existe ou foi movido. Confira o link ou volte para a página inicial.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-8 py-3 bg-[#EA580C] text-white no-underline text-sm font-semibold uppercase tracking-wide rounded-sm transition-all hover:bg-[#C2410C]"
          >
            Ir para o início
          </Link>
          <Link
            to="/#catalogo"
            className="px-8 py-3 bg-transparent text-gray-600 no-underline text-sm font-medium uppercase tracking-wide rounded-sm border border-gray-300 transition-all hover:border-[#EA580C] hover:text-[#EA580C]"
          >
            Ver imóveis
          </Link>
        </div>
      </div>
    </section>
  );
}
