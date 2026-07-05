import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import type { Agenciamento, Foto } from "../../types";
import { agenciamentoService, fotoService, authService } from "../../services/api";

export default function AdminPhotos() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [imovel, setImovel] = useState<Agenciamento | null>(null);
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState("");

  const carregarDados = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [ag, ft] = await Promise.all([
        agenciamentoService.buscarPorId(parseInt(id)),
        fotoService.listarPorAgenciamento(parseInt(id)),
      ]);
      setImovel(ag);
      setFotos(ft);
    } catch {
      setErro("Erro ao carregar dados");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!authService.isLoggedIn()) { navigate("/admin/login"); return; }
    carregarDados();
  }, [id]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !id) return;

    setUploading(true);
    setErro("");

    for (let i = 0; i < files.length; i++) {
      try {
        await fotoService.upload(parseInt(id), files[i]);
      } catch {
        setErro(`Erro ao enviar ${files[i].name}`);
      }
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    carregarDados();
  };

  const handleDeletar = async (fotoId: number, nome: string) => {
    if (!confirm(`Remover foto "${nome}"?`)) return;
    try {
      await fotoService.deletar(fotoId);
      carregarDados();
    } catch {
      setErro("Erro ao remover foto");
    }
  };

  const handleDefinirCapa = async (fotoId: number) => {
    try {
      await fotoService.definirCapa(fotoId);
      carregarDados();
    } catch {
      setErro("Erro ao definir a foto de capa");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#EA580C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/admin" className="text-xl font-bold tracking-tight no-underline text-gray-900">
            Raquel<span className="text-[#EA580C]">.</span>
          </Link>
          <span className="text-xs text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded-sm">Admin</span>
        </div>
        <Link to="/admin" className="text-sm text-gray-400 no-underline hover:text-[#EA580C]">← Voltar</Link>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Título */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Fotos do imóvel</h1>
          {imovel && (
            <p className="text-sm text-gray-400 mt-1">
              {imovel.codigoAgs} — {imovel.titulo}
            </p>
          )}
        </div>

        {erro && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm text-red-600 text-sm">{erro}</div>}

        {/* Upload */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 sm:p-8 mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#EA580C] mb-4">Enviar novas fotos</h2>
          <p className="text-sm text-gray-400 mb-4">Formatos aceitos: JPEG, PNG, WebP. Selecione uma ou várias fotos de uma vez.</p>

          <div className="flex items-center gap-4">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleUpload}
              className="hidden"
              id="foto-upload"
            />
            <label
              htmlFor="foto-upload"
              className={`px-6 py-3 text-sm font-semibold rounded-sm cursor-pointer transition-all ${
                uploading
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#EA580C] text-white hover:bg-[#C2410C]"
              }`}
            >
              {uploading ? "Enviando..." : "Selecionar fotos"}
            </label>
            {uploading && (
              <div className="w-5 h-5 border-2 border-[#EA580C] border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        </div>

        {/* Fotos existentes */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 sm:p-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#EA580C] mb-1">
            Fotos cadastradas ({fotos.length})
          </h2>
          <p className="text-xs text-gray-400 mb-4">A foto de <b>capa</b> (★) é a que aparece no card do catálogo e no slideshow da capa.</p>

          {fotos.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-4xl block mb-3">📷</span>
              <p className="text-gray-400">Nenhuma foto cadastrada</p>
              <p className="text-xs text-gray-300 mt-1">Use o botão acima para enviar</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {fotos.map((foto, i) => (
                <div key={foto.id} className={`relative group rounded-sm overflow-hidden border ${foto.principal ? "border-[#EA580C] ring-2 ring-[#EA580C]" : "border-gray-100"}`}>
                  <img
                    src={fotoService.getUrlImagem(foto.nomeArmazenado)}
                    alt={foto.nomeArquivo}
                    className="w-full h-40 object-cover"
                  />
                  {/* Overlay (no desktop aparece no hover; no mobile os botões ficam sempre visíveis) */}
                  <div className="absolute inset-0 sm:bg-black/0 sm:group-hover:bg-black/40 transition-all flex flex-col items-center justify-center gap-1.5 p-2">
                    {!foto.principal && (
                      <button
                        onClick={() => handleDefinirCapa(foto.id)}
                        className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 px-3 py-1.5 bg-white/95 text-gray-800 text-[.7rem] font-semibold rounded-sm border-none cursor-pointer transition-all hover:bg-white shadow-sm"
                      >
                        Tornar capa
                      </button>
                    )}
                    <button
                      onClick={() => handleDeletar(foto.id, foto.nomeArquivo)}
                      className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 px-3 py-1.5 bg-red-500 text-white text-[.7rem] font-semibold rounded-sm border-none cursor-pointer transition-all hover:bg-red-600 shadow-sm"
                    >
                      Remover
                    </button>
                  </div>
                  {/* Badge: capa ou posição */}
                  <div className="absolute top-2 left-2">
                    {foto.principal ? (
                      <span className="px-2 py-1 bg-[#EA580C] text-white text-[.65rem] font-semibold rounded-sm">★ Capa</span>
                    ) : (
                      <span className="px-2 py-1 bg-black/50 text-white text-[.65rem] rounded-sm">{i + 1}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Link pra editar dados */}
        {imovel && (
          <div className="mt-6 flex gap-4">
            <Link
              to={`/admin/editar/${imovel.id}`}
              className="text-sm text-[#EA580C] no-underline hover:underline"
            >
              Editar dados do imóvel →
            </Link>
            <Link
              to={`/imovel/${imovel.id}`}
              className="text-sm text-gray-400 no-underline hover:underline"
            >
              Ver no site →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
