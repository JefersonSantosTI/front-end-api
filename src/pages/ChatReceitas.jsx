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
            // AQUI ESTÁ O SEGREDO: 
            // Os nomes devem ser EXATAMENTE 'whatsapp' e 'mensagemAtual'
            const response = await api.post("/receitas/perguntar", {
                whatsapp: "5511000000000",
                mensagemAtual: textoDigitado
            });

            // O seu backend retorna { resposta: "..." }
            const textoBot = response.data.resposta;

            const novaMensagemBot = {
                id: Date.now() + 1,
                texto: textoBot,
                remetente: "bot"
            };

            setMensagens((prev) => [...prev, novaMensagemBot]);

        } catch (erro) {
            // Se der erro 400 aqui, o console vai te dizer o motivo exato enviado pelo res.status(400)
            console.error("Erro detalhado:", erro.response?.data);

            setMensagens((prev) => [...prev, {
                id: Date.now() + 2,
                texto: "Erro na conexão. Verifique se enviou todos os campos! 😢",
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
                    <p className="text-gray-300 text-sm sm:text-lg">
                        Seu assistente para treinos e alimentação
                    </p>
                </header>

                <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 flex flex-col flex-1 overflow-hidden">
                    {/* Lista de mensagens ocupa o espaço disponível */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                        <ListaMessagens mensagens={mensagens} loading={loading} />
                    </div>

                    {/* ChatBox fixo no rodapé do container */}
                    <ChatBox onEnviarMensagem={onEnviarMensagem} desabilitado={loading} />
                </div>

            </div>
        </div>
    )
}

export default ChatReceitas