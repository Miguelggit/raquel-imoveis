import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { agenciamentoService, authService } from "../../services/api";

const TIPOS = ["CASA", "APARTAMENTO", "TERRENO", "SOBRADO", "SALA_COMERCIAL", "CHACARA"];
const STATUS = ["DISPONIVEL", "RESERVADO", "VENDIDO", "INATIVO"];
// No cadastro o backend rejeita estes; só ficam disponíveis na edição.
const STATUS_BLOQUEADOS_NO_CADASTRO = ["VENDIDO", "INATIVO"];

export default function AdminForm() {
  const { id } = useParams<{ id: string }>();
  const isEdicao = !!id;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    tipoImovel: "CASA",
    status: "DISPONIVEL",
    valorVenda: "",
    cidade: "",
    bairro: "",
    rua: "",
    numero: "",
    complemento: "",
    areaM2: "",
    quartos: "",
    banheiros: "",
    vagasGaragem: "",
    posicaoSolar: "",
    suite: "",
    slideshow: false,
    destaque: false,
  });

  useEffect(() => {
    if (!authService.isLoggedIn()) { navigate("/admin/login"); return; }
    if (isEdicao) {
      setLoading(true);
      agenciamentoService.buscarPorId(parseInt(id!))
        .then((ag) => {
          setForm({
            titulo: ag.titulo || "",
            descricao: ag.descricao || "",
            tipoImovel: ag.tipoImovel || "CASA",
            status: ag.status || "DISPONIVEL",
            valorVenda: ag.valorVenda?.toString() || "",
            cidade: ag.cidade || "",
            bairro: ag.bairro || "",
            rua: ag.rua || "",
            numero: ag.numero || "",
            complemento: ag.complemento || "",
            areaM2: ag.areaM2?.toString() || "",
            quartos: ag.quartos?.toString() || "",
            banheiros: ag.banheiros?.toString() || "",
            vagasGaragem: ag.vagasGaragem?.toString() || "",
            posicaoSolar: ag.posicaoSolar || "",
            suite: ag.suite?.toString() || "",
            slideshow: ag.slideshow ?? false,
            destaque: ag.destaque ?? false,
          });
        })
        .catch(() => setErro("Erro ao carregar imóvel"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const value =
      target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
    setForm({ ...form, [target.name]: value });
  };

  const handleSalvar = async () => {
    setErro(""); setSucesso(""); setSalvando(true);
    try {
      const payload: Record<string, unknown> = {
        titulo: form.titulo,
        descricao: form.descricao || null,
        tipoImovel: form.tipoImovel,
        valorVenda: parseFloat(form.valorVenda),
        cidade: form.cidade,
        bairro: form.bairro,
        rua: form.rua || null,
        numero: form.numero || null,
        complemento: form.complemento || null,
        areaM2: form.areaM2 ? parseFloat(form.areaM2) : null,
        quartos: form.quartos ? parseInt(form.quartos) : null,
        banheiros: form.banheiros ? parseInt(form.banheiros) : null,
        vagasGaragem: form.vagasGaragem ? parseInt(form.vagasGaragem) : null,
        posicaoSolar: form.posicaoSolar || null,
        suite: form.suite ? parseInt(form.suite) : null,
        slideshow: form.slideshow,
        destaque: form.destaque,
      };

      // Status enviado tanto no cadastro quanto na edição.
      payload.status = form.status;

      if (isEdicao) {
        await agenciamentoService.atualizar(parseInt(id!), payload);
        setSucesso("Imóvel atualizado com sucesso!");
      } else {
        const novo = await agenciamentoService.criar(payload);
        setSucesso("Imóvel cadastrado! Redirecionando para fotos...");
        setTimeout(() => navigate(`/admin/fotos/${novo.id}`), 1500);
      }
    } catch (err: any) {
      const data = err.response?.data;
      // Se o backend retornou erros de validação por campo, mostra quais campos falharam.
      if (data?.fields?.length) {
        setErro(
          data.fields
            .map((f: { name: string; message: string }) => `${f.name}: ${f.message}`)
            .join(" · ")
        );
      } else {
        setErro(data?.message || "Erro ao salvar. Verifique os campos obrigatórios.");
      }
    } finally {
      setSalvando(false);
    }
  };

  const inp = "w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-sm text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/10 transition-colors";
  const lbl = "block text-xs text-gray-500 uppercase tracking-wider mb-2";

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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold tracking-tight mb-8">
          {isEdicao ? "Editar imóvel" : "Novo imóvel"}
        </h1>

        {erro && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm text-red-600 text-sm">{erro}</div>}
        {sucesso && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-sm text-green-600 text-sm">{sucesso}</div>}

        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 sm:p-8">
          <div className="flex flex-col gap-6">

            {/* Título */}
            <div>
              <label className={lbl}>Título *</label>
              <input type="text" name="titulo" value={form.titulo} onChange={handleChange} placeholder="Ex: Casa com piscina no Lourdes" className={inp} />
            </div>

            {/* Tipo + Valor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={lbl}>Tipo de imóvel *</label>
                <select name="tipoImovel" value={form.tipoImovel} onChange={handleChange} className={`${inp} appearance-none cursor-pointer`}>
                  {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Valor de venda (R$) *</label>
                <input type="number" name="valorVenda" value={form.valorVenda} onChange={handleChange} placeholder="500000" className={inp} />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className={lbl}>Status *</label>
              <select name="status" value={form.status} onChange={handleChange} className={`${inp} appearance-none cursor-pointer`}>
                {(isEdicao ? STATUS : STATUS.filter((s) => !STATUS_BLOQUEADOS_NO_CADASTRO.includes(s))).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Descrição */}
            <div>
              <label className={lbl}>Descrição</label>
              <textarea name="descricao" value={form.descricao} onChange={handleChange} placeholder="Descreva o imóvel..." rows={4} className={`${inp} resize-none`} />
            </div>

            {/* Localização */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#EA580C] mb-4">Localização</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className={lbl}>Cidade *</label><input type="text" name="cidade" value={form.cidade} onChange={handleChange} placeholder="Caxias do Sul" className={inp} /></div>
                <div><label className={lbl}>Bairro *</label><input type="text" name="bairro" value={form.bairro} onChange={handleChange} placeholder="Lourdes" className={inp} /></div>
                <div><label className={lbl}>Rua</label><input type="text" name="rua" value={form.rua} onChange={handleChange} placeholder="Rua das Hortênsias" className={inp} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={lbl}>Número</label><input type="text" name="numero" value={form.numero} onChange={handleChange} placeholder="420" className={inp} /></div>
                  <div><label className={lbl}>Complemento</label><input type="text" name="complemento" value={form.complemento} onChange={handleChange} placeholder="Apto 801" className={inp} /></div>
                </div>
              </div>
            </div>

            {/* Características */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#EA580C] mb-4">Características</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div><label className={lbl}>Área (m²) *</label><input type="number" name="areaM2" value={form.areaM2} onChange={handleChange} placeholder="180" className={inp} /></div>
                <div><label className={lbl}>Quartos</label><input type="number" name="quartos" value={form.quartos} onChange={handleChange} placeholder="3" className={inp} /></div>
                <div><label className={lbl}>Banheiros</label><input type="number" name="banheiros" value={form.banheiros} onChange={handleChange} placeholder="2" className={inp} /></div>
                <div><label className={lbl}>Vagas</label><input type="number" name="vagasGaragem" value={form.vagasGaragem} onChange={handleChange} placeholder="2" className={inp} /></div>
                <div><label className={lbl}>Suítes</label><input type="number" name="suite" value={form.suite} onChange={handleChange} placeholder="1" className={inp} /></div>
                <div><label className={lbl}>Posição solar</label><input type="text" name="posicaoSolar" value={form.posicaoSolar} onChange={handleChange} placeholder="Norte" className={inp} /></div>
              </div>
            </div>

            {/* Exibição na home */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#EA580C] mb-4">Exibição na página inicial</p>
              <div className="flex flex-col gap-3">
                <label className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-sm cursor-pointer hover:border-[#EA580C]/40 transition-colors">
                  <input
                    type="checkbox"
                    name="slideshow"
                    checked={form.slideshow}
                    onChange={handleChange}
                    className="mt-0.5 w-4 h-4 accent-[#EA580C] cursor-pointer"
                  />
                  <span>
                    <span className="block text-sm font-medium text-gray-900">Aparecer no slideshow da capa</span>
                    <span className="block text-xs text-gray-400 mt-0.5">O imóvel entra no carrossel de fotos grandes no topo da página inicial.</span>
                  </span>
                </label>
                <label className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-sm cursor-pointer hover:border-[#EA580C]/40 transition-colors">
                  <input
                    type="checkbox"
                    name="destaque"
                    checked={form.destaque}
                    onChange={handleChange}
                    className="mt-0.5 w-4 h-4 accent-[#EA580C] cursor-pointer"
                  />
                  <span>
                    <span className="block text-sm font-medium text-gray-900">Aparecer nos destaques</span>
                    <span className="block text-xs text-gray-400 mt-0.5">O imóvel entra na seção "Destaques" (carrossel de cards) da página inicial.</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 mt-4 pt-6 border-t border-gray-100">
              <button
                onClick={handleSalvar}
                disabled={salvando || !form.titulo || !form.valorVenda || !form.cidade || !form.bairro || !form.areaM2}
                className="px-8 py-3 bg-[#EA580C] text-white text-sm font-semibold rounded-sm cursor-pointer hover:bg-[#C2410C] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {salvando ? "Salvando..." : isEdicao ? "Atualizar" : "Cadastrar"}
              </button>
              <Link to="/admin" className="px-8 py-3 border border-gray-200 text-gray-500 no-underline text-sm font-medium rounded-sm hover:bg-gray-50 transition-all flex items-center justify-center">
                Cancelar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
