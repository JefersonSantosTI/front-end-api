import ReactMarkdown from 'react-markdown'

const Mensagem = ({ mensagem }) => {
    const isBot = mensagem.remetente === "bot";

    return (
        <div className={`flex w-full mb-4 ${isBot ? "justify-start" : "justify-end"}`}>
            <div
                className={`max-w-[85%] sm:max-w-md px-4 sm:px-5 py-3 rounded-2xl shadow-sm
            ${isBot
                        ? "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                        : "bg-emerald-600 text-white rounded-br-none"
                    }`}
            >
                <div className="text-sm sm:text-base leading-relaxed break-words">
                    <ReactMarkdown
                        components={{
                            // Removido o 'node' para o VS Code parar de mostrar vermelho
                            strong: ({ ...props }) => (
                                <strong className={`font-black ${isBot ? "text-gray-900" : "text-white"}`} {...props} />
                            ),
                            p: ({ ...props }) => (
                                <p className="mb-2 last:mb-0" {...props} />
                            ),
                            li: ({ ...props }) => (
                                <li className="ml-4 list-disc" {...props} />
                            ),
                            ul: ({ ...props }) => (
                                <ul className="mb-2" {...props} />
                            )
                        }}
                    >
                        {mensagem.texto}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
};

export default Mensagem;