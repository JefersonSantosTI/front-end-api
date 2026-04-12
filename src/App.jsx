import ListaExercicios from "./services/ListaExercicio";
import { useState, useEffect, useCallback, useRef } from "react";
import ChatReceitas from "./pages/ChatReceitas";
import Login from "./components/Login";
import TelaPlanos from "./components/TelaPlanos";

function App() {
  const [usuario, setUsuario] = useState(() => localStorage.getItem("usuario_whatsapp"));
  const [isVip, setIsVip] = useState(() => localStorage.getItem("acesso_vip") === "true");
  const [abaAtiva, setAbaAtiva] = useState("home");
  const [bloqueado, setBloqueado] = useState(false);
  const [codigoInput, setCodigoInput] = useState("");
  const [modalidadeAberta, setModalidadeAberta] = useState(null);

  const verificandoRef = useRef(false);

  const [perfil, setPerfil] = useState({
    nome: localStorage.getItem("perfil_nome") || "Guerreiro(a)",
    peso: localStorage.getItem("perfil_peso") || "0",
    altura: localStorage.getItem("perfil_altura") || "0",
    meta: localStorage.getItem("perfil_meta") || "Defina sua meta",
    faltam: localStorage.getItem("perfil_faltam") || "0",
    diasRestantes: localStorage.getItem("perfil_dias") || "0"
  });

  const API_URL = "https://api-backend-treino-fit.onrender.com/api";

  // --- AJUSTE 1: Sincronização Robusta ---
  const sincronizarEstadosLocais = useCallback(() => {
    const novoVip = localStorage.getItem("acesso_vip") === "true";

    const pesoSalvo = localStorage.getItem("perfil_peso") || "0";
    // Cálculo simples para a meta não ficar em 0: se não houver meta, sugere 10% do peso
    const faltamSalvo = localStorage.getItem("perfil_faltam") || (parseFloat(pesoSalvo) * 0.1).toFixed(1);

    const novoPerfil = {
      nome: localStorage.getItem("perfil_nome") || "Guerreiro(a)",
      peso: pesoSalvo,
      altura: localStorage.getItem("perfil_altura") || "0",
      meta: localStorage.getItem("perfil_meta") || "Defina sua meta",
      faltam: faltamSalvo === "0.0" ? "0" : faltamSalvo,
      diasRestantes: localStorage.getItem("perfil_dias") || "0"
    };

    setIsVip(novoVip);
    setPerfil(novoPerfil);
  }, []);

  // --- AJUSTE 2: Forçar atualização ao trocar de aba ---
  useEffect(() => {
    if (abaAtiva === "home") {
      sincronizarEstadosLocais();
    }
  }, [abaAtiva, sincronizarEstadosLocais]);

  const verificarAcessoNoBanco = useCallback(async (idForcado) => {
    const whats = idForcado || localStorage.getItem("usuario_whatsapp");
    if (!whats || verificandoRef.current) return;

    try {
      verificandoRef.current = true;
      const whatsLimpo = String(whats).replace(/\D/g, "");
      const response = await fetch(`${API_URL}/usuarios/${whatsLimpo}`);

      if (response.ok) {
        const dados = await response.json();
        localStorage.setItem("perfil_nome", dados.nome || "Guerreiro(a)");
        localStorage.setItem("perfil_peso", dados.peso || "0");
        localStorage.setItem("perfil_altura", dados.altura || "0");
        localStorage.setItem("perfil_meta", dados.meta || "Emagrecimento");
        localStorage.setItem("acesso_vip", dados.pago ? "true" : "false");
        sincronizarEstadosLocais();
      }
    } catch (err) {
      console.error("Falha na sincronização:", err);
    } finally {
      verificandoRef.current = false;
    }
  }, [API_URL, sincronizarEstadosLocais]);

  useEffect(() => {
    if (usuario) {
      verificarAcessoNoBanco(usuario);
    }
  }, [usuario, verificarAcessoNoBanco]);

  const handleAtivarVip = async () => {
    if (!codigoInput) return alert("Por favor, digite o código.");
    try {
      const response = await fetch(`${API_URL}/usuarios/ativar-vip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsapp: usuario, codigo: codigoInput })
      });

      if (response.ok) {
        alert("💎 Parabéns! Seu acesso VIP foi liberado.");
        localStorage.setItem("acesso_vip", "true");
        await verificarAcessoNoBanco(usuario);
        setBloqueado(false);
        setCodigoInput("");
      } else {
        const erro = await response.json();
        alert(erro.mensagem || "Erro ao ativar código.");
      }
    } catch {
      alert("Erro de conexão com o servidor.");
    }
  };

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
    <div className="fixed inset-0 bg-gray-950 text-white flex flex-col overflow-hidden">

      {/* --- ABA HOME --- */}
      {abaAtiva === "home" && (
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
          <header className="w-full max-w-md flex justify-between items-center mt-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-black font-black">FIT</div>
              <div>
                <p className="text-[9px] text-gray-500 uppercase font-black">Plano {isVip ? 'Premium' : 'Free'}</p>
                <h2 className="text-xl font-black uppercase">{perfil.nome}</h2>
              </div>
            </div>
            <button
              onClick={() => !isVip && setBloqueado(true)}
              className={`px-4 py-2 rounded-2xl border ${isVip ? 'border-emerald-500 text-emerald-500 cursor-default' : 'border-orange-500 text-orange-500 animate-pulse'} text-[10px] font-black uppercase`}
            >
              {isVip ? "💎 VIP ATIVO" : "⚡ VIRAR VIP"}
            </button>
          </header>

          <main className="w-full max-w-md flex-1 flex flex-col items-center">
            {/* Gráfico de Meta */}
            <div className="relative w-56 h-56 mb-8 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="112" cy="112" r="100" stroke="#111827" strokeWidth="12" fill="transparent" />
                <circle cx="112" cy="112" r="100" stroke="#10b981" strokeWidth="12" fill="transparent"
                  strokeDasharray="628"
                  // Se o peso for 0, mostra 10% de progresso fake, se tiver peso, mostra progresso real
                  strokeDashoffset={628 - (628 * (perfil.peso > 0 ? 0.75 : 0.1))}
                  strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black">{perfil.faltam}</span>
                <span className="text-[10px] text-emerald-500 font-bold uppercase">kg para a meta</span>
              </div>
            </div>

            {/* Grid de Informações */}
            <div className="grid grid-cols-3 gap-3 w-full mb-8">
              <div className="bg-gray-900/50 p-4 rounded-3xl border border-gray-800 text-center">
                <p className="text-[8px] text-gray-500 uppercase font-black mb-1">Peso Atual</p>
                <p className="text-sm font-bold">{perfil.peso}kg</p>
              </div>

              <div className="bg-gray-900/50 p-4 rounded-3xl border border-gray-800 text-center">
                <p className="text-[8px] text-gray-500 uppercase font-black mb-1">Altura</p>
                <p className="text-sm font-bold">{perfil.altura}m</p>
              </div>

              <div className="bg-gray-900/50 p-4 rounded-3xl border border-gray-800 text-center">
                <p className="text-[8px] text-gray-500 uppercase font-black mb-1">Foco</p>
                <p className="text-sm font-bold uppercase text-emerald-400">{perfil.meta}</p>
              </div>
            </div>

            <div className="w-full space-y-4 mb-8">
              <button
                onClick={() => setAbaAtiva("chat")}
                className="w-full bg-emerald-500 text-black font-black py-5 rounded-[2rem] shadow-lg uppercase text-sm hover:scale-[1.02] transition-transform flex items-center justify-center space-x-2"
              >
                <span>💬</span> <span>Abrir Chat Nutri</span>
              </button>

              <button
                onClick={() => setAbaAtiva("treino")}
                className="w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] shadow-lg uppercase text-sm hover:scale-[1.02] transition-transform flex items-center justify-center space-x-2"
              >
                <span>💪</span> <span>Meus Treinos </span>
              </button>
            </div>

            <button onClick={handleSair} className="text-[10px] text-gray-600 font-black uppercase tracking-widest hover:text-red-500">
              [ Encerrar Sessão ]
            </button>
          </main>
        </div>
      )}

      {/* --- ABA CHAT NUTRI --- */}
      {abaAtiva === "chat" && (
        <div className="flex-1 flex flex-col">
          <header className="p-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
            <button onClick={() => setAbaAtiva("home")} className="text-emerald-500 font-black text-xs uppercase">← Voltar</button>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nutrição Inteligente</span>
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-[10px] font-black text-black">FIT</div>
          </header>
          <ChatReceitas
            whatsapp={usuario}
            isVip={isVip}
            aoPedirUpgrade={() => setBloqueado(true)}
            // Quando a IA extrai os dados, o Chat chama essa função
            aoAtualizarPerfil={sincronizarEstadosLocais}
          />
        </div>
      )}

      {/* --- ABA TREINOS --- */}
      {abaAtiva === "treino" && (
        <div className="flex-1 flex flex-col bg-gray-950 overflow-y-auto">
          <header className="p-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center sticky top-0 z-10">
            <button onClick={() => setAbaAtiva("home")} className="text-blue-500 font-black text-xs uppercase">← Voltar</button>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Central de Treinos</span>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-[10px] font-black text-white">FIT</div>
          </header>

          <div className="p-6 w-full max-w-md mx-auto space-y-6">
            {/* ... (conteúdo de treinos permanece igual) */}
            <div className="text-center mb-2">
              <h2 className="text-2xl font-black uppercase italic text-blue-500">Protocolos Fit</h2>
              <p className="text-[10px] text-gray-500 uppercase font-bold">Selecione sua modalidade</p>
            </div>

            <button
              onClick={() => setModalidadeAberta('academia')}
              className={`w-full bg-gray-900 border p-5 rounded-[2rem] flex items-center space-x-4 transition-all ${modalidadeAberta === 'academia' ? 'border-blue-600 ring-1 ring-blue-600' : 'border-gray-800'}`}
            >
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-blue-900/20">🏋️‍♂️</div>
              <div className="text-left">
                <h4 className="font-black uppercase text-sm">Foco Academia</h4>
                <p className="text-[9px] text-gray-500 uppercase font-bold">Protocolos de Hipertrofia e Força</p>
              </div>
            </button>

            <button
              onClick={() => setModalidadeAberta('casa')}
              className={`w-full bg-gray-900 border p-5 rounded-[2rem] flex items-center space-x-4 transition-all ${modalidadeAberta === 'casa' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-800'}`}
            >
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-emerald-900/20">🏠</div>
              <div className="text-left">
                <h4 className="font-black uppercase text-sm">Treino em Casa</h4>
                <p className="text-[9px] text-gray-500 uppercase font-bold">Queima de Gordura e Definição</p>
              </div>
            </button>

            {modalidadeAberta && (
              <ListaExercicios
                modalidade={modalidadeAberta}
                whatsapp={usuario}
                API_URL={API_URL}
                aoFechar={() => setModalidadeAberta(null)}
              />
            )}
          </div>
        </div>
      )}

      {/* --- MODAL BLOQUEIO --- */}
      {bloqueado && (
        <div className="fixed inset-0 z-[500] bg-gray-950 flex flex-col items-center p-6 overflow-y-auto">
          <TelaPlanos aoEscolher={() => { }} />
          <div className="w-full max-w-xs mt-8 bg-gray-900 p-6 rounded-[2.5rem] border border-gray-800">
            <h3 className="text-center font-black text-sm mb-4 uppercase">Já comprou?</h3>
            <input
              type="text"
              placeholder="DIGITE SEU CÓDIGO..."
              className="w-full bg-black border border-gray-800 p-4 rounded-2xl text-center mt-2 mb-4 text-emerald-500 font-bold"
              value={codigoInput}
              onChange={(e) => setCodigoInput(e.target.value.toUpperCase())}
            />
            <button onClick={handleAtivarVip} className="w-full bg-emerald-500 text-black font-black py-4 rounded-2xl uppercase shadow-lg">
              Validar Código
            </button>
            <button onClick={() => setBloqueado(false)} className="w-full text-gray-500 text-[10px] mt-6 uppercase font-black tracking-widest">
              Voltar ao Início
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;