import { useState, useEffect } from "react";
import { PROTOCOLOS_TREINO } from "./treinos.js";

const ListaExercicios = ({ whatsapp, aoFechar, API_URL, treinoExterno, modalidade }) => {
  // Função para converter o texto bruto da IA em objetos de exercício
  const formatarTreinoIA = (texto) => {
    if (!texto) return null;

    const linhas = texto.split("\n");
    const exerciciosEncontrados = [];

    // Expressão regular para capturar: Nome do exercício, séries e repetições
    // Ex: "1. Agachamento Livre - 4 séries x 8 repetições"
    linhas.forEach((linha) => {
      if (linha.includes("séries") || linha.includes("x")) {
        const nome = linha.split(/[0-9]/)[0].replace(/[.*-]/g, "").trim();
        const infoSéries = linha.match(/(\d+)\s*séries/i);
        const infoReps = linha.match(/(\d+)\s*repetições/i) || linha.match(/x\s*(\d+)/i);

        exerciciosEncontrados.push({
          nome: nome || "Exercício Personalizado",
          series: infoSéries ? infoSéries[1] : "3",
          reps: infoReps ? infoReps[1] : "10",
          gif: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueGZ3bmZ3bmZ3bmZ3/3o7TKMGpxx8G/giphy.gif" // Gif genérico para IA
        });
      }
    });

    return exerciciosEncontrados.length > 0 ? exerciciosEncontrados : null;
  };

  const [etapa, setEtapa] = useState(treinoExterno ? 'exercicios' : 'categorias');

  // CORREÇÃO AQUI: Prioriza o treinoExterno se ele existir
  const [grupoAtivo, setGrupoAtivo] = useState(() => {
    const treinoTraduzido = formatarTreinoIA(treinoExterno);
    if (treinoTraduzido) {
      return { nome: "Treino Personalizado da IA", exercicios: treinoTraduzido };
    }
    return PROTOCOLOS_TREINO[modalidade]?.grupos[0] || null;
  });

  const [cargas, setCargas] = useState({});
  const [timer, setTimer] = useState(0);
  const [descansando, setDescansando] = useState(false);
  const [carregandoIA, setCarregandoIA] = useState(false);

  useEffect(() => {
    let interval;
    if (descansando && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setDescansando(false);
    }
    return () => clearInterval(interval);
  }, [descansando, timer]);

  const iniciarDescanso = (segundos) => {
    setTimer(segundos || 60);
    setDescansando(true);
  };

  const buscarTreinoIA = async (objetivo) => {
    setCarregandoIA(true);
    try {
      const response = await fetch(`${API_URL}/usuarios/gerar-treino-ia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsapp, objetivo })
      });
      const dadosIA = await response.json();

      setGrupoAtivo({
        nome: `Protocolo IA: ${objetivo}`,
        exercicios: dadosIA.exercicios
      });
      setEtapa('exercicios');
    } catch {
      alert("Erro ao conectar com o Coach IA.");
    } finally {
      setCarregandoIA(false);
    }
  };

  const overlayStyle = "fixed inset-0 z-[600] flex flex-col items-center justify-center p-4 bg-black/95 backdrop-blur-2xl";

  if (etapa === 'categorias') {
    return (
      <div className={overlayStyle}>
        <div className="w-full max-w-md bg-gray-900/50 rounded-[3rem] border border-white/10 p-8 shadow-2xl">
          <button onClick={aoFechar} className="text-gray-500 text-[10px] font-black uppercase mb-6 tracking-widest hover:text-white">← Voltar</button>
          <h2 className="text-white text-3xl font-black italic uppercase tracking-tighter mb-2">Método Fit</h2>
          <div className="space-y-4">
            <button onClick={() => setEtapa('objetivo_ia')} className="w-full bg-gradient-to-r from-blue-600 to-blue-400 p-6 rounded-3xl flex justify-between items-center active:scale-95 transition-all">
              <div className="flex items-center gap-4">
                <span className="text-2xl">🤖</span>
                <div className="text-left">
                  <p className="text-black font-black uppercase italic">Coach IA</p>
                  <p className="text-black/60 text-[9px] font-bold uppercase">Baseado no seu Perfil</p>
                </div>
              </div>
            </button>
            <button onClick={() => setEtapa('exercicios')} className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl flex justify-between items-center active:scale-95 transition-all">
              <div className="flex items-center gap-4">
                <span className="text-2xl">📋</span>
                <div className="text-left">
                  <p className="text-white font-black uppercase italic">Protocolo Padrão</p>
                  <p className="text-gray-500 text-[9px] font-bold uppercase">Treino {modalidade}</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (etapa === 'objetivo_ia') {
    return (
      <div className={overlayStyle}>
        <div className="w-full max-w-md bg-gray-900 rounded-[3rem] border border-white/10 p-8 text-center shadow-2xl">
          <h2 className="text-white text-xl font-black italic uppercase mb-8">Foco do Coach</h2>
          {carregandoIA ? (
            <div className="py-12 flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-blue-500 font-black mt-6 animate-pulse uppercase italic text-sm">Gerando Treino...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              <button onClick={() => buscarTreinoIA('Hipertrofia')} className="bg-blue-600 p-6 rounded-[2rem] font-black uppercase italic text-white shadow-lg active:scale-95">💪 Hipertrofia</button>
              <button onClick={() => buscarTreinoIA('Definição')} className="bg-emerald-500 p-6 rounded-[2rem] font-black uppercase italic text-black shadow-lg active:scale-95">🔥 Queima</button>
              <button onClick={() => setEtapa('categorias')} className="text-gray-600 text-[10px] mt-4 uppercase font-bold">Voltar</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[700] bg-black flex flex-col">
      <header className="p-6 bg-gray-950 border-b border-white/5 flex justify-between items-center sticky top-0 z-10">
        <div>
          <button onClick={aoFechar} className="text-blue-500 font-black text-xs uppercase mb-1">← Sair</button>
          <h3 className="text-white font-black italic uppercase text-lg leading-tight">{grupoAtivo?.nome}</h3>
        </div>
        {descansando && (
          <div className="bg-emerald-500 px-4 py-2 rounded-2xl flex flex-col items-center animate-pulse">
            <span className="text-[8px] text-black font-black uppercase">Descanso</span>
            <span className="text-lg font-black text-black leading-none">{timer}s</span>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {grupoAtivo?.exercicios.map((ex, idx) => (
          <div key={idx} className="bg-gray-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden">
            <div className="w-full h-48 bg-black relative">
              <img src={ex.gif} alt={ex.nome} className="w-full h-full object-contain opacity-80" />
            </div>
            <div className="p-6">
              <h4 className="text-white text-xl font-black uppercase italic mb-1">{ex.nome}</h4>
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-4">{ex.series} Séries x {ex.reps} Reps</p>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="kg"
                  className="bg-black/50 border border-white/10 rounded-2xl p-4 text-white font-black text-center w-24 outline-none focus:border-blue-500"
                  value={cargas[idx] || ""}
                  onChange={(e) => setCargas({ ...cargas, [idx]: e.target.value })}
                />
                <button onClick={() => iniciarDescanso(60)} className="flex-1 bg-gray-800 p-4 rounded-2xl text-[10px] font-black uppercase hover:bg-gray-700 active:scale-95 transition-all">⏱️ Descanso</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaExercicios;