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
    const pNum = parseFloat(p);
    const faltaCalc = pNum > 0 ? (pNum * 0.1).toFixed(1) : "0";

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

        // 1. SÓ ATUALIZA SE OS DADOS FOREM VÁLIDOS (Resolve o "aparece e some")
        if (dados.nome) localStorage.setItem("perfil_nome", dados.nome);

        // Validação de Peso e Altura: Só grava se for > 0
        if (dados.peso && Number(dados.peso) > 0) {
          localStorage.setItem("perfil_peso", String(dados.peso));
        }
        if (dados.altura && Number(dados.altura) > 0) {
          localStorage.setItem("perfil_altura", String(dados.altura));
        }

        if (dados.meta) localStorage.setItem("perfil_meta", dados.meta);
        localStorage.setItem("acesso_vip", dados.pago ? "true" : "false");

        // 2. PESCA O TREINO SE EXISTIR
        if (dados.treinoIA) setTreinoIAPescado(dados.treinoIA);

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
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-black font-black">FIT</div>
              <div className="text-left">
                <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">Plano {isVip ? 'Premium' : 'Free'}</p>
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
              <svg className="w-full h-full -rotate-90">
                <circle cx="112" cy="112" r="95" stroke="#111827" strokeWidth="14" fill="transparent" />
                <circle cx="112" cy="112" r="95" stroke="#10b981" strokeWidth="14" fill="transparent"
                  strokeDasharray="597"
                  strokeDashoffset={597 - (597 * (parseFloat(perfil.peso) > 0 ? 0.75 : 0.1))}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-5xl font-black">{perfil.faltam}</span>
                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.2em]">kg para a meta</span>
              </div>
            </div>

            {/* Card Principal */}
            <div className="w-full mb-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6">
              <div className="flex justify-between items-end">
                <div className="text-left">
                  <p className="text-emerald-500 font-black italic text-[11px] uppercase mb-1">Status Atual</p>
                  <h3 className="text-4xl font-black">{perfil.peso}<span className="text-lg text-gray-500 font-medium ml-1">kg</span></h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-black uppercase">Altura</p>
                  <p className="text-lg font-bold text-white">{perfil.altura}m</p>
                </div>
              </div>
            </div>

            <div className="w-full space-y-4 mb-10">
              <button onClick={() => setAbaAtiva("chat")} className="w-full bg-emerald-500 text-black font-black py-6 rounded-[2.2rem] uppercase text-sm shadow-lg">
                💬 Consultoria & Nutrição
              </button>

              <button onClick={() => setAbaAtiva("treino")} className="w-full bg-white/5 text-white border border-white/10 font-black py-6 rounded-[2.2rem] uppercase text-sm">
                💪 Área de Treinos
              </button>

              <button onClick={handleSair} className="w-full text-[10px] font-black uppercase text-gray-600 tracking-widest pt-2">
                [ Encerrar Sessão ]
              </button>
            </div>
          </main>
        </div>
      )}

      {/* ABA CHAT */}
      {abaAtiva === "chat" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="p-4 flex items-center border-b border-white/5 bg-gray-950">
            <button onClick={() => setAbaAtiva("home")} className="text-emerald-500 font-black text-[10px] uppercase">
              ← Voltar ao Início
            </button>
          </header>
          <ChatReceitas
            whatsapp={usuario}
            isVip={isVip}
            aoPedirUpgrade={() => setBloqueado(true)}
            aoAtualizarPerfil={verificarAcessoNoBanco}
            setTreinoIAPescado={setTreinoIAPescado}
          />
        </div>
      )}

      {/* ABA TREINOS (HÍBRIDA) */}
      {abaAtiva === "treino" && (
        <div className="flex-1 flex flex-col bg-gray-950 p-6 overflow-y-auto">
          <header className="flex justify-between items-center mb-8">
            <button onClick={() => setAbaAtiva("home")} className="text-emerald-500 font-black text-[10px] uppercase">← Voltar</button>
            <h3 className="text-white font-black italic uppercase tracking-tighter">Central de Treinos</h3>
          </header>

          <div className="space-y-4">
            {/* BOTÃO 1: MENTOR IA (COM REDIRECIONAMENTO DIRETO) */}
            <button
              onClick={() => {
                if (isVip) {
                  // Se for VIP, abre a modalidade de IA normalmente
                  setModalidadeAberta('ia');
                } else {
                  // Se NÃO for VIP, joga direto para a tela de planos
                  setBloqueado(true);
                }
              }}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-400 p-7 rounded-[2.5rem] flex items-center gap-5 shadow-lg relative overflow-hidden active:scale-95 transition-transform"
            >
              <div className="text-3xl">🤖</div>
              <div className="text-left">
                <p className="font-black uppercase text-lg leading-tight text-white">Mentor IA</p>
                <p className="text-[10px] text-orange-100 uppercase font-bold text-left">Exclusivo para Membros VIP</p>
              </div>

              {/* Badge de destaque para quem é Grátis */}
              {!isVip && (
                <div className="absolute -right-2 -top-1 bg-white/20 px-4 py-2 rotate-12">
                  <span className="text-[9px] font-black text-white uppercase">Bloqueado</span>
                </div>
              )}
            </button>

            {/* BOTÃO 2: ACADEMIA (GRATUITO) */}
            <button
              onClick={() => setModalidadeAberta('academia')}
              className="w-full bg-blue-600 p-7 rounded-[2.5rem] flex items-center gap-5 shadow-lg active:scale-95 transition-transform"
            >
              <div className="text-3xl">🏋️‍♂️</div>
              <div className="text-left">
                <p className="font-black uppercase text-lg leading-tight text-white">Academia (ABC)</p>
                <p className="text-[10px] text-blue-100 uppercase font-bold">Acesso Liberado</p>
              </div>
            </button>

            {/* BOTÃO 3: EM CASA (GRATUITO) */}
            <button onClick={() => setModalidadeAberta('casa')} className="w-full bg-emerald-600 p-7 rounded-[2.5rem] flex items-center gap-5 shadow-lg">
              <div className="text-3xl">🏠</div>
              <div className="text-left">
                <p className="font-black uppercase text-lg leading-tight text-white">Treino em Casa</p>
                <p className="text-[10px] text-emerald-100 uppercase font-bold text-left">Funcional e HIIT</p>
              </div>
            </button>
          </div>

          {modalidadeAberta && (
            <ListaExercicios
              modalidade={modalidadeAberta}
              whatsapp={usuario}
              API_URL={API_URL}
              perfil={perfil}
              treinoIA={treinoIAPescado}
              aoFechar={() => setModalidadeAberta(null)}
            />
          )}
        </div>
      )}

      {/* MODAL PLANOS */}
      {bloqueado && (
        <div className="fixed inset-0 z-[500] bg-gray-950 flex flex-col items-center p-6 overflow-y-auto">
          <button onClick={() => setBloqueado(false)} className="absolute top-6 right-6 text-white font-black bg-white/10 w-10 h-10 rounded-full">✕</button>
          <TelaPlanos />
        </div>
      )}
    </div>
  );
}

export default App;