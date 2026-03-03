import { useState } from "react"
import ListaMessagens from "../components/ListaMessagens"
import ChatBox from "../components/ChatBox"
import { api } from "../services/api"

const ChatReceitas = () => {
    const [loading, setLoading] = useState(false)
    const [mensagens, setMensagens] = useState([

    ]);

    const onEnviarMensagem = async (mensagem) => {
        const novaMensagemUsuario = {
            id: Date.now(),
            texto: mensagem,
            remetente: "usuario"
        }

        setMensagens((prev) => [...prev, novaMensagemUsuario])
        setLoading(true)

        try {
            const response = await api.post("/receitas/perguntar", {
                mensagens: [...mensagens, novaMensagemUsuario]

            })

            const novaMensagemBot = {
                id: Date.now() + 1,
                texto: response.data.resposta,
                remetente: "bot"
            }

            setMensagens((prev) => [...prev, novaMensagemBot])


        } catch (erro) {
            console.error(erro)

            const erroMensagem = {
                id: Date.now() + 2,
                texto: "Erro ao buscar resposta 😢",
                remetente: "bot"
            }

            setMensagens((prev) => [...prev, erroMensagem])
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="min-h-screen bg-linear-to-br from-gray-800 via-gray-500 to-emerald-600 p-4">
            <div className="container mx-auto max-w-4xl">
                <header className="text-center mb-8">
                    <h1 className="text-5xl font-bold bg-linear-to-br from-black to-emerald-400 text-transparent bg-clip-text mb-2">🦾Treino Fit🍽️</h1>
                    <p className="text-black-600 text-lg">Seu Assitente Pessoal Para Seus Treinos e Alimetaçao </p>
                </header>

                <div className="bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl h-150 border border-gray-100 flex flex-col">
                    <ListaMessagens mensagens={mensagens} loading={loading} />
                    <ChatBox onEnviarMensagem={onEnviarMensagem} desabilitado={loading} />
                </div>

            </div>
        </div>

    )
}

export default ChatReceitas