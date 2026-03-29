import { useState } from "react";
import ChatReceitas from "./pages/ChatReceitas";
import Login from "./components/Login";
import TelaPlanos from "./components/TelaPlanos";

function App() {
  // Inicializa os estados buscando do localStorage para não perder o login ao atualizar
  const [usuario, setUsuario] = useState(() => localStorage.getItem("usuario_whatsapp"));
  const [plano, setPlano] = useState(() => localStorage.getItem("usuario_plano"));

  // O estado 'bloqueado' controla se o modal de pagamento está visível
  // Começamos em FALSE para o usuário ver o modo Trial primeiro
  const [bloqueado, setBloqueado] = useState(false);

  // Estado para verificar se o usuário já é VIP (para sumir com desfoques e travas)
  const [isVip, setIsVip] = useState(() => localStorage.getItem("acesso_vip") === "true");

  const [codigoInput, setCodigoInput] = useState("");

  const handleLogin = (whatsapp) => {
    setUsuario(whatsapp);
    localStorage.setItem("usuario_whatsapp", whatsapp);
  };

  const handleEscolhaPlano = (tipoPlano) => {
    setPlano(tipoPlano);
    localStorage.setItem("usuario_plano", tipoPlano);
    // Após escolher o plano, ele cai no ChatReceitas automaticamente
  };

  const liberarComCodigo = () => {
    const CODIGO_CORRETO = "TREINOFIT2026";
    if (codigoInput.trim().toUpperCase() === CODIGO_CORRETO) {
      setIsVip(true);
      setBloqueado(false);
      localStorage.setItem("acesso_vip", "true");
      alert("Acesso VIP liberado! Aproveite sua consultoria completa! 💪");
    } else {
      alert("Código inválido. Verifique o código enviado no seu WhatsApp.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">

      {/* 1. FLUXO DE ACESSO: LOGIN -> PLANOS -> CHAT */}
      {!usuario ? (
        <Login aoLogar={handleLogin} />
      ) : !plano ? (
        <TelaPlanos aoEscolher={handleEscolhaPlano} />
      ) : (
        <ChatReceitas
          whatsapp={usuario}
          plano={plano}
          isVip={isVip}
          // Se a IA mandar o [BLOQUEADO], o ChatReceitas chama essa função para abrir o modal
          aoPedirUpgrade={() => setBloqueado(true)}
        />
      )}

      {/* 2. MODAL DE BLOQUEIO / ATIVAÇÃO PAGAMENTO */}
      {/* Só aparece se 'bloqueado' for true e o plano não for o grátis */}
      {bloqueado && plano !== 'Gratis' && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 text-center bg-gray-900/95 backdrop-blur-md">
          <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-300">

            <div className="text-5xl mb-4">🍎</div>
            <h2 className="text-2xl font-bold text-emerald-400 mb-2 tracking-tight">
              Gostou da sua prévia?
            </h2>
            <p className="mb-6 text-gray-400 text-sm leading-relaxed">
              Sua **Primeira Refeição** e seus **Macros** foram calculados com sucesso!<br /><br />
              Para desbloquear o cardápio completo, treinos e suporte direto no WhatsApp, insira seu código de ativação.
            </p>

            <div className="flex flex-col gap-3">
              <label className="text-left text-[10px] font-bold text-gray-500 uppercase ml-1">
                Código de Ativação:
              </label>
              <input
                type="text"
                placeholder="DIGITE O CÓDIGO..."
                className="bg-gray-900 border-2 border-gray-700 p-4 rounded-xl text-center w-full uppercase text-white font-mono text-xl focus:border-emerald-500 outline-none transition-all placeholder:text-gray-800"
                value={codigoInput}
                onChange={(e) => setCodigoInput(e.target.value)}
              />

              <button
                onClick={liberarComCodigo}
                className="mt-2 bg-emerald-500 text-black font-black py-4 px-8 rounded-xl hover:bg-emerald-400 transition-all shadow-lg active:scale-95"
              >
                ATIVAR MEU ACESSO 🚀
              </button>

              <button
                onClick={() => setBloqueado(false)}
                className="mt-4 text-gray-500 text-xs hover:text-white transition-colors underline underline-offset-4"
              >
                Voltar para minha degustação grátis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;