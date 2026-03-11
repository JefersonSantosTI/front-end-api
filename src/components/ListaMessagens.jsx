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
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

            {mensagens.map((mensagem) => (
                <Mensagem key={mensagem.id} mensagem={mensagem} />
            ))}

            {loading && (
                <div className="flex justify-start">
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow border border-gray-200">

                        <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-150"></div>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-300"></div>
                        </div>

                    </div>
                </div>
            )}

            <div ref={mensagemRef}></div>

        </div>
    )
}

export default ListaMessagens
