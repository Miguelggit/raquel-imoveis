import axios from "axios";
import type { Agenciamento, AgenciamentoPage, Foto, FiltrosAgenciamento } from "../types";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Sinalizador NÃO-sensível de UI (não é o token; o token vive no cookie httpOnly).
const AUTH_FLAG = "raquel_auth";

// Interceptor: sessão expirada/inválida -> limpa flag e volta ao login.
// O cookie httpOnly é enviado automaticamente pelo navegador (withCredentials),
// então não precisamos mais anexar o header Authorization manualmente.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_FLAG);
      if (!window.location.pathname.startsWith("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, senha: string) => {
    // O backend valida e devolve o token dentro de um cookie httpOnly.
    const { data } = await api.post("/auth/login", { email, senha });
    localStorage.setItem(AUTH_FLAG, "1");
    return data;
  },

  logout: async () => {
    // Pede ao backend para apagar o cookie; limpa o flag local em qualquer caso.
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem(AUTH_FLAG);
    }
  },

  isLoggedIn: (): boolean => {
    return !!localStorage.getItem(AUTH_FLAG);
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

  // Define esta foto como capa do imóvel (o backend desmarca as demais).
  // Dois ids: o do agenciamento (para localizar as fotos) e o da foto (a capa).
  definirCapa: async (agenciamentoId: number, fotoId: number): Promise<void> => {
    await api.patch(`/agenciamentos/${agenciamentoId}/fotos/${fotoId}/principal`);
  },

  getUrlImagem: (nomeArmazenado: string): string => {
    // Caminho relativo (mesma origem): em produção vira https://SEU_DOMINIO/api/... (via nginx),
    // evitando o mixed content do http://host:8080 que o navegador bloqueia em página HTTPS.
    // Em dev, passa pelo proxy do Vite (/api -> localhost:8080).
    return `/api/agenciamentos/fotos/${nomeArmazenado}`;
  },
};

export default api;