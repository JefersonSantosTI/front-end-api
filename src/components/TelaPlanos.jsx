import React from 'react';

const TelaPlanos = ({ aoEscolher }) => {
    const planos = [
        {
            nome: "Trimestral",
            periodo: "3 Meses",
            precoMensal: "17,90",
            total: "53,70",
            destaque: false,
            botao: "Começar Agora"
        },
        {
            nome: "Semestral",
            periodo: "6 Meses",
            precoMensal: "11,90",
            total: "71,40",
            destaque: true,
            botao: "Melhor Custo-Benefício"
        },
        {
            nome: "Anual",
            periodo: "1 Ano",
            precoMensal: "7,90",
            total: "94,80",
            destaque: false,
            botao: "Foco Total"
        }
    ];

    return (
        <div className="flex flex-col items-center justify-center p-6 text-white bg-gray-900 min-h-screen">
            <h2 className="text-3xl font-bold mb-2 text-center">Escolha seu Plano de Evolução</h2>
            <p className="text-gray-400 mb-8 text-center">IA focada 100% no seu resultado físico.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
                {planos.map((plano, index) => (
                    <div
                        key={index}
                        className={`relative p-6 rounded-2xl border-2 flex flex-col ${plano.destaque
                                ? 'border-emerald-500 bg-gray-800 scale-105 shadow-2xl z-10'
                                : 'border-gray-700 bg-gray-850 opacity-90'
                            }`}
                    >
                        {plano.destaque && (
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase">
                                Mais Vendido
                            </span>
                        )}

                        <h3 className="text-xl font-semibold mb-1">{plano.nome}</h3>
                        <p className="text-sm text-gray-400 mb-4">{plano.periodo}</p>

                        <div className="mb-4">
                            <span className="text-4xl font-bold">R$ {plano.precoMensal}</span>
                            <span className="text-gray-400 text-sm">/mês</span>
                        </div>

                        <p className="text-xs text-gray-500 mb-6 font-mono">Total à vista: R$ {plano.total}</p>

                        <ul className="text-sm space-y-3 mb-8 flex-grow">
                            <li className="flex items-center">✅ Consultas Ilimitadas</li>
                            <li className="flex items-center">✅ Treinos Personalizados</li>
                            <li className="flex items-center">✅ Cardápios Inteligentes</li>
                        </ul>

                        <button
                            onClick={() => aoEscolher(plano.nome)}
                            className={`w-full py-3 rounded-xl font-bold transition-all ${plano.destaque
                                    ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                                }`}
                        >
                            {plano.botao}
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={() => aoEscolher('Gratis')}
                className="mt-8 text-gray-500 text-sm hover:underline"
            >
                Quero testar a versão gratuita (limitada)
            </button>
        </div>
    );
};

export default TelaPlanos;