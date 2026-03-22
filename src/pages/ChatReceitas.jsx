import { useState } from "react"
import ListaMessagens from "../components/ListaMessagens"
import ChatBox from "../components/ChatBox"
import { api } from "../services/api"

const ChatReceitas = () => {
    const [loading, setLoading] = useState(false)
    const [mensagens, setMensagens] = useState([])

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
            // Chamada sincronizada com o Backend
            const response = await api.post("/receitas/perguntar", {
                whatsapp: "5511000000000", // Aqui você pode capturar o whats real depois
                mensagemAtual: textoDigitado
            });

            const textoBot = response.data.resposta;

            const novaMensagemBot = {
                id: Date.now() + 1,
                texto: textoBot,
                remetente: "bot"
            };

            setMensagens((prev) => [...prev, novaMensagemBot]);

        } catch (erro) {
            console.error("Erro detalhado:", erro.response?.data || erro.message);

            setMensagens((prev) => [...prev, {
                id: Date.now() + 2,
                texto: "Ops! Ocorreu um erro no servidor. Verifique sua conexão ou tente novamente. 😢",
                remetente: "bot"
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-700 p-2 sm:p-4">
            <div className="mx-auto max-w-4xl h-[95vh] flex flex-col">
                <header className="text-center mb-4 sm:mb-6">
                    <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text">
                        🦾 Treino Fit 🍽️
                    </h1>
                </header>

                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-hidden flex flex-col">
                        <ListaMessagens mensagens={mensagens} loading={loading} />
                    </div>
                    <ChatBox onEnviarMensagem={onEnviarMensagem} desabilitado={loading} />
                </div>
            </div>
        </div>
    )
}

export default ChatReceitas
