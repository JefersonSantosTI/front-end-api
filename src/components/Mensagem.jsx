const Mensagem = ({ mensagem }) => {

    const isBot = mensagem.remetente === "bot"

    const Mensagem = ({ mensagem }) => {

        const isBot = mensagem.remetente === "bot"

        return (
            <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>

                <div
                    className={`max-w-[85%] sm:max-w-md px-4 sm:px-5 py-3 rounded-2xl shadow
          ${isBot
                            ? "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                            : "bg-emerald-500 text-white rounded-br-none"
                        }`}
                >
                    <p className="text-sm sm:text-base whitespace-pre-line">
                        {mensagem.texto}
                    </p>
                    <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>

                        <div
                            className={`max-w-[85%] sm:max-w-md px-4 sm:px-5 py-3 rounded-2xl shadow
          ${isBot
                                    ? "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                                    : "bg-emerald-500 text-white rounded-br-none"
                                }`}
                        >
                            <p className="text-sm sm:text-base whitespace-pre-line">
                                {mensagem.texto}
                            </p>
                        </div>


                    </div>
                    )
}
                    )
}

                    export default Mensagem
                    export default Mensagem
