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
        // Wrapper Principal: h-screen evita rolagens desnecessárias e trava o layout no tamanho da tela
        <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex flex-col overflow-hidden">

            {/* Container do Chat: No mobile é Full, no PC tem largura máxima e margens */}
            <div className="mx-auto w-full max-w-4xl h-full flex flex-col bg-slate-50 shadow-2xl sm:my-2 sm:h-[calc(100vh-1rem)] sm:rounded-2xl overflow-hidden border-x border-gray-200 sm:border-none">

                {/* Header: Mais compacto e fixo no topo */}
                <header className="bg-slate-900 p-3 sm:p-4 flex justify-between items-center border-b border-emerald-500/30">
                    <div className="flex flex-col">
                        <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text leading-tight">
                            🦾 TREINO FIT
                        </h1>
                        <span className="text-[10px] text-emerald-500/60 font-bold uppercase tracking-tighter">Inteligência Artificial</span>
                    </div>

                    <div className="flex flex-col items-end">
                        <span className="text-emerald-400 text-[10px] font-mono bg-emerald-950/50 px-2 py-1 rounded border border-emerald-500/20">
                            ID: {whatsapp}
                        </span>
                    </div>
                </header>

                {/* Área das Mensagens: flex-1 faz com que ela "empurre" o input para o rodapé */}
                <main className="flex-1 overflow-hidden flex flex-col relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 sm:p-4">
                        <ListaMessagens mensagens={mensagens} loading={loading} />
                    </div>
                </main>

                {/* Rodapé/Input: Fica sempre visível, sem flutuar sobre as mensagens */}
                <footer className="bg-white p-2 sm:p-4 border-t border-gray-200">
                    <ChatBox onEnviarMensagem={onEnviarMensagem} desabilitado={loading} />
                </footer>
            </div>

            {/* Estilo para suavizar a barra de rolagem no PC */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
            `}} />
        </div>
    );
}

export default ChatReceitas;