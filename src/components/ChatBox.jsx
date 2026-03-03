import { useState } from "react"

export default function ChatInput({ onEnviar }) {
    const [texto, setTexto] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!texto.trim()) return
        onEnviar(texto)
        setTexto("")
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="p-4 bg-black/40 backdrop-blur-md flex gap-2"
        >
            <input
                type="text"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Pergunte sobre receitas fitness..."
                className="flex-1 p-3 rounded-xl bg-gray-800 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition"
            >
                Enviar
            </button>
        </form>
    )
}