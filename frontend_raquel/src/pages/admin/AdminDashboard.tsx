import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { AgenciamentoResumo } from "../../types";
import { agenciamentoService, authService, fotoService } from "../../services/api";

export default function AdminDashboard() {
  const [imoveis, setImoveis] = useState<AgenciamentoResumo[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fotos, setFotos] = useState<Record<number, string>>({});
  const navigate = useNavigate();

  const fetchImoveis = async (pg: number) => {
    setLoading(true);
    try {
      const r = await agenciamentoService.listar({ page: pg, size: 10, sort: "criadoEM,desc", incluirInativos: true });
      const lista = r.content ?? [];
      setImoveis(lista);
      setTotalPages(r.totalPages ?? 0);
      setTotalElements(r.totalElements ?? 0);

      // Busca primeira foto de cada imóvel
      const fotosMap: Record<number, string> = {};
      for (const im of lista) {
        try {
          const f = await fotoService.listarPorAgenciamento(im.id);
          if (f.length > 0) fotosMap[im.id] = fotoService.getUrlImagem(f[0].nomeArmazenado);
        } catch {}
      }
      setFotos(fotosMap);
    } catch {
      setImoveis([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!authService.isLoggedIn()) { navigate("/admin/login"); return; }
    fetchImoveis(page);
  }, [page]);

  const handleDesativar = async (id: number, titulo: string) => {
    if (!confirm(`Desativar "${titulo}"?`)) return;
    try {
      await agenciamentoService.desativar(id);
      fetchImoveis(page);
    } catch {
      alert("Erro ao desativar");
    }
  };

  const handleAtivar = async (id: number, titulo: string) => {
    if (!confirm(`Ativar "${titulo}"?`)) return;
    try {
      await agenciamentoService.ativar(id);
      fetchImoveis(page);
    } catch {
      alert("Erro ao ativar");
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate("/admin/login");
  };

  const fmt = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header admin */}
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/" className="text-xl font-bold tracking-tight no-underline text-gray-900">
            Raquel<span className="text-[#EA580C]">.</span>
          </Link>
          <span className="text-xs text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded-sm">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-gray-400 no-underline hover:text-[#EA580C]">Ver site</Link>
          <button onClick={handleLogout} className="text-sm text-gray-400 bg-transparent border-none cursor-pointer hover:text-red-500">
            Sair
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Topo */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Imóveis disponivels</h1>
            <p className="text-sm text-gray-400 mt-1">{totalElements} imóveis cadastrados</p>
          </div>
          <Link
            to="/admin/novo"
            className="px-6 py-3 bg-[#EA580C] text-white no-underline text-sm font-semibold rounded-sm hover:bg-[#C2410C] transition-all text-center"
          >
            + Novo imóvel
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#EA580C] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Lista */}
        {!loading && imoveis.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            {imoveis.map((im, i) => (
              <div
                key={im.id}
                className={`flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 px-4 sm:px-6 py-4 ${i > 0 ? "border-t border-gray-50" : ""} hover:bg-gray-50/50 transition-colors ${im.status === "INATIVO" ? "opacity-50 grayscale" : ""}`}
              >
                {/* Foto + Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Foto */}
                  <div className="w-20 h-14 rounded-sm overflow-hidden bg-gray-100 flex-shrink-0">
                    {fotos[im.id] ? (
                      <img src={fotos[im.id]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">Sem foto</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[.65rem] font-semibold text-[#EA580C] uppercase tracking-wider">{im.codigoAgs}</span>
                      <span className={`text-[.65rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                        im.status === "DISPONIVEL" ? "bg-green-50 text-green-600" :
                        im.status === "RESERVADO" ? "bg-amber-50 text-amber-600" :
                        "bg-gray-100 text-gray-400"
                      }`}>{im.status}</span>
                      {im.slideshow && (
                        <span className="text-[.6rem] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-[#EA580C]/10 text-[#EA580C]">★ Slideshow</span>
                      )}
                      {im.destaque && (
                        <span className="text-[.6rem] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-[#EA580C]/10 text-[#EA580C]">★ Destaque</span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">{im.titulo}</p>
                    <p className="text-xs text-gray-400 truncate">{im.bairro}, {im.cidade}</p>
                    {/* Preço (visível só no mobile, dentro da info) */}
                    <p className="sm:hidden text-sm font-semibold text-gray-900 mt-1">{fmt(im.valorVenda)}</p>
                  </div>
                </div>

                {/* Tipo */}
                <div className="hidden md:block text-xs text-gray-400 w-28">{im.tipoImovel}</div>

                {/* Preço (desktop) */}
                <div className="hidden sm:block text-sm font-semibold text-gray-900 w-32 text-right">{fmt(im.valorVenda)}</div>

                {/* Ações */}
                <div className="flex items-center flex-wrap gap-2 flex-shrink-0">
                  <Link
                    to={`/admin/editar/${im.id}`}
                    className="px-3 py-1.5 text-xs font-medium text-[#EA580C] border border-[#EA580C]/20 rounded-sm no-underline hover:bg-[#EA580C]/5 transition-colors"
                  >
                    Editar
                  </Link>
                  <Link
                    to={`/admin/editar/${im.id}`}
                    className="px-3 py-1.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-sm no-underline hover:bg-gray-50 transition-colors"
                  >
                    Fotos
                  </Link>
                  {im.status === "INATIVO" ? (
                    <button
                      onClick={() => handleAtivar(im.id, im.titulo)}
                      className="px-3 py-1.5 text-xs font-medium text-green-600 border border-green-450 rounded-sm bg-transparent cursor-pointer hover:bg-green-50 transition-colors"
                    >
                      Ativar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDesativar(im.id, im.titulo)}
                      className="px-3 py-1.5 text-xs font-medium text-red-400 border border-red-250 rounded-sm bg-transparent cursor-pointer hover:bg-red-50 transition-colors"
                    >
                      Desativar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vazio */}
        {!loading && imoveis.length === 0 && (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-100">
            <span className="text-4xl block mb-4">🏠</span>
            <p className="text-gray-400 mb-4">Nenhum imóvel cadastrado</p>
            <Link to="/admin/novo" className="text-[#EA580C] text-sm font-medium no-underline hover:underline">
              Cadastrar primeiro imóvel →
            </Link>
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
              className="px-4 py-2 text-sm border border-gray-200 rounded-sm bg-white cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#EA580C]">
              Anterior
            </button>
            <span className="text-sm text-gray-400">{page + 1} de {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
              className="px-4 py-2 text-sm border border-gray-200 rounded-sm bg-white cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#EA580C]">
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
