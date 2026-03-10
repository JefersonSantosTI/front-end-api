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


    return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-700 p-4">
        <div className="container mx-auto max-w-4xl">

            <header className="text-center mb-8">

                <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 text-transparent bg-clip-text mb-2">
                    🦾 Treino Fit 🍽️
                </h1>

                <p className="text-gray-300 text-lg">
                    Seu assistente pessoal para treinos e alimentação
                </p>
            </header>

            <div className="bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl h-[600px] border border-gray-200 flex flex-col">
                <ListaMessagens mensagens={mensagens} loading={loading} />
                <ChatBox onEnviarMensagem={onEnviarMensagem} desabilitado={loading} />
            </div>

        </div>
    </div>
}

export default ChatReceitas
