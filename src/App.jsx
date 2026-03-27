import { useState } from "react"; // Remova o useEffect, não precisaremos mais dele aqui
import ChatReceitas from "./pages/ChatReceitas";
import Login from "./components/Login";

function App() {
  // Inicialização "Preguiçosa" (Lazy Initialization)
  // O React executa essa função apenas UMA VEZ quando o componente nasce
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem("usuario_whatsapp");
    return salvo || null; // Se achar, já começa logado. Se não, começa null.
  });

  return (
    <div className="min-h-screen bg-gray-900">
      {!usuario ? (
        <Login aoLogar={(valor) => setUsuario(valor)} />
      ) : (
        <ChatReceitas whatsapp={usuario} />
      )}
    </div>
  );
}

export default App;