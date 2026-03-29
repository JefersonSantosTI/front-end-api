import React from 'react';

const TelaPlanos = () => {
    const MEU_WHATSAPP = "5511939242518";

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
        const mensagem = `Olá! Quero o Plano ${plano.nome} do Treino Fit IA. Me mande o PIX para liberar meu código VIP! 🚀`;
        const url = `https://wa.me/${MEU_WHATSAPP}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="w-full text-center">
            <div className="mb-8">
                <h2 className="text-3xl font-black text-emerald-400 uppercase italic">Acesso VIP Ilimitado</h2>
                <p className="text-gray-400 text-sm mt-1">Escolha um plano para liberar Dieta, Treinos e Suporte 24h</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {planos.map((plano, index) => (
                    <div
                        key={index}
                        className={`relative p-6 rounded-3xl border-2 flex flex-col justify-between transition-all ${plano.destaque
                                ? 'border-emerald-500 bg-gray-800 shadow-[0_0_30px_rgba(16,185,129,0.1)]'
                                : 'border-gray-700 bg-gray-850 opacity-80 hover:opacity-100'
                            }`}
                    >
                        {plano.destaque && (
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-black text-[10px] font-black px-4 py-1 rounded-full uppercase">
                                Mais Vendido
                            </span>
                        )}

                        <div>
                            <h3 className="text-xl font-bold">{plano.nome}</h3>
                            <div className="my-4">
                                <span className="text-4xl font-black text-white">R$ {plano.precoMensal}</span>
                                <span className="text-gray-400 text-sm italic"> /mês</span>
                            </div>
                            <p className="text-[10px] text-gray-500 mb-6 uppercase tracking-widest">Pagamento único de R$ {plano.total}</p>
                        </div>

                        <ul className="text-left text-xs space-y-3 mb-8 text-gray-300">
                            <li>✅ IA desbloqueada sem limites</li>
                            <li>✅ Cardápio completo (Almoço/Jantar)</li>
                            <li>✅ Planilha de Treino personalizada</li>
                            <li>✅ Suporte VIP no WhatsApp</li>
                        </ul>

                        <button
                            onClick={() => handleAssinar(plano)}
                            className={`w-full py-4 rounded-xl font-black text-sm uppercase transition-all active:scale-95 ${plano.destaque
                                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                                    : 'bg-white text-black hover:bg-gray-200'
                                }`}
                        >
                            Assinar via PIX
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TelaPlanos;