import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      await authService.login(email, senha);
      navigate("/admin");
    } catch {
      setErro("Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Raquel<span className="text-[#EA580C]">.</span>
          </h1>
          <p className="text-sm text-gray-400 mt-2">Painel administrativo</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-8">
          <h2 className="text-lg font-semibold mb-6">Entrar</h2>

          {erro && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-sm text-red-600 text-sm">
              {erro}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="raquel@raquelimoveis.com.br"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-sm text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/10 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-sm text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#EA580C] focus:ring-2 focus:ring-[#EA580C]/10 transition-colors"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loading || !email || !senha}
              className="w-full py-3 bg-[#EA580C] text-white text-sm font-semibold rounded-sm cursor-pointer transition-all hover:bg-[#C2410C] disabled:opacity-40 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-300 mt-6">
          Desenvolvido por Stenix
        </p>
      </div>
    </div>
  );
}
