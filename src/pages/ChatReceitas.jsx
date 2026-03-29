import { useState, useEffect, useRef } from "react"
import ListaMessagens from "../components/ListaMessagens"
import ChatBox from "../components/ChatBox"
import { api } from "../services/api"

const ChatReceitas = ({ whatsapp, isVip, aoPedirUpgrade }) => {
    const [loading, setLoading] = useState(false)
    const [mensagens, setMensagens] = useState([])
    const [mostrarBotãoUpgrade, setMostrarBotãoUpgrade] = useState(false)

    const scrollRef = useRef(null);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [mensagens, loading, mostrarBotãoUpgrade]);

    useEffect(() => {
        const carregarHistorico = async () => {
            if (!whatsapp) return;
            setLoading(true);
            setMostrarBotãoUpgrade(false);

            try {
                const response = await api.get(`/receitas/historico/${whatsapp}`);
                // Garantindo que response.data seja tratado como array
                const dados = Array.isArray(response.data) ? response.data : [];

                let detectouBloqueioNoHistorico = false;

                const historicoFormatado = dados.map((msg, index) => {
                    const texto = msg.content || "";

                    // Se encontrar qualquer tag de bloqueio no histórico, marca para mostrar o botão
                    if (!isVip && texto.toUpperCase().includes("BLOQUEADO")) {
                        detectouBloqueioNoHistorico = true;
                    }

                    return {
                        id: index,
                        texto: texto,
                        remetente: msg.role === "assistant" ? "bot" : "usuario"
                    };
                });

                setMostrarBotãoUpgrade(detectouBloqueioNoHistorico);
                setMensagens(historicoFormatado);
            } catch (error) {
                console.error("Erro ao carregar histórico:", error);
            } finally {
                setLoading(false);
            }
        };
        carregarHistorico();
    }, [whatsapp, isVip]);

    const onEnviarMensagem = async (textoDigitado) => {
        if (!textoDigitado.trim()) return;

        const novaMensagemUsuario = {
            id: Date.now(),
            texto: textoDigitado,
            remetente: "usuario"
        };

        setMensagens((prev) => [...prev, novaMensagemUsuario]);
        setLoading(true);

        try {
            const response = await api.post("/receitas/perguntar", {
                whatsapp: whatsapp,
                mensagemAtual: textoDigitado
            });

            const respostaTexto = response.data.resposta || "";
            const statusTrial = response.data.isTrial; // Pegando o status direto do seu back-end

            // LÓGICA DE DETECÇÃO MELHORADA:
            // Mostra o botão se: (Não é VIP) E (A resposta tem "BLOQUEADO" OU o back-end confirmou isTrial)
            const deveMostrarBotao = !isVip && (
                respostaTexto.toUpperCase().includes("BLOQUEADO") ||
                statusTrial === true
            );

            if (deveMostrarBotao) {
                setMostrarBotãoUpgrade(true);
            } else if (isVip) {
                setMostrarBotãoUpgrade(false);
            }

            const novaMensagemBot = {
                id: Date.now() + 1,
                texto: respostaTexto,
                remetente: "bot"
            };

            setMensagens((prev) => [...prev, novaMensagemBot]);

        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            setMensagens((prev) => [...prev, {
                id: Date.now() + 2,
                texto: "Ops! Tente novamente em instantes. 😢",
                remetente: "bot"
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900 flex flex-col font-sans overflow-hidden">
            {/* HEADER */}
            <header className="bg-slate-800 border-b border-emerald-500/30 p-4 flex-none z-30 shadow-xl">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <div className="bg-emerald-500 p-1 rounded">
                                <span className="text-black font-black text-xs leading-none">IA</span>
                            </div>
                            <h1 className="text-xl font-black text-white tracking-tight">TREINO FIT</h1>
                        </div>
                        <p className="text-[10px] text-emerald-400 font-bold tracking-[0.2em] uppercase mt-1">Consultoria Digital</p>
                    </div>

                    <div className="text-right">
                        <span className="text-[9px] text-slate-500 uppercase font-black">Plano</span>
                        <span className={`block text-xs font-bold uppercase ${isVip ? 'text-emerald-400' : 'text-orange-400'}`}>
                            {isVip ? '💎 VIP Ativo' : '🍊 Degustação'}
                        </span>
                    </div>
                </div>
            </header>

            {/* ÁREA DO CHAT */}
            <main className="flex-1 overflow-hidden bg-slate-100 flex flex-col relative">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                <div className="flex-1 overflow-y-auto p-4 z-10 custom-scrollbar">
                    <div className="max-w-4xl mx-auto w-full">
                        <ListaMessagens mensagens={mensagens} loading={loading} />

                        {/* BOTÃO DE UPGRADE DINÂMICO */}
                        {mostrarBotãoUpgrade && !isVip && (
                            <div className="w-full mt-6 mb-12 animate-bounce-slow transition-all">
                                <button
                                    onClick={aoPedirUpgrade}
                                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-black py-5 rounded-2xl shadow-[0_10px_25px_rgba(234,88,12,0.4)] border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all uppercase text-sm sm:text-base px-2"
                                >
                                    🔓 LIBERAR DIETA COMPLETA AGORA
                                </button>
                                <p className="text-center text-slate-500 text-[11px] mt-3 font-black uppercase tracking-widest">
                                    Acesso imediato ao almoço e jantar
                                </p>
                            </div>
                        )}

                        <div ref={scrollRef} className="h-4" />
                    </div>
                </div>
            </main>

            {/* RODAPÉ */}
            <footer className="bg-white p-3 sm:p-4 border-t border-slate-200 flex-none z-30 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                <div className="max-w-4xl mx-auto">
                    <ChatBox onEnviarMensagem={onEnviarMensagem} desabilitado={loading} />
                </div>
            </footer>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
                input, textarea { font-size: 16px !important; }
                @keyframes bounceSlow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .animate-bounce-slow { animation: bounceSlow 2s infinite ease-in-out; }
            `}} />
        </div>
    );
};

export default ChatReceitas;