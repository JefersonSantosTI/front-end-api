import ListaExercicios from "./services/ListaExercicio";
import { useState, useEffect, useCallback, useRef } from "react";
import ChatReceitas from "./pages/ChatReceitas";
import Login from "./components/Login";
import TelaPlanos from "./components/TelaPlanos";

function App() {
  const [treinoIAPescado, setTreinoIAPescado] = useState(null);
  const [usuario, setUsuario] = useState(() => localStorage.getItem("usuario_whatsapp"));
  const [isVip, setIsVip] = useState(() => localStorage.getItem("acesso_vip") === "true");
  const [abaAtiva, setAbaAtiva] = useState("home");
  const [bloqueado, setBloqueado] = useState(false);
  const [modalidadeAberta, setModalidadeAberta] = useState(null);

  const verificandoRef = useRef(false);

  const [perfil, setPerfil] = useState({
    nome: localStorage.getItem("perfil_nome") || "Guerreiro(a)",
    peso: localStorage.getItem("perfil_peso") || "0",
    altura: localStorage.getItem("perfil_altura") || "0",
    meta: localStorage.getItem("perfil_meta") || "Emagrecimento",
    faltam: localStorage.getItem("perfil_faltam") || "0",
  });

  const API_URL = "https://api-backend-treino-fit.onrender.com/api";

  const sincronizarEstadosLocais = useCallback(() => {
    const p = localStorage.getItem("perfil_peso") || "0";
    const a = localStorage.getItem("perfil_altura") || "0";
    const v = localStorage.getItem("acesso_vip") === "true";
    const faltaCalc = (parseFloat(p) * 0.1).toFixed(1);

    setPerfil({
      nome: localStorage.getItem("perfil_nome") || "Guerreiro(a)",
      peso: p,
      altura: a,
      meta: localStorage.getItem("perfil_meta") || "Emagrecimento",
      faltam: localStorage.getItem("perfil_faltam") !== "0" ? localStorage.getItem("perfil_faltam") : faltaCalc,
    });
    setIsVip(v);
  }, []);

  const verificarAcessoNoBanco = useCallback(async (idForcado) => {
    const whats = idForcado || usuario;
    if (!whats || verificandoRef.current) return;

    try {
      verificandoRef.current = true;
      const whatsLimpo = String(whats).replace(/\D/g, "");
      const response = await fetch(`${API_URL}/usuarios/${whatsLimpo}`);

      if (response.ok) {
        const dados = await response.json();
        if (dados.treinoIA) setTreinoIAPescado(dados.treinoIA);

        localStorage.setItem("perfil_nome", dados.nome || "Guerreiro(a)");
        localStorage.setItem("perfil_peso", dados.peso || "0");
        localStorage.setItem("perfil_altura", dados.altura || "0");
        localStorage.setItem("perfil_meta", dados.meta || "Emagrecimento");
        localStorage.setItem("acesso_vip", dados.pago ? "true" : "false");

        sincronizarEstadosLocais();
      }
    } catch (err) {
      console.error("Erro na sincronização:", err);
    } finally {
      verificandoRef.current = false;
    }
  }, [API_URL, sincronizarEstadosLocais, usuario]);

  useEffect(() => {
    if (usuario) verificarAcessoNoBanco();
  }, [usuario, verificarAcessoNoBanco]);

  const handleLogin = (whatsapp) => {
    const limpo = String(whatsapp).replace(/\D/g, "");
    localStorage.setItem("usuario_whatsapp", limpo);
    setUsuario(limpo);
  };

  const handleSair = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (!usuario) return <Login aoLogar={handleLogin} />;

  return (
    <div className="fixed inset-0 bg-gray-950 text-white flex flex-col overflow-hidden font-sans">

      {/* ABA HOME */}
      {abaAtiva === "home" && (
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
          <header className="w-full max-w-md flex justify-between items-center mt-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-black font-black shadow-[0_0_15px_rgba(16,185,129,0.3)]">FIT</div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest text-left">Plano {isVip ? 'Premium' : 'Free'}</p>
                <h2 className="text-xl font-black uppercase tracking-tighter">{perfil.nome}</h2>
              </div>
            </div>
            <button
              onClick={() => !isVip && setBloqueado(true)}
              className={`px-4 py-2 rounded-2xl border ${isVip ? 'border-emerald-500 text-emerald-500' : 'border-orange-500 text-orange-500 animate-pulse'} text-[10px] font-black uppercase tracking-widest`}
            >
              {isVip ? "💎 VIP" : "⚡ VIRAR VIP"}
            </button>
          </header>

          <main className="w-full max-w-md flex flex-col items-center">
            {/* Círculo de Progresso */}
            <div className="relative w-56 h-56 mb-8 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                <circle cx="112" cy="112" r="95" stroke="#111827" strokeWidth="14" fill="transparent" />
                <circle cx="112" cy="112" r="95" stroke="#10b981" strokeWidth="14" fill="transparent"
                  strokeDasharray="597"
                  strokeDashoffset={597 - (597 * (perfil.peso !== "0" ? 0.75 : 0.1))}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-5xl font-black">{perfil.faltam}</span>
                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.2em]">kg para a meta</span>
              </div>
            </div>

            {/* Card Principal Glassmorphism */}
            <div className="w-full mb-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-emerald-500 font-black italic tracking-tighter text-[11px] uppercase mb-1 text-left">Status Real</p>
                  <h3 className="text-4xl font-black tracking-tighter">{perfil.peso}<span className="text-lg text-gray-500 font-medium ml-1">kg</span></h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Altura</p>
                  <p className="text-lg font-bold text-white tracking-tighter">{perfil.altura}m</p>
                </div>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full mt-5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 w-[70%] shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
              </div>
            </div>

            {/* Grid de Status */}
            <div className="grid grid-cols-2 gap-3 w-full mb-8">
              <div className="bg-gray-900/60 p-5 rounded-[2.2rem] border border-white/5">
                <p className="text-[9px] text-gray-500 uppercase font-black mb-1 text-left">Meta</p>
                <p className="text-xs font-bold text-emerald-400 uppercase text-left">{perfil.meta}</p>
              </div>
              <div className="bg-gray-900/60 p-5 rounded-[2.2rem] border border-white/5">
                <p className="text-[9px] text-gray-500 uppercase font-black mb-1 text-left">Status IA</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                  <p className="text-xs font-bold text-white uppercase italic">Online</p>
                </div>
              </div>
            </div>

            {/* Botões de Ação Principais e Logout */}
            <div className="w-full space-y-4 mb-10 text-center">
              <button onClick={() => setAbaAtiva("chat")} className="w-full bg-emerald-500 text-black font-black py-6 rounded-[2.2rem] uppercase text-sm active:scale-95 transition-all shadow-[0_15px_30px_rgba(16,185,129,0.25)]">
                💬 Consultoria Mentor IA
              </button>

              <button onClick={() => setAbaAtiva("treino")} className="w-full bg-white/5 text-white border border-white/10 font-black py-6 rounded-[2.2rem] uppercase text-sm active:scale-95 transition-all">
                💪 Meus Protocolos
              </button>

              {/* BOTÃO ENCERRAR SESSÃO - REPOSICIONADO AQUI */}
              <button
                onClick={handleSair}
                className="pt-4 pb-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 hover:text-red-500 transition-colors active:scale-90"
              >
                [ Encerrar Sessão ]
              </button>
            </div>
          </main>
        </div>
      )}

      {/* ABA CHAT NUTRI */}
      {abaAtiva === "chat" && (
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-950">
          <header className="p-4 flex items-center border-b border-white/5 bg-gray-950/80 backdrop-blur-md z-10">
            <button onClick={() => setAbaAtiva("home")} className="text-emerald-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              <span className="text-lg">←</span> Voltar ao Painel
            </button>
          </header>
          <div className="flex-1 overflow-hidden">
            <ChatReceitas
              whatsapp={usuario}
              isVip={isVip}
              aoPedirUpgrade={() => setBloqueado(true)}
              aoAtualizarPerfil={verificarAcessoNoBanco}
            />
          </div>
        </div>
      )}

      {/* ABA TREINOS */}
      {abaAtiva === "treino" && (
        <div className="flex-1 flex flex-col bg-gray-950">
          <header className="p-6 flex justify-between items-center border-b border-white/5">
            <button onClick={() => setAbaAtiva("home")} className="text-emerald-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              <span className="text-lg">←</span> Voltar
            </button>
            <h3 className="text-white font-black italic uppercase tracking-tighter">Protocolos IA</h3>
          </header>

          <div className="p-6 space-y-4">

            {/* NOVO: Se a IA já gerou um treino, ele aparece aqui primeiro! */}
            {treinoIAPescado && (
              <button
                onClick={() => setModalidadeAberta('ia')}
                className="w-full bg-gradient-to-r from-emerald-900/40 to-blue-900/40 p-7 rounded-[2.5rem] border border-emerald-500/30 flex items-center gap-5 active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.1)]"
              >
                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-3xl shadow-[0_0_15px_#10b981]">🤖</div>
                <div className="text-left">
                  <p className="font-black uppercase text-lg leading-tight tracking-tighter text-emerald-400">Meu Treino IA</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold text-left text-pretty">Gerado especialmente para você</p>
                </div>
              </button>
            )}

            <button onClick={() => setModalidadeAberta('academia')} className="w-full bg-gray-900/50 p-7 rounded-[2.5rem] border border-white/5 flex items-center gap-5 active:scale-95 transition-all">
              <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center text-3xl shadow-inner">🏋️‍♂️</div>
              <div className="text-left">
                <p className="font-black uppercase text-lg leading-tight tracking-tighter text-left">Academia</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold text-left">Aparelhos e Alta Carga</p>
              </div>
            </button>

            <button onClick={() => setModalidadeAberta('casa')} className="w-full bg-gray-900/50 p-7 rounded-[2.5rem] border border-white/5 flex items-center gap-5 active:scale-95 transition-all">
              <div className="w-14 h-14 bg-emerald-600/20 rounded-2xl flex items-center justify-center text-3xl shadow-inner text-left">🏠</div>
              <div className="text-left">
                <p className="font-black uppercase text-lg leading-tight tracking-tighter text-left">Treino em Casa</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold text-left">Peso Corporal e Funcional</p>
              </div>
            </button>
          </div>

          {modalidadeAberta && (
            <ListaExercicios
              modalidade={modalidadeAberta}
              whatsapp={usuario}
              API_URL={API_URL}
              perfil={perfil}
              treinoIA={treinoIAPescado} // Passando o treino pescado para o componente
              aoFechar={() => setModalidadeAberta(null)}
            />
          )}
        </div>
      )}

      {/* MODAL PLANOS */}
      {bloqueado && (
        <div className="fixed inset-0 z-[500] bg-gray-950 flex flex-col items-center p-6 overflow-y-auto">
          <button onClick={() => setBloqueado(false)} className="absolute top-6 right-6 text-white font-black bg-white/10 w-10 h-10 rounded-full">✕</button>
          <TelaPlanos aoEscolher={() => { }} />
        </div>
      )}
    </div>
  );
}

export default App;