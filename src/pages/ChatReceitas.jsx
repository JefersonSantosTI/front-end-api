import { useState, useEffect } from "react"
import ListaMessagens from "../components/ListaMessagens"
import ChatBox from "../components/ChatBox"
import { api } from "../services/api"

const ChatReceitas = ({ whatsapp }) => {
    const [loading, setLoading] = useState(false)
    const [mensagens, setMensagens] = useState([])

    // EFEITO: Carregar o histórico do banco de dados ao abrir a página
    useEffect(() => {
        const carregarHistorico = async () => {
            if (!whatsapp) return;

            setLoading(true);
            try {
                const response = await api.get(`/receitas/historico/${whatsapp}`);

                const historicoFormatado = response.data.map((msg, index) => ({
                    id: index,
                    texto: msg.content,
                    remetente: msg.role === "user" ? "usuario" : "bot"
                }));

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

        try {
            const response = await api.post("/receitas/perguntar", {
                whatsapp: whatsapp,
                mensagemAtual: textoDigitado
            });

            const novaMensagemBot = {
                id: Date.now() + 1,
                texto: response.data.resposta,
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
        // O uso de 'fixed inset-0' garante que o app ocupe a tela toda sem rolagens fantasmas no iOS
        <div className="fixed inset-0 bg-slate-900 flex flex-col font-sans overflow-hidden">

            {/* HEADER PROFISSIONAL - Altura fixa garantida */}
            <header className="bg-slate-800 border-b border-emerald-500/30 p-4 flex-none z-20 shadow-xl">
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

                    <div className="text-right flex flex-col justify-center">
                        <span className="text-[9px] text-slate-500 uppercase font-black">ID de Acesso</span>
                        <span className="text-emerald-400 text-xs font-mono font-bold">{whatsapp}</span>
                    </div>
                </div>
            </header>

            {/* ÁREA DO CHAT - Fundo com textura leve e scroll suave */}
            <main className="flex-1 overflow-hidden bg-slate-100 flex flex-col relative">
                {/* Overlay de textura opcional para dar profundidade */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar z-10">
                    <div className="max-w-4xl mx-auto w-full">
                        <ListaMessagens mensagens={mensagens} loading={loading} />
                    </div>
                </div>
            </main>

            {/* RODAPÉ - Onde fica o campo de texto */}
            <footer className="bg-white p-3 sm:p-4 border-t border-slate-200 flex-none z-20 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                <div className="max-w-4xl mx-auto">
                    <ChatBox onEnviarMensagem={onEnviarMensagem} desabilitado={loading} />
                </div>
            </footer>

            {/* Estilização da barra de rolagem para PC */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
            `}} />
        </div>
    );
};

export default ChatReceitas;