import React from 'react';

const TelaPlanos = ({ aoEscolher }) => {
    // 🚨 COLOQUE SEU NÚMERO AQUI (DDD + NÚMERO) SEM ESPAÇOS OU TRAÇOS
    const MEU_WHATSAPP = "5561991268229";

    const planos = [
        {
            nome: "Trimestral",
            periodo: "3 Meses",
            precoMensal: "17,90",
            total: "53,70",
            destaque: false,
        },
        {
            nome: "Semestral",
            periodo: "6 Meses",
            precoMensal: "11,90",
            total: "71,40",
            destaque: true,
        },
        {
            nome: "Anual",
            periodo: "1 Ano",
            precoMensal: "7,90",
            total: "94,80",
            destaque: false,
        }
    ];

    const handleAssinar = (plano) => {
        const mensagem = `Olá! Quero assinar o Plano ${plano.nome} (${plano.periodo}) do Treino Fit IA. Como faço para pagar o PIX de R$ ${plano.total}?`;
        const url = `https://wa.me/${MEU_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;

        // Abre o WhatsApp em uma nova aba
        window.open(url, '_blank');

        // Libera o chat para ele testar enquanto você confirma o pagamento
        aoEscolher(plano.nome);
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 text-white bg-gray-900 min-h-screen font-sans">
            <h2 className="text-3xl font-extrabold mb-2 text-center text-emerald-400">Turbine seu Shape com IA</h2>
            <p className="text-gray-400 mb-10 text-center max-w-md">Escolha o plano ideal e receba treinos e dietas personalizadas instantaneamente.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
                {planos.map((plano, index) => (
                    <div
                        key={index}
                        className={`relative p-8 rounded-3xl border-2 transition-all duration-300 ${plano.destaque
                            ? 'border-emerald-500 bg-gray-800 scale-105 shadow-[0_0_30px_rgba(16,185,129,0.2)] z-10'
                            : 'border-gray-700 bg-gray-850 hover:border-gray-500'
                            }`}
                    >
                        {plano.destaque && (
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider">
                                MAIS VANTAJOSO
                            </span>
                        )}

                        <h3 className="text-2xl font-bold mb-1">{plano.nome}</h3>
                        <p className="text-gray-400 mb-6">{plano.periodo}</p>

                        <div className="mb-2">
                            <span className="text-gray-400 text-lg">R$</span>
                            <span className="text-5xl font-black text-white ml-1">{plano.precoMensal}</span>
                            <span className="text-gray-400 text-sm">/mês</span>
                        </div>

                        <p className="text-xs text-gray-500 mb-8 font-medium">Pagamento único de R$ {plano.total}</p>

                        <ul className="text-sm space-y-4 mb-10 text-gray-300">
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-500">✔</span> Consultas Ilimitadas
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-500">✔</span> Histórico de Conversas
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-emerald-500">✔</span> IA de Alta Velocidade
                            </li>
                        </ul>

                        <button
                            onClick={() => handleAssinar(plano)}
                            className={`w-full py-4 rounded-2xl font-black text-lg transition-all transform active:scale-95 ${plano.destaque
                                ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg'
                                : 'bg-white hover:bg-gray-200 text-black'
                                }`}
                        >
                            ASSINAR AGORA
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={() => aoEscolher('Gratis')}
                className="mt-10 text-gray-500 text-sm hover:text-emerald-400 transition-colors"
            >
                Continuar com a versão gratuita (limitada)
            </button>
        </div>
    );
};

export default TelaPlanos;