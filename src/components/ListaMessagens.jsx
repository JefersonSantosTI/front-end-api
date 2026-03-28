import { useEffect, useRef } from "react"
import Mensagem from "./Mensagem"

const ListaMessagens = ({ mensagens, loading }) => {
    const mensagemRef = useRef(null)

    const scrollbaixo = () => {
        mensagemRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollbaixo()
    }, [mensagens, loading])

    return (
        // p-4 em vez de p-6 para ganhar espaço no mobile
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {mensagens.map((mensagem) => (
                <Mensagem key={mensagem.id} mensagem={mensagem} />
            ))}

            {loading && (
                <div className="flex justify-start">
                    <div className="bg-white px-4 py-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-200">
                        <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        </div>
                    </div>
                </div>
            )}

            <div ref={mensagemRef} className="h-2"></div>
        </div>
    )
}

export default ListaMessagens