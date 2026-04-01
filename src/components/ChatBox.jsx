import { useState } from "react"

const ChatBox = ({ onEnviarMensagem, desabilitado }) => {
    const [mensagem, setMensagem] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!mensagem.trim() || desabilitado) return;

        onEnviarMensagem(mensagem)
        setMensagem('')
    }

    return (
        /* Removido border-t e bg-white para integrar ao fundo do ChatReceitas */
        <div className="bg-transparent py-2 transition-all">
            <form className="flex gap-2 sm:gap-3 items-center" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    placeholder={desabilitado ? "FAÇA O UPGRADE PARA CONTINUAR 🔒" : "Pergunte sobre treino ou dieta..."}
                    disabled={desabilitado}

                    /* Estilos Dark & Emerald: Arredondado (2rem) e cores da Home */
                    className={`flex-1 px-5 py-4 rounded-[2rem] outline-none text-sm transition-all border
                        ${desabilitado
                            ? 'bg-gray-900/50 border-gray-800 text-gray-600 cursor-not-allowed opacity-50'
                            : 'bg-gray-900 border-gray-800 text-white focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20'
                        }`}
                />

                <button
                    type="submit"
                    disabled={desabilitado || !mensagem.trim()}
                    /* Botão no estilo FIT: Verde, texto preto e bem arredondado */
                    className={`h-[52px] px-6 rounded-[2rem] shadow-lg transition-all font-black uppercase text-[10px] tracking-widest
                        ${desabilitado
                            ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                            : 'bg-emerald-500 text-black hover:scale-105 active:scale-95 shadow-emerald-500/10'
                        }`}
                >
                    {desabilitado ? "🔒" : "Enviar"}
                </button>
            </form>
        </div>
    )
}

export default ChatBox