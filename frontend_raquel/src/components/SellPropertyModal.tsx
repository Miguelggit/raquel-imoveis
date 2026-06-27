import { useState } from "react";
interface SellModalProps { aberto: boolean; onFechar: () => void; }
export default function SellPropertyModal({ aberto, onFechar }: SellModalProps) {
  const [nome, setNome] = useState(""); const [tel, setTel] = useState(""); const [tipo, setTipo] = useState(""); const [bairro, setBairro] = useState(""); const [msg, setMsg] = useState(""); const [ok, setOk] = useState(false);
  if (!aberto) return null;
  const enviar = () => {
    if (!nome.trim() || !tel.trim()) return;
    const t = [`Olá Raquel! Quero vender meu imóvel.`, ``, `Nome: ${nome}`, `Telefone: ${tel}`, tipo ? `Tipo: ${tipo}` : "", bairro ? `Bairro: ${bairro}` : "", msg ? `Obs: ${msg}` : ""].filter(Boolean).join("\n");
    window.open(`https://wa.me/5554996582058?text=${encodeURIComponent(t)}`, "_blank");
    setOk(true); setTimeout(() => { setOk(false); setNome(""); setTel(""); setTipo(""); setBairro(""); setMsg(""); onFechar(); }, 2000);
  };
  const inp = "w-full px-4 py-3 bg-white border border-gray-200 rounded-sm text-gray-900 text-sm placeholder-gray-300 outline-none focus:border-[#EA580C] transition-colors";
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4" onClick={onFechar}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-white rounded-lg overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#EA580C] px-8 py-6"><h2 className="text-xl font-bold text-white">Venda seu imóvel</h2><p className="text-white/80 text-sm mt-1">Preencha seus dados e a Raquel entrará em contato</p></div>
        <div className="p-8 flex flex-col gap-4">
          <div><label className="block text-[.7rem] text-gray-400 uppercase tracking-wider mb-2">Nome *</label><input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome completo" className={inp} /></div>
          <div><label className="block text-[.7rem] text-gray-400 uppercase tracking-wider mb-2">WhatsApp *</label><input type="tel" value={tel} onChange={(e) => setTel(e.target.value)} placeholder="(54) 9 0000-0000" className={inp} /></div>
          <div><label className="block text-[.7rem] text-gray-400 uppercase tracking-wider mb-2">Tipo de imóvel</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} className={`${inp} appearance-none cursor-pointer`}>
              <option value="">Selecione</option><option value="Casa">Casa</option><option value="Apartamento">Apartamento</option><option value="Terreno">Terreno</option><option value="Sobrado">Sobrado</option><option value="Outro">Outro</option>
            </select></div>
          <div><label className="block text-[.7rem] text-gray-400 uppercase tracking-wider mb-2">Bairro</label><input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} placeholder="Ex: Lourdes, Caxias" className={inp} /></div>
          <div><label className="block text-[.7rem] text-gray-400 uppercase tracking-wider mb-2">Observações</label><textarea value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Conte sobre o imóvel..." rows={3} className={`${inp} resize-none`} /></div>
          <div className="flex gap-3 mt-2">
            <button onClick={onFechar} className="flex-1 py-3 bg-transparent border border-gray-200 text-gray-500 text-sm font-medium rounded-sm cursor-pointer hover:border-gray-400 hover:text-gray-700 transition-all">Cancelar</button>
            <button onClick={enviar} disabled={!nome.trim() || !tel.trim()} className="flex-1 py-3 bg-[#25D366] text-white text-sm font-semibold rounded-sm cursor-pointer hover:bg-[#1da851] disabled:opacity-30 disabled:cursor-not-allowed transition-all">{ok ? "Enviado!" : "Enviar via WhatsApp"}</button>
          </div>
        </div>
        <button onClick={onFechar} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/70 hover:text-white bg-transparent border-none cursor-pointer text-lg">✕</button>
      </div>
    </div>
  );
}
