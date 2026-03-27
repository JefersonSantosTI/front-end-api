import { useState } from "react";
import ChatReceitas from "./pages/ChatReceitas";
import Login from "./components/Login";
import TelaPlanos from "./components/TelaPlanos";

function App() {
  const [usuario, setUsuario] = useState(() => localStorage.getItem("usuario_whatsapp"));
  const [plano, setPlano] = useState(() => localStorage.getItem("usuario_plano"));
  const [bloqueado, setBloqueado] = useState(true); // Começa bloqueado para planos pagos
  const [codigoInput, setCodigoInput] = useState("");

  const handleLogin = (whatsapp) => {
    setUsuario(whatsapp);
    localStorage.setItem("usuario_whatsapp", whatsapp);
  };

  const handleEscolhaPlano = (tipoPlano) => {
    setPlano(tipoPlano);
    localStorage.setItem("usuario_plano", tipoPlano);
  };

  const liberarComCodigo = () => {
    // Código de ativação: mude aqui se quiser outro
    if (codigoInput.toUpperCase() === "TREINOFIT2026") {
      setBloqueado(false);
      alert("Acesso liberado! Bom treino! 💪");
    } else {
      alert("Código inválido. Fale com o suporte no WhatsApp.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* 1. SE NÃO LOGOU: Tela de Login */}
      {!usuario ? (
        <Login aoLogar={handleLogin} />
      ) :

        /* 2. SE LOGOU MAS NÃO ESCOLHEU PLANO: Tela de Planos */
        !plano ? (
          <TelaPlanos aoEscolher={handleEscolhaPlano} />
        ) :

          /* 3. SE ESCOLHEU PLANO PAGO E ESTÁ BLOQUEADO: Tela de Código */
          bloqueado && plano !== 'Gratis' ? (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gray-900">
              <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-2xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-emerald-400 mb-4 tracking-tight">Aguardando Pagamento...</h2>
                <p className="mb-6 text-gray-300 text-sm leading-relaxed">
                  Enviamos os dados do PIX para o seu WhatsApp.<br />
                  Assim que realizar o pagamento, enviaremos o seu **Código de Ativação**.
                </p>

                <div className="flex flex-col gap-3">
                  <label className="text-left text-xs font-bold text-gray-500 uppercase ml-1">
                    Insira o código recebido:
                  </label>
                  <input
                    type="text"
                    placeholder="EX: TREINOFIT2026"
                    // Ajuste de cores: text-white e placeholder-gray-500
                    className="bg-gray-900 border-2 border-gray-700 p-4 rounded-xl text-center w-full uppercase text-white font-mono text-xl focus:border-emerald-500 outline-none transition-all placeholder:text-gray-600"
                    style={{ color: 'white' }} // Reforço para garantir visibilidade
                    value={codigoInput}
                    onChange={(e) => setCodigoInput(e.target.value)}
                  />

                  <button
                    onClick={liberarComCodigo}
                    className="mt-2 bg-emerald-500 text-black font-black py-4 px-8 rounded-xl hover:bg-emerald-400 transition-all shadow-lg active:scale-95"
                  >
                    ATIVAR MEU ACESSO 🚀
                  </button>
                </div>

                <p className="mt-8 text-gray-500 text-xs italic">
                  O código é enviado manualmente após a confirmação do PIX.
                </p>
              </div>
            </div>
          ) : (
            /* 4. TUDO OK: Chat Liberado */
            <ChatReceitas whatsapp={usuario} plano={plano} />
          )}
    </div>
  );
}

export default App;