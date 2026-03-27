import { useState } from "react";
import ChatReceitas from "./pages/ChatReceitas";
import Login from "./components/Login";
import TelaPlanos from "./components/TelaPlanos";

function App() {
  const [usuario, setUsuario] = useState(() => localStorage.getItem("usuario_whatsapp"));
  const [plano, setPlano] = useState(() => localStorage.getItem("usuario_plano"));
  const [bloqueado, setBloqueado] = useState(true); // Começa bloqueado para novos pagantes
  const [codigoInput, setCodigoInput] = useState("");

  const handleLogin = (whatsapp) => {
    setUsuario(whatsapp);
    localStorage.setItem("usuario_whatsapp", whatsapp);
  };

  const liberarComCodigo = () => {
    // Aqui você define o seu código secreto (mude para o que quiser)
    if (codigoInput.toUpperCase() === "TREINOFIT2026") {
      setBloqueado(false);
      alert("Acesso liberado! Bom treino! 💪");
    } else {
      alert("Código inválido. Fale com o suporte no WhatsApp.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {!usuario ? (
        <Login aoLogar={handleLogin} />
      ) : !plano ? (
        <TelaPlanos aoEscolher={setPlano} />
      ) : bloqueado && plano !== 'Gratis' ? (
        /* TELA DE BLOQUEIO PÓS-ESCOLHA */
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <h2 className="text-2xl font-bold text-emerald-400 mb-4">Aguardando Pagamento...</h2>
          <p className="mb-6 text-gray-400">
            Enviamos os dados do PIX para o seu WhatsApp.<br />
            Assim que realizar o pagamento, enviaremos o seu **Código de Ativação**.
          </p>

          <input
            type="text"
            placeholder="Digite o código aqui"
            className="bg-gray-800 border border-gray-700 p-3 rounded-lg mb-4 text-center w-full max-w-xs uppercase"
            value={codigoInput}
            onChange={(e) => setCodigoInput(e.target.value)}
          />

          <button
            onClick={liberarComCodigo}
            className="bg-emerald-500 text-black font-bold py-3 px-8 rounded-xl hover:bg-emerald-400 transition-all"
          >
            Ativar meu Acesso
          </button>
        </div>
      ) : (
        <ChatReceitas whatsapp={usuario} plano={plano} />
      )}
    </div>
  );
}

export default App;