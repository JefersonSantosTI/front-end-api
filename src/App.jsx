import { useState } from "react";
import ChatReceitas from "./pages/ChatReceitas";
import Login from "./components/Login";
import TelaPlanos from "./components/TelaPlanos";

function App() {
  const [usuario, setUsuario] = useState(() => {
    return localStorage.getItem("usuario_whatsapp") || null;
  });

  const [plano, setPlano] = useState(() => {
    return localStorage.getItem("usuario_plano") || null;
  });

  // Função para salvar o plano e avançar
  const handleEscolhaPlano = (tipoPlano) => {
    setPlano(tipoPlano);
    localStorage.setItem("usuario_plano", tipoPlano);
  };

  const handleLogin = (whatsapp) => {
    setUsuario(whatsapp);
    localStorage.setItem("usuario_whatsapp", whatsapp);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* 1. SE NÃO LOGOU: Login */}
      {!usuario ? (
        <Login aoLogar={handleLogin} />
      ) : (
        /* 2. SE LOGOU MAS NÃO ESCOLHEU PLANO: Tela de Planos */
        !plano ? (
          <TelaPlanos aoEscolher={handleEscolhaPlano} />
        ) : (
          /* 3. TUDO OK: Chat */
          <ChatReceitas whatsapp={usuario} plano={plano} />
        )
      )}
    </div>
  );
}

export default App;