import { useState, useEffect } from "react";

const ListaExercicios = ({ whatsapp, aoFechar, API_URL, modalidade, perfil, treinoIA }) => {
  const [etapaIA, setEtapaIA] = useState('escolher_objetivo');
  const [treinoFixosAtivo, setTreinoFixosAtivo] = useState('A');
  const [carregandoIA, setCarregandoIA] = useState(false);
  const [exerciciosGerados, setExerciciosGerados] = useState([]);
  const [faseTreino, setFaseTreino] = useState("");
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
      { nome: "Leg Press", series: 3, reps: "15", gif: "https://media.giphy.com/media/3o7TKMGpxxS06DclhS/giphy.gif" },
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

  // --- VIEW DA IA (DESIGN PREMIUM COM SUPORTE PARA NOVATOS) ---
  if (modalidade === 'ia') {
    return (
      <div className={modalStyle}>
        <header className="flex justify-between items-center mb-10">
          <button onClick={aoFechar} className="text-gray-400 font-black text-[10px] uppercase tracking-widest">← Sair</button>
          <div className="text-right">
            <h3 className="font-black italic text-orange-500 uppercase leading-none">Mentor IA</h3>
            {treinoIA && !carregandoIA && etapaIA === 'escolher_objetivo' && (
              <span className="text-[7px] text-emerald-500 font-bold uppercase tracking-tighter block mt-1">Plano Ativo no Perfil</span>
            )}
          </div>
        </header>

        {etapaIA === 'escolher_objetivo' ? (
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="text-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-tr from-orange-600 to-yellow-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl border-4 border-white/10">
                <span className="text-4xl">🤖</span>
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                {carregandoIA ? "Construindo sua estratégia..." : "Defina seu Alvo"}
              </h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase mt-2 tracking-widest px-10 leading-relaxed">
                {carregandoIA ? "Aguarde, calculando cargas e intensidades..." : "O Coach IA irá gerar um treino baseado na sua biometria."}
              </p>
            </div>

            <div className="space-y-4">
              <button
                disabled={carregandoIA}
                onClick={() => gerarTreinoIA("Hipertrofia")}
                className={`${carregandoIA ? 'opacity-50' : 'active:scale-95'} w-full bg-orange-600 p-8 rounded-[2.5rem] font-black uppercase italic shadow-xl transition-all flex flex-col items-center`}
              >
                <span className="text-sm">💪 Hipertrofia</span>
                <span className="text-[9px] opacity-70">Ganho de Massa</span>
              </button>

              <button
                disabled={carregandoIA}
                onClick={() => gerarTreinoIA("Emagrecimento")}
                className={`${carregandoIA ? 'opacity-50' : 'active:scale-95'} w-full bg-white/5 border border-white/10 p-8 rounded-[2.5rem] font-black uppercase italic transition-all flex flex-col items-center`}
              >
                <span className="text-sm">🔥 Emagrecimento</span>
                <span className="text-[9px] opacity-70">Definição e Queima</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5 pb-10">
            {/* Banner de Fase */}
            <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-[2.5rem] border border-orange-500/30 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl italic font-black text-white">IA</div>
              <p className="text-[9px] font-black uppercase text-orange-500 tracking-widest mb-1">Status da Missão</p>
              <h4 className="text-2xl font-black italic uppercase text-white tracking-tighter">{faseTreino}</h4>
            </div>

            {/* Lista de Exercícios Técnica */}
            {exerciciosGerados.map((ex, i) => (
              <div key={i} className="bg-gray-900 border border-white/5 p-6 rounded-[2.5rem] shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-black uppercase italic text-white leading-tight mb-1">{ex.nome}</h4>
                    <div className="flex gap-2">
                      <span className="bg-orange-600 text-black text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">
                        {ex.tecnica || "Padrão Ouro"}
                      </span>
                      {/* BOTÃO VER VÍDEO - PARA NOVATOS */}
                      <button
                        onClick={() => window.open(`https://www.youtube.com/results?search_query=como+fazer+${ex.nome}+execução+correta`, '_blank')}
                        className="bg-white/10 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase flex items-center gap-1"
                      >
                        🎬 Ver Vídeo
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-2xl font-black text-white leading-none">{ex.series}x</span>
                    <span className="block text-[9px] font-bold text-gray-500 uppercase italic">Séries</span>
                  </div>
                </div>

                <div className="bg-black/40 p-4 rounded-2xl mb-5 border-l-2 border-orange-500">
                  <p className="text-gray-300 text-[10px] font-bold uppercase leading-relaxed italic">
                    <span className="text-orange-500 font-black">Coach IA:</span> {ex.obs}
                  </p>
                </div>

                <div className="flex justify-between items-center bg-white/5 p-2 rounded-full pl-5">
                  <span className="text-emerald-500 font-black text-[11px] tracking-widest">{ex.reps} REPETIÇÕES</span>
                  <button
                    onClick={() => { setTimer(60); setDescansando(true); }}
                    className="bg-orange-600 text-black px-6 py-3 rounded-full text-[10px] font-black uppercase active:scale-90 transition-all shadow-lg"
                  >
                    ⏱️ Descanso
                  </button>
                </div>
              </div>
            ))}

            <button onClick={() => setEtapaIA('escolher_objetivo')} className="w-full py-6 text-gray-600 font-black uppercase text-[9px] border-2 border-dashed border-white/5 rounded-[2.5rem] mt-6 hover:text-white transition-colors">
              🔄 Ajustar Foco do Treinamento
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
        <button onClick={aoFechar} className="text-gray-500 font-black text-[10px] uppercase tracking-widest">← Sair</button>
        <h3 className="font-black italic uppercase text-emerald-500 tracking-tighter">{modalidade}</h3>
        {descansando ? (
          <span className="bg-emerald-500 text-black px-3 py-1 rounded-full text-xs font-black animate-pulse">{timer}s</span>
        ) : (
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-xs opacity-30">🏋️</div>
        )}
      </header>

      <div className="grid grid-cols-3 gap-2 mb-8 bg-gray-900 p-2 rounded-[2rem]">
        {['A', 'B', 'C'].map(l => (
          <button
            key={l}
            onClick={() => setTreinoFixosAtivo(l)}
            className={`py-4 rounded-[1.5rem] font-black transition-all ${treinoFixosAtivo === l ? 'bg-emerald-500 text-black shadow-lg' : 'bg-transparent text-gray-500'}`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="space-y-6 pb-10">
        {treinosFixosData[treinoFixosAtivo].map((ex, i) => (
          <div key={i} className="bg-gray-900 rounded-[3rem] overflow-hidden border border-white/5 shadow-xl relative">
            <div className="h-48 bg-black relative">
              <img src={ex.gif} className="w-full h-full object-cover opacity-40" alt={ex.nome} />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
            </div>
            <div className="p-8 relative -mt-16">
              <h4 className="font-black uppercase italic text-2xl text-white tracking-tighter leading-none mb-1">{ex.nome}</h4>
              <p className="text-emerald-500 font-black text-[10px] uppercase mb-5 tracking-widest">{ex.series} Séries de {ex.reps}</p>

              <button
                onClick={() => { setTimer(60); setDescansando(true); }}
                className="w-full bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase active:bg-emerald-500 transition-all shadow-xl"
              >
                ⏱️ Iniciar Intervalo
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaExercicios;