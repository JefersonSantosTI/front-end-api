import { useState, useEffect } from "react";

const ListaExercicios = ({ whatsapp, aoFechar, API_URL, modalidade, perfil, treinoIA }) => {
  const [etapaIA, setEtapaIA] = useState('escolher_objetivo');
  const [treinoFixosAtivo, setTreinoFixosAtivo] = useState('A');
  const [carregandoIA, setCarregandoIA] = useState(false);
  const [exerciciosGerados, setExerciciosGerados] = useState([]);
  const [faseTreino, setFaseTreino] = useState(""); // Nova state para a fase
  const [timer, setTimer] = useState(0);
  const [descansando, setDescansando] = useState(false);

  useEffect(() => {
    let interval;
    if (descansando && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0 && descansando) {
      setDescansando(false);
    }
    return () => clearInterval(interval);
  }, [descansando, timer]);

  // --- TREINOS FIXOS (Com GIFs - Gratuito) ---
  const treinosFixosData = {
    A: [
      { nome: "Supino Reto", series: 3, reps: "12", gif: "https://media.giphy.com/media/3o7TKMGpxxS06DclhS/giphy.gif" },
      { nome: "Desenvolvimento", series: 3, reps: "10", gif: "https://media.giphy.com/media/3o7TKv6lS8x1tZ2Q0M/giphy.gif" },
    ],
    B: [
      { nome: "Puxada Frontal", series: 3, reps: "12", gif: "https://media.giphy.com/media/3o7TKMGpxxS06DclhS/giphy.gif" },
      { nome: "Rosca Direta", series: 3, reps: "12", gif: "https://media.giphy.com/media/3o7TKv6lS8x1tZ2Q0M/giphy.gif" },
    ],
    C: [
      { nome: "Agachamento", series: 4, reps: "10", gif: "https://media.giphy.com/media/3o7TKMGpxxS06DclhS/giphy.gif" },
      { nome: "Leg Press", series: 3, reps: "15", gif: "https://media.giphy.com/media/3o7TKv6lS8x1tZ2Q0M/giphy.gif" },
    ]
  };

  const gerarTreinoIA = async (objetivo) => {
    setCarregandoIA(true);
    try {
      const response = await fetch(`${API_URL}/usuarios/gerar-treino-ia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsapp,
          objetivo,
          perfil: { peso: perfil.peso, altura: perfil.altura }
        })
      });
      const dadosIA = await response.json();

      // Armazena os exercícios e a fase que a IA gerou
      setExerciciosGerados(dadosIA.treino || []);
      setFaseTreino(dadosIA.fase || "Alta Performance");
      setEtapaIA('treino_ia');
    } catch {
      alert("Erro ao conectar com Mentor IA.");
    } finally {
      setCarregandoIA(false);
    }
  };

  const modalStyle = "fixed inset-0 z-[800] bg-gray-950 flex flex-col p-6 overflow-y-auto text-white";

  // --- VIEW DA IA (DESIGN PREMIUM SEM GIF) ---
  if (modalidade === 'ia') {
    return (
      <div className={modalStyle}>
        <header className="flex justify-between items-center mb-10">
          <button onClick={aoFechar} className="text-gray-500 font-black text-xs uppercase">← Sair</button>
          <div className="text-right">
            <h3 className="font-black italic text-orange-500 uppercase">Mentor IA</h3>
            {/* RESOLUÇÃO DO ERRO: USANDO A VARIÁVEL treinoIA */}
            {treinoIA && !carregandoIA && etapaIA === 'escolher_objetivo' && (
              <span className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest block">
                Você já possui um treino ativo
              </span>
            )}
            {descansando && <span className="text-emerald-500 font-black animate-pulse">{timer}s</span>}
          </div>
        </header>

        {etapaIA === 'escolher_objetivo' ? (
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-black uppercase italic">
                {carregandoIA ? "Analisando seu Perfil..." : "O que vamos treinar?"}
              </h2>
              {!carregandoIA && (
                <p className="text-[10px] text-gray-500 font-bold uppercase mt-2 tracking-widest">
                  O Mentor IA criará um plano técnico exclusivo
                </p>
              )}
            </div>

            <button
              disabled={carregandoIA}
              onClick={() => gerarTreinoIA("Hipertrofia")}
              className={`${carregandoIA ? 'opacity-50' : 'active:scale-95'} bg-orange-500 p-8 rounded-[2.5rem] font-black uppercase italic shadow-2xl shadow-orange-500/20`}
            >
              {carregandoIA ? "⌛ Mapeando Fibras..." : "💪 Hipertrofia"}
            </button>
            <button
              disabled={carregandoIA}
              onClick={() => gerarTreinoIA("Emagrecimento")}
              className={`${carregandoIA ? 'opacity-50' : 'active:scale-95'} bg-white/10 border border-white/10 p-8 rounded-[2.5rem] font-black uppercase italic`}
            >
              {carregandoIA ? "⌛ Calculando Déficit..." : "🔥 Emagrecimento"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5 pb-10">
            {/* Banner de Fase */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 rounded-[2rem] shadow-xl">
              <p className="text-[10px] font-black uppercase text-orange-200 tracking-widest mb-1">Fase Estratégica</p>
              <h4 className="text-2xl font-black italic uppercase text-white">{faseTreino}</h4>
            </div>

            {/* Lista de Exercícios Técnica */}
            {exerciciosGerados.map((ex, i) => (
              <div key={i} className="bg-gray-900 border-l-4 border-orange-500 p-6 rounded-r-[2rem] rounded-l-lg shadow-lg">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-black uppercase italic text-white leading-tight mb-1">{ex.nome}</h4>
                    <span className="bg-orange-500/10 text-orange-500 text-[9px] font-black px-2 py-1 rounded uppercase tracking-tighter">
                      {ex.tecnica || "Técnica de Elite"}
                    </span>
                  </div>
                  <div className="text-right ml-4">
                    <span className="block text-2xl font-black text-white leading-none">{ex.series}x</span>
                    <span className="block text-[10px] font-bold text-gray-500 uppercase italic">Séries</span>
                  </div>
                </div>

                <div className="bg-black/30 p-3 rounded-xl mb-4 border border-white/5">
                  <p className="text-gray-400 text-[11px] font-bold uppercase leading-tight italic">
                    <span className="text-white">Coach:</span> {ex.obs}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-emerald-500 font-black text-sm tracking-tighter">{ex.reps} REPETIÇÕES</span>
                  <button
                    onClick={() => { setTimer(60); setDescansando(true); }}
                    className="bg-white/5 px-4 py-2 rounded-full text-[10px] font-black uppercase text-gray-400 active:bg-orange-500 active:text-black transition-all"
                  >
                    ⏱️ Descanso
                  </button>
                </div>
              </div>
            ))}

            <button onClick={() => setEtapaIA('escolher_objetivo')} className="w-full py-6 text-gray-600 font-black uppercase text-[10px] border-2 border-dashed border-white/5 rounded-[2rem] mt-4">
              🔄 Refazer Planejamento IA
            </button>
          </div>
        )}
      </div>
    );
  }

  // --- VIEW ACADEMIA / CASA (DESIGN COM GIF - ISCA) ---
  return (
    <div className={modalStyle}>
      <header className="flex justify-between items-center mb-8">
        <button onClick={aoFechar} className="text-gray-500 font-black text-xs uppercase">← Sair</button>
        <h3 className="font-black italic uppercase text-emerald-500 tracking-tighter">{modalidade}</h3>
        {descansando && <span className="text-emerald-500 font-black animate-pulse">{timer}s</span>}
      </header>

      <div className="grid grid-cols-3 gap-2 mb-8">
        {['A', 'B', 'C'].map(l => (
          <button
            key={l}
            onClick={() => setTreinoFixosAtivo(l)}
            className={`py-4 rounded-2xl font-black transition-all ${treinoFixosAtivo === l ? 'bg-emerald-500 text-black scale-105 shadow-lg' : 'bg-gray-900 text-gray-500'}`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="space-y-6 pb-10">
        {treinosFixosData[treinoFixosAtivo].map((ex, i) => (
          <div key={i} className="bg-gray-900 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-xl">
            <div className="h-44 bg-black relative">
              <img src={ex.gif} className="w-full h-full object-cover opacity-60" alt={ex.nome} />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent"></div>
            </div>
            <div className="p-6 relative -mt-10">
              <h4 className="font-black uppercase italic text-xl text-white tracking-tighter">{ex.nome}</h4>
              <p className="text-emerald-500 font-black text-xs uppercase mb-4">{ex.series} Séries de {ex.reps}</p>
              <button
                onClick={() => { setTimer(60); setDescansando(true); }}
                className="w-full bg-emerald-500/10 border border-emerald-500/20 py-4 rounded-2xl text-[10px] font-black uppercase text-emerald-500 active:bg-emerald-500 active:text-black transition-all"
              >
                ⏱️ Iniciar Descanso
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaExercicios;