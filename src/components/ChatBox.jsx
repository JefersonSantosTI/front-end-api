import { useState } from "react"


const ChatBox = ({ onEnviarMensagem, desabilitado }) => {
    const [mensagem, setMensagem] = useState('')
    const handleSubmit = (event) => {
        event.preventDefault();


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
                    className="flex-1 px-4 py-2 sm:px-5 sm:py-3 bg-gray-100 border border-gray-300 rounded-full focus:ring-2 focus:ring-emerald-500 outline-none text-sm sm:text-base"
                />

                <button
                    type="submit"
                    disabled={desabilitado}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow transition disabled:bg-gray-400"
                >
                    Enviar
                </button>

            </form>
        </div>
    )




}

export default ChatBox
