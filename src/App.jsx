import { useState } from "react";
import ChatReceitas from "./pages/ChatReceitas";
import Login from "./components/Login";
import TelaPlanos from "./components/TelaPlanos";

function App() {
  const [usuario, setUsuario] = useState(() => localStorage.getItem("usuario_whatsapp"));
  const [isVip, setIsVip] = useState(() => localStorage.getItem("acesso_vip") === "true");
  const [abaAtiva, setAbaAtiva] = useState("home");
  const [bloqueado, setBloqueado] = useState(false);
  const [codigoInput, setCodigoInput] = useState("");

  // URL da sua API (Altere para a URL real se estiver em produção)
  const API_URL = "http://localhost:5000/api/receitas";

  const obterDadosPerfil = () => ({
    nome: localStorage.getItem("perfil_nome") || "Guerreiro(a)",
    peso: localStorage.getItem("perfil_peso") || "0",
    altura: localStorage.getItem("perfil_altura") || "0",
    meta: localStorage.getItem("perfil_meta") || "---",
    faltam: localStorage.getItem("perfil_faltam") || "0",
    diasRestantes: localStorage.getItem("perfil_dias") || "0"
  });

  const dadosPerfil = obterDadosPerfil();

  const handleLogin = (whatsapp) => {
    localStorage.setItem("usuario_whatsapp", whatsapp);
    setUsuario(whatsapp);
    setAbaAtiva("home");
  };

  // --- ATUALIZADO: AGORA FALA COM O BACK-END ---
  const liberarComCodigo = async () => {
    const CODIGO_CORRETO = "TREINOFIT2026";

    if (codigoInput.trim().toUpperCase() === CODIGO_CORRETO) {
      try {
        // 1. Avisa o Back-end para mudar o status no Banco de Dados
        const response = await fetch(`${API_URL}/tornarVip`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ whatsapp: usuario })
        });

        if (response.ok) {
          // 2. Atualiza o estado local apenas se o back-end confirmar
          localStorage.setItem("acesso_vip", "true");
          localStorage.setItem("perfil_dias", "30");
          setIsVip(true);
          setBloqueado(false);
          alert("✅ Acesso VIP liberado com sucesso no sistema!");
        } else {
          alert("⚠️ Erro ao validar VIP no servidor.");
        }
      } catch (error) {
        console.error("Erro ao ativar VIP:", error);
        alert("❌ Falha na conexão com o servidor.");
      }
    } else {
      alert("❌ Código inválido.");
    }
  };

  if (!usuario) return <Login aoLogar={handleLogin} />;

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans overflow-x-hidden">

      {abaAtiva === "home" && (
        <div className="max-w-md mx-auto min-h-screen p-6 flex flex-col animate-in fade-in duration-700">
          <header className="flex justify-between items-center mt-4 mb-10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)] text-black font-black">FIT</div>
              <div className="flex flex-col">
                <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.2em] leading-none mb-1">Membro Fit</p>
                <h2 className="text-xl font-black italic tracking-tighter uppercase text-white">{dadosPerfil.nome}</h2>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="bg-gray-900/80 border border-gray-800 rounded-2xl px-4 py-2 flex items-baseline space-x-1 shadow-lg">
                <span className="text-2xl font-black text-emerald-500">{dadosPerfil.diasRestantes}</span>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Dias</span>
              </div>
              <button onClick={() => setBloqueado(true)} className="mt-1 text-[10px] font-black text-orange-500 uppercase tracking-tighter">
                {isVip ? "Plano Ativo 💎" : "Renovar Plano ⚡"}
              </button>
            </div>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center">
            {/* Círculo de Progresso */}
            <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-gray-900" />
                <circle
                  cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="12" fill="transparent"
                  strokeDasharray="691"
                  strokeDashoffset={dadosPerfil.faltam === "0" ? "691" : "450"}
                  strokeLinecap="round"
                  className="text-emerald-500 transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-1">Faltam</p>
                <h3 className="text-6xl font-black tracking-tighter">{dadosPerfil.faltam}</h3>
                <p className="text-lg font-bold text-emerald-500 uppercase tracking-tighter">kg para a Meta</p>
              </div>
            </div>

            {/* Cards de Info */}
            <div className="grid grid-cols-3 gap-3 w-full mb-10">
              <div className="bg-gray-900/40 border border-gray-800/50 p-4 rounded-[2.5rem] text-center">
                <p className="text-[8px] text-gray-500 uppercase font-black mb-1">Peso</p>
                <p className="text-sm font-bold">{dadosPerfil.peso}kg</p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-[2.5rem] text-center">
                <p className="text-[8px] text-emerald-500/70 uppercase font-black mb-1">Altura</p>
                <p className="text-sm font-bold text-emerald-400">{dadosPerfil.altura}m</p>
              </div>
              <div className="bg-gray-900/40 border border-gray-800/50 p-4 rounded-[2.5rem] text-center">
                <p className="text-[8px] text-gray-500 uppercase font-black mb-1">Meta</p>
                <p className="text-sm font-bold text-white uppercase italic">{dadosPerfil.meta}</p>
              </div>
            </div>

            <button onClick={() => setAbaAtiva("chat")} className="w-full bg-emerald-500 text-black font-black py-6 rounded-[2.5rem] shadow-xl flex items-center justify-center space-x-4 uppercase text-sm">
              <span>💬</span>
              <span>Entrar no Chat Nutri</span>
            </button>
          </main>

          <footer className="mt-8 pb-4 flex justify-center">
            <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">
              — Resetar App —
            </button>
          </footer>
        </div>
      )}

      {abaAtiva === "chat" && (
        <div className="h-screen flex flex-col bg-gray-950">
          <header className="p-4 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
            <button onClick={() => setAbaAtiva("home")} className="bg-emerald-500 text-black px-4 py-2 rounded-xl font-black text-[10px] uppercase">
              🏠 Início
            </button>
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">IA Treino Fit</span>
            <div className="w-16 text-right text-[10px] text-emerald-500 font-bold">{isVip ? "💎 VIP" : "FREE"}</div>
          </header>
          <div className="flex-1 overflow-hidden">
            {/* ENVIANDO DADOS DE PERFIL PARA O CHAT */}
            <ChatReceitas
              whatsapp={usuario}
              isVip={isVip}
              perfil={dadosPerfil} // Agora o Chat sabe o peso e altura do usuário
              aoPedirUpgrade={() => setBloqueado(true)}
            />
          </div>
        </div>
      )}

      {/* Modal de Planos */}
      {bloqueado && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center p-4 bg-gray-950/98 backdrop-blur-xl overflow-y-auto">
          <TelaPlanos aoEscolher={() => { }} />
          <div className="mt-10 w-full max-w-xs bg-gray-900 p-8 rounded-[3rem] border border-gray-800 text-center">
            <input
              type="text"
              placeholder="CÓDIGO VIP..."
              className="bg-gray-950 border-2 border-gray-800 p-4 rounded-2xl w-full text-center text-white mb-6 outline-none"
              value={codigoInput}
              onChange={(e) => setCodigoInput(e.target.value)}
            />
            <button onClick={liberarComCodigo} className="w-full bg-emerald-500 text-black font-black py-5 rounded-2xl uppercase text-xs">Liberar VIP</button>
            <button onClick={() => setBloqueado(false)} className="mt-4 text-gray-500 text-[10px] uppercase underline">Sair</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;