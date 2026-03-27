import { useState } from "react"

const ChatBox = ({ onEnviarMensagem, desabilitado }) => {
    const [mensagem, setMensagem] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!mensagem.trim()) return; // Evita enviar mensagem vazia

        onEnviarMensagem(mensagem)
        setMensagem('')
    }

    return (
        <div className="border-t border-gray-200 bg-white p-3 sm:p-4">
            <form className="flex gap-2 sm:gap-3" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    placeholder="Pergunte sobre treino ou alimentação..."
                    disabled={desabilitado}
                    // ADICIONADO: text-gray-900 e placeholder-gray-500
                    // ADICIONADO: style={{ color: 'black' }} para forçar a visibilidade
                    className="flex-1 px-4 py-2 sm:px-5 sm:py-3 bg-gray-100 border border-gray-300 rounded-full focus:ring-2 focus:ring-emerald-500 outline-none text-sm sm:text-base text-gray-900 placeholder-gray-500"
                    style={{ color: '#1a202c', backgroundColor: '#f3f4f6' }}
                />

                <button
                    type="submit"
                    disabled={desabilitado || !mensagem.trim()}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow transition disabled:bg-gray-400 font-bold"
                >
                    {desabilitado ? "..." : "Enviar"}
                </button>
            </form>
        </div>
    )
}

export default ChatBox