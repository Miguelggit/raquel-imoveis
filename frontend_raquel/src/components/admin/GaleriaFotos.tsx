import { useState, useEffect, useRef } from "react";
import type { Foto } from "../../types";
import { fotoService } from "../../services/api";

// Seção de fotos de um imóvel: envio (múltiplas), definição de capa e remoção.
// Recebe o id do agenciamento já salvo — o backend exige o id para vincular as fotos.
// `onCountChange` avisa o formulário quantas fotos existem (para liberar/travar "Publicar").
export default function GaleriaFotos({
  agenciamentoId,
  onCountChange,
}: {
  agenciamentoId: number;
  onCountChange?: (quantidade: number) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState("");

  const carregar = async () => {
    try {
      const ft = await fotoService.listarPorAgenciamento(agenciamentoId);
      setFotos(ft ?? []);
      onCountChange?.(ft?.length ?? 0);
    } catch {
      setErro("Erro ao carregar fotos");
    }
  };

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agenciamentoId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    setErro("");

    for (let i = 0; i < files.length; i++) {
      try {
        await fotoService.upload(agenciamentoId, files[i]);
      } catch {
        setErro(`Erro ao enviar ${files[i].name}`);
      }
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    carregar();
  };

  const handleDeletar = async (fotoId: number, nome: string) => {
    if (!confirm(`Remover foto "${nome}"?`)) return;
    try {
      await fotoService.deletar(fotoId);
      carregar();
    } catch {
      setErro("Erro ao remover foto");
    }
  };

  const handleDefinirCapa = async (fotoId: number) => {
    try {
      await fotoService.definirCapa(agenciamentoId, fotoId);
      carregar();
    } catch {
      setErro("Erro ao definir a foto de capa");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 sm:p-8">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[#EA580C] mb-1">Fotos do imóvel</h2>
      <p className="text-xs text-gray-400 mb-5">
        A foto de <b>capa</b> (★) é a que aparece no card do catálogo e no slideshow. Formatos: JPEG, PNG, WebP.
      </p>

      {erro && <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-sm text-red-600 text-sm">{erro}</div>}

      {/* Botão de envio */}
      <div className="flex items-center gap-4 mb-6">
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
            uploading ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-[#EA580C] text-white hover:bg-[#C2410C]"
          }`}
        >
          {uploading ? "Enviando..." : "Selecionar fotos"}
        </label>
        {uploading && <div className="w-5 h-5 border-2 border-[#EA580C] border-t-transparent rounded-full animate-spin" />}
      </div>

      {/* Grade de fotos */}
      {fotos.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-200 rounded-sm">
          <span className="text-4xl block mb-3">📷</span>
          <p className="text-gray-400">Nenhuma foto cadastrada</p>
          <p className="text-xs text-gray-300 mt-1">Use o botão acima para enviar</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {fotos.map((foto, i) => (
            <div
              key={foto.id}
              className={`relative group rounded-sm overflow-hidden border ${
                foto.principal ? "border-[#EA580C] ring-2 ring-[#EA580C]" : "border-gray-100"
              }`}
            >
              <img
                src={fotoService.getUrlImagem(foto.nomeArmazenado)}
                alt={foto.nomeArquivo}
                className="w-full h-40 object-cover"
              />
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
  );
}
