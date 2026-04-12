import { useState, useEffect } from "react";
import { PROTOCOLOS_TREINO } from "./treinos.js";

const ListaExercicios = ({ modalidade, whatsapp, aoFechar, API_URL }) => {
  // Alterado: etapa inicial agora é 'categorias' para pular a tela de IA
  const [etapa, setEtapa] = useState('categorias');
  const [grupoAtivo, setGrupoAtivo] = useState(null);
  const [feitos, setFeitos] = useState([]);

  const dados = PROTOCOLOS_TREINO[modalidade];

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const res = await fetch(`${API_URL}/usuarios/${whatsapp}`);
        if (res.ok) {
          const user = await res.json();
          setFeitos(user.treinosConcluidos || []);
        }
      } catch (err) { console.error("Erro API:", err); }
    };
    if (whatsapp) buscarDados();
  }, [whatsapp, API_URL, modalidade]);

  const toggleExercicio = async (exercicioId) => {
    const novosFeitos = feitos.includes(exercicioId)
      ? feitos.filter(id => id !== exercicioId)
      : [...feitos, exercicioId];

    setFeitos(novosFeitos);

    try {
      await fetch(`${API_URL}/usuarios/progresso-treino`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsapp, exercicioId })
      });
    } catch (err) { console.error("Erro ao salvar:", err); }
  };

  if (!dados) return null;

  const overlayStyle = "fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300";
  const cardStyle = "w-full max-w-md bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]";

  // --- TELA 1: CATEGORIAS (SUBSTITUI A TELA IA) ---
  if (etapa === 'categorias') {
    return (
      <div className={overlayStyle}>
        <div className={cardStyle}>
          <div className="p-6 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <button onClick={aoFechar} className="text-gray-600 text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors">← Sair</button>
              <div className="text-right">
                <h3 className="text-white font-black uppercase italic text-lg tracking-tighter leading-none">{dados.titulo}</h3>
                <p className={`text-[8px] font-black uppercase tracking-widest text-${dados.cor}-500`}>Selecione o Treino</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 pb-4">
              {dados.grupos.map((g) => (
                <button
                  key={g.id}
                  onClick={() => { setGrupoAtivo(g); setEtapa('exercicios'); }}
                  className="bg-gray-900/30 border border-white/5 p-5 rounded-[1.5rem] flex items-center justify-between active:scale-[0.98] transition-all hover:border-white/20 group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{g.icone || "💪"}</span>
                    <span className="text-[11px] text-white font-black uppercase tracking-widest">{g.nome}</span>
                  </div>
                  <span className="text-gray-600 group-hover:text-white transition-colors">→</span>
                </button>
              ))}
            </div>


          </div>
        </div>
      </div>
    );
  }

  // --- TELA 2: EXERCÍCIOS ---
  if (etapa === 'exercicios') {
    return (
      <div className={overlayStyle}>
        <div className={cardStyle}>
          <div className="p-4 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md">
            <button onClick={() => setEtapa('categorias')} className="text-gray-500 text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors">← Voltar</button>
            <div className="text-right">
              <h4 className={`text-[8px] font-black uppercase tracking-widest leading-none text-${dados.cor}-500`}>{grupoAtivo.nome}</h4>
              <p className="text-white text-xs font-black uppercase italic leading-none mt-1">Execução</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-6">
            {grupoAtivo.exercicios.map((ex) => {
              const isDone = feitos.includes(ex.id);
              return (
                <div key={ex.id} onClick={() => toggleExercicio(ex.id)} className={`flex items-center p-2 rounded-[1.5rem] border transition-all cursor-pointer ${isDone ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/5 bg-gray-900/20 hover:border-white/10'}`}>
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                    <img src={ex.gif} className={`w-full h-full object-cover ${isDone ? 'grayscale opacity-20' : 'opacity-90'}`} />
                    {isDone && <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/10"><span className="text-lg">✅</span></div>}
                  </div>
                  <div className="flex-1 ml-4">
                    <h5 className={`text-[12px] font-black uppercase italic leading-tight ${isDone ? 'text-gray-600 line-through' : 'text-white'}`}>{ex.nome}</h5>
                    <p className="text-emerald-500 text-[8px] font-black uppercase mt-1 tracking-widest">{ex.series}</p>
                  </div>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${isDone ? 'bg-emerald-500 border-emerald-500 shadow-sm' : 'border-white/10 bg-white/5'}`}>
                    {isDone ? <span className="text-black font-black text-[10px]">✓</span> : <span className="text-white/10 text-xl">+</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
};

export default ListaExercicios;