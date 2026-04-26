import { useState, useEffect, useCallback, useRef } from "react";
import ListaExercicios from "./services/ListaExercicio";
import ChatReceitas from "./pages/ChatReceitas";
import Login from "./components/Login";
import TelaPlanos from "./components/TelaPlanos";

function App() {
  const [usuario, setUsuario] = useState(() => localStorage.getItem("usuario_whatsapp"));
  const [etapa, setEtapa] = useState("verificando"); // 'verificando', 'login', 'onboarding', 'home'
  const [abaAtiva, setAbaAtiva] = useState("home");
  const [isVip, setIsVip] = useState(false);
  const [treinoIAPescado, setTreinoIAPescado] = useState(null);
  const [bloqueado, setBloqueado] = useState(false);
  const [modalidadeAberta, setModalidadeAberta] = useState(null);

  const [perfil, setPerfil] = useState({
    nome: "Guerreiro(a)",
    peso: "0",
    altura: "0",
    meta: "Emagrecimento",
    imc: "0",
    tmb: "0",
    faltam: "0"
  });

  const API_URL = "https://api-backend-treino-fit.onrender.com/api";
  const verificandoRef = useRef(false);

  // 1. CÁLCULO DE BIOMETRIA (IMC/TMB)
  const calcularSaude = useCallback((peso, altura) => {
    const p = parseFloat(peso) || 0;
    const a = parseFloat(altura) || 0;
    if (p > 0 && a > 0) {
      const imc = (p / (a * a)).toFixed(1);
      const tmb = (10 * p + (6.25 * (a * 100)) - (5 * 25)).toFixed(0); // Média base
      const falta = (p * 0.1).toFixed(1);
      return { imc, tmb, falta };
    }
    return { imc: "0", tmb: "0", falta: "0" };
  }, []);

  // 2. SINCRONIZAÇÃO COM O BANCO DE DADOS
  const sincronizarComBanco = useCallback(async (whatsappId) => {
    if (!whatsappId || verificandoRef.current) return;
    try {
      verificandoRef.current = true;
      const whatsLimpo = String(whatsappId).replace(/\D/g, "");
      const response = await fetch(`${API_URL}/usuarios/${whatsLimpo}`);

      if (response.ok) {
        const dados = await response.json();
        const saude = calcularSaude(dados.peso, dados.altura);

        setPerfil({
          nome: dados.nome || "Guerreiro(a)",
          peso: String(dados.peso || "0"),
          altura: String(dados.altura || "0"),
          meta: dados.meta || "Emagrecimento",
          imc: saude.imc,
          tmb: saude.tmb,
          faltam: saude.falta
        });

        setIsVip(dados.pago === true);
        if (dados.treinoIA) setTreinoIAPescado(dados.treinoIA);

        // Se o usuário não tem peso/altura, manda para o onboarding
        if (!dados.peso || !dados.altura || dados.peso === 0) {
          setEtapa("onboarding");
        } else {
          setEtapa("home");
        }
      } else {
        setEtapa("login");
      }
    } catch (err) {
      console.error("Erro ao sincronizar:", err);
      setEtapa("login");
    } finally {
      verificandoRef.current = false;
    }
  }, [API_URL, calcularSaude]);

  useEffect(() => {
    if (usuario) sincronizarComBanco(usuario);
    else setEtapa("login");
  }, [usuario, sincronizarComBanco]);

  // 3. HANDLERS (AÇÕES)
  const handleLogin = (whatsapp) => {
    const limpo = String(whatsapp).replace(/\D/g, "");
    localStorage.setItem("usuario_whatsapp", limpo);
    setUsuario(limpo);
    setEtapa("verificando"); // Força a verificação assim que loga
  };

  // 2. Atualize a função de salvar o IMC (Onboarding)
  const salvarOnboarding = async () => {
    try {
      const whatsLimpo = String(usuario).replace(/\D/g, "");

      // Verificação básica antes de enviar
      if (!perfil.peso || !perfil.altura || perfil.peso === "0") {
        alert("Por favor, preencha peso e altura corretamente.");
        return;
      }

      const response = await fetch(`${API_URL}/usuarios/atualizar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatsapp: whatsLimpo,
          peso: perfil.peso,
          altura: perfil.altura,
          meta: perfil.meta
        })
      });

      if (response.ok) {
        // FORÇA A MUDANÇA DE TELA IMEDIATA
        const saude = calcularSaude(perfil.peso, perfil.altura);
        setPerfil(prev => ({ ...prev, ...saude }));
        setEtapa("home");
        setAbaAtiva("home");
        // Sincroniza em segundo plano para garantir
        sincronizarComBanco(whatsLimpo);
      } else {
        alert("Erro ao salvar no servidor. Tente novamente.");
      }
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
      alert("Erro de conexão. Verifique sua internet.");
    }
  };

  const handleSair = () => {
    localStorage.clear();
    window.location.reload();
  };

  // --- RENDERS CONDICIONAIS ---

  if (etapa === "verificando") return <div className="fixed inset-0 bg-gray-950 flex items-center justify-center text-emerald-500 font-black italic">CARREGANDO PERFIL...</div>;

  if (etapa === "login") return <Login aoLogar={handleLogin} />;

  if (etapa === "onboarding") {
    return (
      <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center p-8 text-white z-[999]">
        <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-black font-black mb-6">FIT</div>
        <h2 className="text-2xl font-black mb-2 uppercase italic text-emerald-500">Prepare o seu corpo</h2>
        <p className="text-gray-400 text-center text-sm mb-8">O Mentor IA precisa desses dados para criar seu plano de elite.</p>
        <div className="w-full max-w-sm space-y-4">
          <input type="number" placeholder="Peso (kg)" className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl"
            onChange={(e) => setPerfil({ ...perfil, peso: e.target.value })} />
          <input type="number" placeholder="Altura (m) - Ex: 1.75" className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl"
            onChange={(e) => setPerfil({ ...perfil, altura: e.target.value })} />
          <select className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl" onChange={(e) => setPerfil({ ...perfil, meta: e.target.value })}>
            <option value="Emagrecimento">Meta: Emagrecimento</option>
            <option value="Hipertrofia">Meta: Hipertrofia</option>
          </select>
          <button onClick={salvarOnboarding} className="w-full bg-emerald-500 text-black font-black py-5 rounded-3xl uppercase shadow-lg shadow-emerald-500/20">Gerar Meu Perfil FIT →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-950 text-white flex flex-col overflow-hidden font-sans">

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
            <button onClick={() => !isVip && setBloqueado(true)} className={`px-4 py-2 rounded-2xl border ${isVip ? 'border-emerald-500 text-emerald-500' : 'border-orange-500 text-orange-500 animate-pulse'} text-[10px] font-black uppercase tracking-widest`}>
              {isVip ? "💎 VIP" : "⚡ VIRAR VIP"}
            </button>
          </header>

          <main className="w-full max-w-md flex flex-col items-center">
            {/* Círculo de Progresso */}
            <div className="relative w-56 h-56 mb-8 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="112" cy="112" r="95" stroke="#111827" strokeWidth="14" fill="transparent" />
                <circle cx="112" cy="112" r="95" stroke="#10b981" strokeWidth="14" fill="transparent"
                  strokeDasharray="597" strokeDashoffset={597 - (597 * 0.75)} strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-5xl font-black">{perfil.faltam}</span>
                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.2em]">kg para a meta</span>
              </div>
            </div>

            <div className="w-full mb-6 bg-white/5 border border-white/10 rounded-[2.5rem] p-6 flex justify-between items-center">
              <div className="text-left">
                <p className="text-emerald-500 font-black italic text-[11px] uppercase mb-1">IMC Atual</p>
                <h3 className="text-4xl font-black">{perfil.imc}</h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 font-black uppercase">TMB Estimada</p>
                <p className="text-lg font-bold text-white">{perfil.tmb} kcal</p>
              </div>
            </div>

            <div className="w-full space-y-4 mb-10">
              <button onClick={() => setAbaAtiva("chat")} className="w-full bg-emerald-500 text-black font-black py-6 rounded-[2.2rem] uppercase text-sm shadow-lg">💬 Consultoria & Nutrição</button>
              <button onClick={() => setAbaAtiva("treino")} className="w-full bg-white/5 text-white border border-white/10 font-black py-6 rounded-[2.2rem] uppercase text-sm">💪 Área de Treinos</button>
              <button onClick={handleSair} className="w-full text-[10px] font-black uppercase text-gray-600 tracking-widest pt-2">[ Encerrar Sessão ]</button>
            </div>
          </main>
        </div>
      )}

      {/* ABA CHAT */}
      {abaAtiva === "chat" && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="p-4 flex items-center border-b border-white/5 bg-gray-950">
            <button onClick={() => setAbaAtiva("home")} className="text-emerald-500 font-black text-[10px] uppercase">← Início</button>
          </header>
          <ChatReceitas whatsapp={usuario} isVip={isVip} aoPedirUpgrade={() => setBloqueado(true)} perfil={perfil} />
        </div>
      )}

      {/* ABA TREINO */}
      {abaAtiva === "treino" && (
        <div className="flex-1 flex flex-col bg-gray-950 p-6 overflow-y-auto">
          <header className="flex justify-between items-center mb-8">
            <button onClick={() => setAbaAtiva("home")} className="text-emerald-500 font-black text-[10px] uppercase">← Voltar</button>
            <h3 className="text-white font-black italic uppercase tracking-tighter">Treinos Fit</h3>
          </header>

          <div className="space-y-4">
            <button onClick={() => isVip ? setModalidadeAberta('ia') : setBloqueado(true)} className="w-full bg-gradient-to-r from-orange-600 to-orange-400 p-7 rounded-[2.5rem] flex items-center gap-5 shadow-lg">
              <div className="text-3xl">🤖</div>
              <div className="text-left">
                <p className="font-black uppercase text-lg leading-tight text-white">Mentor IA</p>
                <p className="text-[10px] text-orange-100 uppercase font-bold">{!isVip ? "Bloqueado 🔒" : "Elite VIP"}</p>
              </div>
            </button>

            <button onClick={() => setModalidadeAberta('academia')} className="w-full bg-blue-600 p-7 rounded-[2.5rem] flex items-center gap-5 shadow-lg">
              <div className="text-3xl">🏋️‍♂️</div>
              <div className="text-left"><p className="font-black uppercase text-lg leading-tight text-white">Academia (ABC)</p></div>
            </button>
          </div>

          {modalidadeAberta && (
            <ListaExercicios
              modalidade={modalidadeAberta} whatsapp={usuario}
              API_URL={API_URL} perfil={perfil}
              treinoIA={treinoIAPescado} aoFechar={() => setModalidadeAberta(null)}
            />
          )}
        </div>
      )}

      {bloqueado && (
        <div className="fixed inset-0 z-[500] bg-gray-950 flex flex-col items-center p-6 overflow-y-auto">
          <button onClick={() => setBloqueado(false)} className="absolute top-6 right-6 text-white bg-white/10 w-10 h-10 rounded-full">✕</button>
          <TelaPlanos />
        </div>
      )}
    </div>
  );
}

export default App;