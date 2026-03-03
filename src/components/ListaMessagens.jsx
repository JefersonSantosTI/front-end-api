import { useEffect, useRef } from "react"

export default function ListaMensagens({ mensagens, loading }) {
    const fimRef = useRef(null)

    useEffect(() => {
        fimRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [mensagens, loading])

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mensagens.map((msg) => (
                <div
                    key={msg.id}
                    className={`flex ${msg.remetente === "usuario" ? "justify-end" : "justify-start"
                        }`}
                >
                    <div
                        className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow-lg ${msg.remetente === "usuario"
                                ? "bg-blue-500"
                                : "bg-gray-700"
                            }`}
                    >
                        {msg.texto}
                    </div>
                </div>
            ))}

            {loading && (
                <div className="text-sm text-gray-400 animate-pulse">
                    Digitando...
                </div>
            )}

            <div ref={fimRef} />
        </div>
    )
}