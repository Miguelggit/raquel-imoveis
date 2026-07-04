import axios from "axios";
import type { Agenciamento, AgenciamentoPage, Foto, FiltrosAgenciamento } from "../types";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const API_BASE = "http://localhost:8080/api";

// Interceptor: adiciona token automaticamente se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("raquel_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: sessão expirada/inválida -> limpa token e volta ao login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("raquel_token");
      if (!window.location.pathname.startsWith("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, senha: string) => {
    const { data } = await api.post("/auth/login", { email, senha });
    localStorage.setItem("raquel_token", data.token);
    return data;
  },

  logout: () => {
    localStorage.removeItem("raquel_token");
  },

  isLoggedIn: (): boolean => {
    return !!localStorage.getItem("raquel_token");
  },
};

export const agenciamentoService = {
  listar: async (filtros: FiltrosAgenciamento = {}): Promise<AgenciamentoPage> => {
    const params = new URLSearchParams();
    if (filtros.tipoImovel) params.append("tipoImovel", filtros.tipoImovel);
    if (filtros.status) params.append("status", filtros.status);
    if (filtros.cidade) params.append("cidade", filtros.cidade);
    if (filtros.bairro) params.append("bairro", filtros.bairro);
    if (filtros.precoMin) params.append("precoMin", filtros.precoMin.toString());
    if (filtros.precoMax) params.append("precoMax", filtros.precoMax.toString());
    if (filtros.incluirInativos) params.append("incluirInativos", "true");
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

  criar: async (agenciamento: Record<string, unknown>): Promise<Agenciamento> => {
    const { data } = await api.post<Agenciamento>("/agenciamentos", agenciamento);
    return data;
  },

  atualizar: async (id: number, agenciamento: Record<string, unknown>): Promise<Agenciamento> => {
    const { data } = await api.put<Agenciamento>(`/agenciamentos/${id}`, agenciamento);
    return data;
  },

  desativar: async (id: number): Promise<void> => {
    await api.delete(`/agenciamentos/${id}`);
  },

  ativar: async (id: number): Promise<Agenciamento> => {
    const atual = await agenciamentoService.buscarPorId(id);
    const { data } = await api.put<Agenciamento>(`/agenciamentos/${id}`, {
      ...atual,
      status: "DISPONIVEL",
    });
    return data;
  },
};

export const fotoService = {
  listarPorAgenciamento: async (agenciamentoId: number): Promise<Foto[]> => {
    const { data } = await api.get<Foto[]>(`/agenciamentos/${agenciamentoId}/fotos`);
    return data;
  },

  upload: async (agenciamentoId: number, file: File): Promise<Foto> => {
    const formData = new FormData();
    formData.append("foto", file);
    const { data } = await api.post<Foto>(`/agenciamentos/${agenciamentoId}/fotos`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  deletar: async (fotoId: number): Promise<void> => {
    await api.delete(`/agenciamentos/fotos/${fotoId}`);
  },

  getUrlImagem: (nomeArmazenado: string): string => {
    return `${API_BASE}/agenciamentos/fotos/${nomeArmazenado}`;
  },
};

export default api;