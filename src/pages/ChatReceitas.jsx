import { useState } from "react"
import ListaMensagens from "../components/ListaMensagens"
import ChatInput from "../components/ChatInput"
import { api } from "../services/api"

export default function ChatReceitas() {
    const [mensagens, setMensagens] = useState([])
    const [loading, setLoading] = useState(false)

    const enviarMensagem = async (texto) => {
        const novaMensagem = { id: Date.now(), texto, remetente: "usuario" }
        const novasMensagens = [...mensagens, novaMensagem]

        setMensagens(novasMensagens)
        setLoading(true)

        try {
            const response = await api.post("/receitas/perguntar", {
                mensagens: novasMensagens
            })

            setMensagens((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    texto: response.data.resposta,
                    remetente: "bot"
                }
            ])
        } catch (err) {
            setMensagens((prev) => [
                ...prev,
                {
                    id: Date.now() + 2,
                    texto: "Erro ao obter resposta 😢",
                    remetente: "bot"
                }
            ])
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">

            {/* Header */}
            <div className="p-4 bg-black/40 backdrop-blur-md shadow-md">
                <h1 className="text-xl font-bold text-center">
                    🥗 ChatReceitas TreinoFit
                </h1>
            </div>

            {/* Mensagens */}
            <ListaMensagens mensagens={mensagens} loading={loading} />

            {/* Input */}
            <ChatInput onEnviar={enviarMensagem} />
        </div>
    )
}