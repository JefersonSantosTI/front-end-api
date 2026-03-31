import { useState, useEffect } from "react";
import ChatReceitas from "./pages/ChatReceitas";
import Login from "./components/Login";
import TelaPlanos from "./components/TelaPlanos";

function App() {
  const [usuario, setUsuario] = useState(() => localStorage.getItem("usuario_whatsapp"));
  const [isVip, setIsVip] = useState(() => localStorage.getItem("acesso_vip") === "true");
  const [abaAtiva, setAbaAtiva] = useState("home");
  const [bloqueado, setBloqueado] = useState(false);
  const [codigoInput, setCodigoInput] = useState("");

  const [perfil, setPerfil] = useState({
    nome: localStorage.getItem("perfil_nome") || "Guerreiro(a)",
    peso: localStorage.getItem("perfil_peso") || "0",
    altura: localStorage.getItem("perfil_altura") || "0",
    meta: localStorage.getItem("perfil_meta") || "Defina sua meta",
    faltam: localStorage.getItem("perfil_faltam") || "0",
    diasRestantes: localStorage.getItem("perfil_dias") || "0"
  });

  const API_URL = "https://api-backend-treino-fit.onrender.com/api";

  // Função para ler o LocalStorage e atualizar o estado visual
  const sincronizarEstadosLocais = () => {
    setIsVip(localStorage.getItem("acesso_vip") === "true");
    setPerfil({
      nome: localStorage.getItem("perfil_nome") || "Guerreiro(a)",
      peso: localStorage.getItem("perfil_peso") || "0",
      altura: localStorage.getItem("perfil_altura") || "0",
      meta: localStorage.getItem("perfil_meta") || "Defina sua meta",
      faltam: localStorage.getItem("perfil_faltam") || "0",
      diasRestantes: localStorage.getItem("perfil_dias") || "0"
    });
  };

  // Sincroniza com o banco de dados ao carregar ou mudar de usuário
  useEffect(() => {
    if (usuario) {
      const puxarDadosDoBanco = async () => {
        try {
          const whatsLimpo = String(usuario).replace(/\D/g, "");
          const response = await fetch(`${API_URL}/usuarios/${whatsLimpo}`);
          if (response.ok) {
            const dados = await response.json();
            // Salva tudo no LocalStorage para persistência offline rápida
            localStorage.setItem("perfil_nome", dados.nome || "Guerreiro(a)");
            localStorage.setItem("perfil_peso", dados.peso || "0");
            localStorage.setItem("perfil_altura", dados.altura || "0");
            localStorage.setItem("perfil_meta", dados.meta || "Emagrecimento");
            localStorage.setItem("acesso_vip", dados.pago ? "true" : "false");

            sincronizarEstadosLocais();
          }
        } catch (err) {
          console.error("Erro ao conectar com API:", err);
        }
      };
      puxarDadosDoBanco();
    }
  }, [usuario]);

  const handleAtivarVip = async () => {
    if (!codigoInput) return alert("Por favor, digite o código.");

    try {
      const response = await fetch(`${API_URL}/usuarios/ativar-vip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsapp: usuario, codigo: codigoInput })
      });

      const resultado = await response.json();

      if (response.ok) {
        alert("💎 Parabéns! Seu acesso VIP foi liberado.");
        localStorage.setItem("acesso_vip", "true");
        setIsVip(true);
        setBloqueado(false);
        setCodigoInput("");
      } else {
        alert(resultado.mensagem || "Erro ao ativar código.");
      }
    } catch {
      console.error("Erro de conexão. Verifique se o backend está online.");
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
            <button onClick={() => setBloqueado(true)} className={`px-4 py-2 rounded-2xl border ${isVip ? 'border-emerald-500 text-emerald-500' : 'border-orange-500 text-orange-500'} text-[10px] font-black uppercase`}>
              {isVip ? "💎 VIP ATIVO" : "⚡ VIRAR VIP"}
            </button>
          </header>

          <main className="w-full max-w-md flex-1 flex flex-col items-center">
            {/* Gráfico Circular Simples */}
            <div className="relative w-56 h-56 mb-8 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="112" cy="112" r="100" stroke="#111827" strokeWidth="12" fill="transparent" />
                <circle cx="112" cy="112" r="100" stroke="#10b981" strokeWidth="12" fill="transparent" strokeDasharray="628" strokeDashoffset="450" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black">{perfil.faltam}</span>
                <span className="text-[10px] text-emerald-500 font-bold uppercase">kg para a meta</span>
              </div>
            </div>

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

            <button onClick={() => setAbaAtiva("chat")} className="w-full bg-emerald-500 text-black font-black py-5 rounded-[2rem] shadow-lg uppercase text-sm mb-6 hover:scale-[1.02] transition-transform">
              💬 Abrir Chat Nutri AI
            </button>

            <button onClick={handleSair} className="text-[10px] text-gray-600 font-black uppercase tracking-widest hover:text-red-500">
              [ Encerrar Sessão ]
            </button>
          </main>
        </div>
      )}

      {abaAtiva === "chat" && (
        <div className="flex-1 flex flex-col">
          <header className="p-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
            <button onClick={() => setAbaAtiva("home")} className="text-emerald-500 font-black text-xs uppercase">← Voltar</button>
            <span className="text-[10px] font-black uppercase">Ana Nutri Fit</span>
            <div className="w-8 h-8 bg-emerald-500 rounded-full" />
          </header>
          <ChatReceitas
            whatsapp={usuario}
            isVip={isVip}
            perfil={perfil}
            aoPedirUpgrade={() => setBloqueado(true)}
          />
        </div>
      )}

      {/* MODAL DE ATIVAÇÃO VIP */}
      {bloqueado && (
        <div className="fixed inset-0 z-[500] bg-gray-950 flex flex-col items-center p-6 overflow-y-auto">
          <TelaPlanos aoEscolher={() => { }} />
          <div className="w-full max-w-xs mt-8 bg-gray-900 p-6 rounded-[2.5rem] border border-gray-800">
            <h3 className="text-center font-black text-sm mb-4 uppercase">Já possui um código?</h3>
            <input
              type="text"
              placeholder="DIGITE SEU CÓDIGO..."
              className="w-full bg-black border border-gray-800 p-4 rounded-2xl text-center mb-4 text-emerald-500 font-bold"
              value={codigoInput}
              onChange={(e) => setCodigoInput(e.target.value)}
            />
            <button onClick={handleAtivarVip} className="w-full bg-emerald-500 text-black font-black py-4 rounded-2xl uppercase shadow-emerald-500/20 shadow-lg">
              Validar Acesso
            </button>
            <button onClick={() => setBloqueado(false)} className="w-full text-gray-500 text-[10px] mt-6 font-black uppercase tracking-widest">
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;