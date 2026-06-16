import axios from "axios";
import type { Agenciamento, AgenciamentoPage, Foto, FiltrosAgenciamento } from "../types";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

export const API_BASE = "http://localhost:8080/api";

export const agenciamentoService = {
  listar: async (filtros: FiltrosAgenciamento = {}): Promise<AgenciamentoPage> => {
    const params = new URLSearchParams();
    if (filtros.tipoImovel) params.append("tipoImovel", filtros.tipoImovel);
    if (filtros.status) params.append("status", filtros.status);
    if (filtros.cidade) params.append("cidade", filtros.cidade);
    if (filtros.bairro) params.append("bairro", filtros.bairro);
    if (filtros.precoMin) params.append("precoMin", filtros.precoMin.toString());
    if (filtros.precoMax) params.append("precoMax", filtros.precoMax.toString());
    params.append("page", (filtros.page ?? 0).toString());
    params.append("size", (filtros.size ?? 12).toString());
    if (filtros.sort) params.append("sort", filtros.sort);

    const { data } = await api.get<AgenciamentoPage>(`/agenciamentos?${params}`);
    return data;
  },

  buscarPorId: async (id: number): Promise<Agenciamento> => {
    const { data } = await api.get<Agenciamento>(`/agenciamentos/${id}`);
    return data;
  },
};

export const fotoService = {
  listarPorAgenciamento: async (agenciamentoId: number): Promise<Foto[]> => {
    const { data } = await api.get<Foto[]>(`/agenciamentos/${agenciamentoId}/fotos`);
    return data;
  },

  getUrlImagem: (nomeArmazenado: string): string => {
    return `${API_BASE}/agenciamentos/fotos/${nomeArmazenado}`;
  },
};

export default api;