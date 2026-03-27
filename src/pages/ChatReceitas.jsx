import { useState, useEffect } from "react"
import ListaMessagens from "../components/ListaMessagens"
import ChatBox from "../components/ChatBox"
import { api } from "../services/api"

// Adicionamos o 'whatsapp' como prop que vem do App.jsx
const ChatReceitas = ({ whatsapp }) => {
    const [loading, setLoading] = useState(false)
    const [mensagens, setMensagens] = useState([])

    // EFEITO: Carregar o histórico do banco de dados ao abrir a página
    useEffect(() => {
        const carregarHistorico = async () => {
            if (!whatsapp) return;

            setLoading(true);
            try {
                // Rota que busca o histórico (certifique-se de que ela existe no seu backend)
                const response = await api.get(`/receitas/historico/${whatsapp}`);

                // Mapeia o formato do MongoDB para o formato do seu Componente de Lista
                const historicoFormatado = response.data.map((msg, index) => ({
                    id: index,
                    texto: msg.content,
                    remetente: msg.role === "user" ? "usuario" : "bot"
                }));

                setMensagens(historicoFormatado);
            } catch (erro) {
                console.error("Erro ao carregar histórico:", erro);
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
            // Chamada enviando o WhatsApp REAL do usuário logado
            const response = await api.post("/receitas/perguntar", {
                whatsapp: whatsapp, // <--- Dinâmico agora!
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
                <header className="text-center mb-4 sm:mb-6 flex justify-between items-center">
                    <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text">
                        🦾 Treino Fit 🍽️
                    </h1>
                    {/* Exibe o número logado de forma discreta */}
                    <span className="text-emerald-400 text-xs font-mono bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-500/30">
                        ID: {whatsapp}
                    </span>
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

export default ChatReceitas;