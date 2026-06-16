import { useState } from "react";
import type { Foto } from "../types";
import { fotoService } from "../services/api";

interface PhotoGalleryProps {
  fotos: Foto[];
}

export default function PhotoGallery({ fotos }: PhotoGalleryProps) {
  const [selected, setSelected] = useState(0);

  if (fotos.length === 0) {
    return (
      <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center rounded-sm">
        <p className="text-gray-400">Nenhuma foto disponível</p>
      </div>
    );
  }

  const mainUrl = fotoService.getUrlImagem(fotos[selected].nomeArmazenado);

  return (
    <div>
      {/* Foto principal */}
      <div className="w-full h-[500px] rounded-sm overflow-hidden mb-3 bg-gray-100">
        <img
          src={mainUrl}
          alt={fotos[selected].nomeArquivo}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {fotos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {fotos.map((foto, i) => (
            <button
              key={foto.id}
              onClick={() => setSelected(i)}
              className={`flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden border-2 transition-all cursor-pointer ${
                i === selected
                  ? "border-[#EA580C] opacity-100"
                  : "border-transparent opacity-60 hover:opacity-80"
              }`}
            >
              <img
                src={fotoService.getUrlImagem(foto.nomeArmazenado)}
                alt={foto.nomeArquivo}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
