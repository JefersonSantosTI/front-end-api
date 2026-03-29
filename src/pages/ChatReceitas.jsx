import { useState, useEffect } from "react"
import ListaMessagens from "../components/ListaMessagens"
import ChatBox from "../components/ChatBox"
import { api } from "../services/api"

// Recebemos isVip e aoPedirUpgrade do App.js
const ChatReceitas = ({ whatsapp, isVip, aoPedirUpgrade }) => {
    const [loading, setLoading] = useState(false)
    const [mensagens, setMensagens] = useState([])
    const [mostrarBotãoUpgrade, setMostrarBotãoUpgrade] = useState(false)

    // EFEITO: Carregar o histórico do banco de dados ao abrir a página
    useEffect(() => {
        const carregarHistorico = async () => {
            if (!whatsapp) return;

            setLoading(true);
            try {
                const response = await api.get(`/receitas/historico/${whatsapp}`);

                const historicoFormatado = response.data.map((msg, index) => {
                    // Se encontrar a trava no histórico antigo, já prepara o botão de upgrade
                    if (msg.content.includes("[CONTEÚDO BLOQUEADO]")) {
                        setMostrarBotãoUpgrade(true);
                    }

                    return {
                        id: index,
                        texto: msg.content,
                        remetente: msg.role === "user" ? "usuario" : "bot"
                    };
                });

                setMensagens(historicoFormatado);
            } catch (error) {
                console.error("Erro ao carregar histórico:", error);
            } finally {
                setLoading(false);
            }
        };

        carregarHistorico();
    }, [whatsapp]);

    const onEnviarMensagem = async (textoDigitado) => {
        if (!textoDigitado.trim()) return;

        const novaMensagemUsuario = {
            id: Date.now(),
            texto: textoDigitado,
            remetente: "usuario"
        };

        setMensagens((prev) => [...prev, novaMensagemUsuario]);
        setLoading(true);
        setMostrarBotãoUpgrade(false); // Esconde o botão enquanto a IA pensa

        try {
            const response = await api.post("/receitas/perguntar", {
                whatsapp: whatsapp,
                mensagemAtual: textoDigitado
            });

            const respostaTexto = response.data.resposta;

            // 💡 LÓGICA DE DETECÇÃO DE TRAVA
            if (respostaTexto.includes("[CONTEÚDO BLOQUEADO]")) {
                setMostrarBotãoUpgrade(true);
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
                texto: "Ops! Ocorreu um erro. Tente novamente em instantes. 😢",
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
                            <h1 className="text-xl font-black text-white tracking-tight">
                                TREINO FIT
                            </h1>
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
                    <div className="max-w-4xl mx-auto w-full" style={{ whiteSpace: 'pre-wrap' }}>
                        <ListaMessagens mensagens={mensagens} loading={loading} />
                    </div>

                    {/* BOTÃO DE UPGRADE DINÂMICO - Aparece logo após a mensagem bloqueada */}
                    {mostrarBotãoUpgrade && !isVip && (
                        <div className="max-w-4xl mx-auto w-full mt-4 animate-bounce">
                            <button
                                onClick={aoPedirUpgrade}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-black py-4 rounded-2xl shadow-lg border-b-4 border-red-800 active:border-b-0 transition-all"
                            >
                                🔓 LIBERAR DIETA COMPLETA AGORA
                            </button>
                            <p className="text-center text-slate-400 text-[10px] mt-2 font-bold uppercase">Clique para desbloquear almoço e jantar</p>
                        </div>
                    )}
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
                
                @keyframes bounce {
                    0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
                    50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
                }
                .animate-bounce { animation: bounce 1s infinite; }
            `}} />
        </div>
    );
};

export default ChatReceitas;