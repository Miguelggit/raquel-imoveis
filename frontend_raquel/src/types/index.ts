export interface Agenciamento {
  id: number;
  codigoAgs: string;
  titulo: string;
  descricao: string;
  tipoImovel: string;
  status: string;
  valorVenda: number;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
  complemento: string;
  areaM2: number;
  quartos: number;
  banheiros: number;
  vagasGaragem: number;
  posicaoSolar: string;
  suite: number;
  criadoEM: string;
  atualizadoEM: string;
}

export interface AgenciamentoResumo {
  id: number;
  codigoAgs: string;
  titulo: string;
  tipoImovel: string;
  status: string;
  valorVenda: number;
  cidade: string;
  bairro: string;
  areaM2: number;
  quartos: number;
  banheiros: number;
  vagasGaragem: number;
  posicaoSolar: string;
  suite: number;
}

export interface AgenciamentoPage {
  content: AgenciamentoResumo[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface Foto {
  id: number;
  nomeArquivo: string;
  nomeArmazenado: string;
  contentType: string;
  tamanho: number;
  url: string;
  agenciamentoId: number;
  criadoEM: string;
}

export interface FiltrosAgenciamento {
  tipoImovel?: string;
  status?: string;
  cidade?: string;
  bairro?: string;
  precoMin?: number;
  precoMax?: number;
  incluirInativos?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}