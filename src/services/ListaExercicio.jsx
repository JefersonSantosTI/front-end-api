import { useState, useEffect } from "react";

const ListaExercicios = ({ whatsapp, aoFechar, API_URL, modalidade, perfil }) => {
  // Verificando se já tem peso no perfil que veio do App.js
  const [etapa, setEtapa] = useState('verificando');
  const [grupoAtivo, setGrupoAtivo] = useState(null);
  const [timer, setTimer] = useState(0);
  const [descansando, setDescansando] = useState(false);
  const [carregandoIA, setCarregandoIA] = useState(false);

  const [tempPerfil, setTempPerfil] = useState({
    nome: "", peso: "", altura: "", idade: "", genero: "Masculino"
  });

  // SINCRONIZAÇÃO: Se o perfil mudar (pelo chat), atualiza a etapa do treino
  useEffect(() => {
    if (perfil && perfil.peso !== "0") {
      setEtapa('escolher_objetivo');
    } else {
      setEtapa('configuracao_inicial');
    }
  }, [perfil]);

  useEffect(() => {
    let interval;
    if (descansando && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) setDescansando(false);
    return () => clearInterval(interval);
  }, [descansando, timer]);

  const salvarPerfilRapido = async () => {
    if (!tempPerfil.peso || !tempPerfil.altura) return alert("Preencha peso e altura!");

    setCarregandoIA(true);
    try {
      await fetch(`${API_URL}/usuarios/atualizar-perfil`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsapp, ...tempPerfil })
      });

      // Atualizamos o local para garantir consistência
      localStorage.setItem("perfil_peso", tempPerfil.peso);
      localStorage.setItem("perfil_altura", tempPerfil.altura);

      setEtapa('escolher_objetivo');
    } catch {
      alert("Erro ao salvar perfil.");
    } finally {
      setCarregandoIA(false);
    }
  };

  const gerarTreinoInteligente = async (objetivo) => {
    setCarregandoIA(true);
    // Usa os dados do perfil vindo do App.js
    const peso = perfil.peso;
    const altura = perfil.altura;

    try {
      const response = await fetch(`${API_URL}/usuarios/gerar-treino-ia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsapp,
          objetivo: `${objetivo} para alguém de ${peso}kg e ${altura}cm, focado em ${modalidade}`
        })
      });

      const dadosIA = await response.json();
      setGrupoAtivo({
        nome: `${objetivo} - ${modalidade.toUpperCase()}`,
        exercicios: dadosIA.exercicios
      });
      setEtapa('exercicios');
    } catch {
      alert("Erro ao conectar com o Coach Digital.");
    } finally {
      setCarregandoIA(false);
    }
  };

  const overlayStyle = "fixed inset-0 z-[600] flex flex-col items-center justify-center p-6 bg-gray-950/98 backdrop-blur-xl";

  if (etapa === 'verificando') return null;

  if (etapa === 'configuracao_inicial') {
    return (
      <div className={overlayStyle}>
        <div className="w-full max-w-sm bg-gray-900 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
          <button onClick={aoFechar} className="absolute top-6 right-6 text-gray-500 font-black italic">X</button>
          <h2 className="text-white text-xl font-black uppercase italic mb-2 text-center">Personalizar Treino</h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase mb-6 text-center">Precisamos de 2 dados rápidos</p>
          <div className="space-y-4">
            <input type="number" placeholder="PESO (KG)" className="w-full bg-black p-4 rounded-2xl text-white font-bold outline-none border border-white/5"
              onChange={e => setTempPerfil({ ...tempPerfil, peso: e.target.value })} />
            <input type="number" placeholder="ALTURA (CM)" className="w-full bg-black p-4 rounded-2xl text-white font-bold outline-none border border-white/5"
              onChange={e => setTempPerfil({ ...tempPerfil, altura: e.target.value })} />
            <button onClick={salvarPerfilRapido} className="w-full bg-emerald-500 p-4 rounded-2xl text-black font-black uppercase italic active:scale-95 transition-all">
              {carregandoIA ? "Salvando..." : "Salvar e Continuar →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (etapa === 'escolher_objetivo') {
    return (
      <div className={overlayStyle}>
        <div className="w-full max-w-sm text-center">
          <button onClick={aoFechar} className="text-gray-500 text-[10px] font-black uppercase mb-8 tracking-[0.2em]">← Voltar</button>
          <h2 className="text-white text-2xl font-black uppercase italic mb-2">Foco em {modalidade}</h2>

          {carregandoIA ? (
            <div className="flex flex-col items-center py-10">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-emerald-500 font-black text-[10px] uppercase mt-4 animate-pulse">Criando seu protocolo...</p>
            </div>
          ) : (
            <div className="space-y-4 mt-6">
              <button onClick={() => gerarTreinoInteligente("Hipertrofia")}
                className="w-full bg-blue-600 p-6 rounded-[2rem] flex items-center justify-between active:scale-95 transition-all">
                <div className="text-left">
                  <span className="block text-white font-black uppercase italic text-lg">Hipertrofia</span>
                  <span className="text-blue-200 text-[9px] font-bold uppercase">Volume e Massa</span>
                </div>
                <span className="text-3xl">💪</span>
              </button>

              <button onClick={() => gerarTreinoInteligente("Queima de Gordura")}
                className="w-full bg-emerald-500 p-6 rounded-[2rem] flex items-center justify-between active:scale-95 transition-all">
                <div className="text-left">
                  <span className="block text-black font-black uppercase italic text-lg">Queimar</span>
                  <span className="text-emerald-900 text-[9px] font-bold uppercase">Definição e Gasto</span>
                </div>
                <span className="text-3xl">🔥</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[700] bg-black flex flex-col">
      <header className="p-6 bg-gray-950 border-b border-white/5 flex justify-between items-center">
        <div>
          <button onClick={() => setEtapa('escolher_objetivo')} className="text-emerald-500 font-black text-xs uppercase mb-1">← Mudar Foco</button>
          <h3 className="text-white font-black italic uppercase text-lg">{grupoAtivo?.nome}</h3>
        </div>
        {descansando && (
          <div className="bg-emerald-500 px-4 py-2 rounded-2xl flex flex-col items-center animate-pulse">
            <span className="text-lg font-black text-black">{timer}s</span>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24 text-white">
        {grupoAtivo?.exercicios.map((ex, idx) => (
          <div key={idx} className="bg-gray-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden">
            {ex.gif && (
              <div className="w-full h-48 bg-black relative">
                <img src={ex.gif} alt={ex.nome} className="w-full h-full object-contain opacity-70" />
              </div>
            )}
            <div className="p-6">
              <h4 className="text-white text-xl font-black uppercase italic mb-1">{ex.nome}</h4>
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-4">{ex.series} Séries x {ex.reps} Reps</p>
              <div className="flex gap-3">
                <input type="number" placeholder="kg" className="bg-black/50 border border-white/10 rounded-2xl p-4 text-white font-black text-center w-24 outline-none focus:border-emerald-500" />
                <button onClick={() => { setTimer(60); setDescansando(true); }} className="flex-1 bg-gray-800 p-4 rounded-2xl text-[10px] font-black uppercase active:bg-gray-700">⏱️ Descanso</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListaExercicios;