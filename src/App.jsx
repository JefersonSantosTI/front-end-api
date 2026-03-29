import { useState } from "react";
import ChatReceitas from "./pages/ChatReceitas";
import Login from "./components/Login";
import TelaPlanos from "./components/TelaPlanos";

function App() {
  const [usuario, setUsuario] = useState(() => localStorage.getItem("usuario_whatsapp"));
  const [bloqueado, setBloqueado] = useState(false);
  const [isVip, setIsVip] = useState(() => localStorage.getItem("acesso_vip") === "true");
  const [codigoInput, setCodigoInput] = useState("");

  const handleLogin = (whatsapp) => {
    setUsuario(whatsapp);
    localStorage.setItem("usuario_whatsapp", whatsapp);
  };

  const liberarComCodigo = () => {
    const CODIGO_CORRETO = "TREINOFIT2026";
    if (codigoInput.trim().toUpperCase() === CODIGO_CORRETO) {
      setIsVip(true);
      setBloqueado(false);
      localStorage.setItem("acesso_vip", "true");
      alert("✅ Acesso VIP liberado! Aproveite sua consultoria completa!");
    } else {
      alert("❌ Código inválido. Chame no WhatsApp para receber seu código.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">

      {/* 1. LOGIN -> CHAT (DIRETO) */}
      {!usuario ? (
        <Login aoLogar={handleLogin} />
      ) : (
        <ChatReceitas
          whatsapp={usuario}
          isVip={isVip}
          aoPedirUpgrade={() => setBloqueado(true)}
        />
      )}

      {/* 2. MODAL VIP (PLANOS + ATIVAÇÃO) */}
      {bloqueado && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-start p-4 bg-gray-900/98 backdrop-blur-xl overflow-y-auto pt-10">

          {/* Componente de Planos dentro do Modal */}
          <div className="w-full max-w-5xl mb-12">
            <TelaPlanos aoEscolher={() => { }} />
          </div>

          {/* Seção de Inserir Código (Logo abaixo dos planos) */}
          <div className="w-full max-w-md bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-2xl text-center mb-20">
            <h3 className="text-emerald-400 font-black text-lg mb-4 uppercase tracking-tighter">
              Já recebeu seu código VIP?
            </h3>

            <input
              type="text"
              placeholder="DIGITE O CÓDIGO AQUI..."
              className="bg-gray-900 border-2 border-gray-700 p-4 rounded-xl w-full text-center uppercase text-white font-mono text-xl focus:border-emerald-500 outline-none mb-4"
              value={codigoInput}
              onChange={(e) => setCodigoInput(e.target.value)}
            />

            <button
              onClick={liberarComCodigo}
              className="w-full bg-emerald-500 text-black font-black py-4 rounded-xl hover:bg-emerald-400 transition-all shadow-lg active:scale-95"
            >
              ATIVAR MEU ACESSO AGORA 🚀
            </button>

            <button
              onClick={() => setBloqueado(false)}
              className="mt-6 text-gray-500 text-xs hover:text-white underline block mx-auto"
            >
              Voltar para a versão gratuita
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;