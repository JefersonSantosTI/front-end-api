import { useEffect, useRef } from "react"
import Mensagem from "./Mensagem"

const ListaMessagens = ({ mensagens, loading }) => {
    const mensagemRef = useRef(null)

    const scrollbaixo = () => {
        // O scrollIntoView funciona melhor aqui com block: "end"
        mensagemRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }

    useEffect(() => {
        // Pequeno delay para garantir que o conteúdo renderizou
        const timer = setTimeout(scrollbaixo, 100);
        return () => clearTimeout(timer);
    }, [mensagens, loading])

    return (
        /* 
           Removido overflow-y-auto e flex-1. 
           Agora esta div apenas lista os itens, 
           o scroll é controlado pelo componente pai.
        */
        <div className="flex flex-col space-y-3 w-full">
            {mensagens.map((mensagem) => (
                <Mensagem key={mensagem.id} mensagem={mensagem} />
            ))}

            {loading && (
                <div className="flex justify-start animate-fade-in">
                    {/* Estilo da bolha de "digitando" igual à mensagem do bot */}
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex items-center">
                        <div className="flex space-x-1.5">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-duration:1s]"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.2s]"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.4s]"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Referência invisível para o scroll */}
            <div ref={mensagemRef} className="h-4 w-full" />
        </div>
    )
}

export default ListaMessagens