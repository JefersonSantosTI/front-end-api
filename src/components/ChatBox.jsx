import { useState } from "react"

const ChatBox = ({ onEnviarMensagem, desabilitado }) => {
    const [mensagem, setMensagem] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault();
        // Não envia se estiver vazio ou se o chat estiver bloqueado (Segurança extra)
        if (!mensagem.trim() || desabilitado) return;

        onEnviarMensagem(mensagem)
        setMensagem('')
    }

    return (
        <div className="border-t border-gray-200 bg-white p-3 sm:p-4 transition-all">
            <form className="flex gap-2 sm:gap-3" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    // Dinamiza o placeholder para avisar o usuário
                    placeholder={desabilitado ? "Limite de mensagens atingido 🔒" : "Pergunte sobre treino ou alimentação..."}
                    disabled={desabilitado}

                    // Estilos dinâmicos: Se desabilitado, o fundo fica mais escuro e o cursor muda
                    className={`flex-1 px-4 py-2 sm:px-5 sm:py-3 border rounded-full outline-none text-sm sm:text-base transition-all
                        ${desabilitado
                            ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed opacity-70'
                            : 'bg-gray-100 border-gray-300 text-gray-900 focus:ring-2 focus:ring-emerald-500'
                        }`}

                    // Estilos inline mantidos para garantir cores em dispositivos móveis
                    style={{
                        color: desabilitado ? '#94a3b8' : '#1a202c',
                        backgroundColor: desabilitado ? '#e2e8f0' : '#f3f4f6'
                    }}
                />

                <button
                    type="submit"
                    // Desabilita o botão se a IA estiver pensando ou se o upgrade for necessário
                    disabled={desabilitado || !mensagem.trim()}
                    className={`px-4 sm:px-6 py-2 sm:py-3 text-white rounded-full shadow transition font-bold uppercase text-xs sm:text-sm
                        ${desabilitado
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-emerald-500 hover:bg-emerald-600 active:scale-95'
                        }`}
                >
                    {desabilitado ? "🔒" : "Enviar"}
                </button>
            </form>
        </div>
    )
}

export default ChatBox