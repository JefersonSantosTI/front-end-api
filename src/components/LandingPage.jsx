import React from 'react';

const LandingPage = ({ aoComeçar, aoLogar }) => {
    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-emerald-500">

            {/* --- NAV BAR (MENU SUPERIOR) --- */}
            <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center justify-between">

                {/* Menu Lateral Esquerdo (Hambúrguer ou Texto) */}
                <div className="flex items-center space-x-6">
                    <button className="text-emerald-500 hover:text-emerald-400 transition">
                        <span className="text-2xl">☰</span>
                    </button>
                    <div className="hidden md:flex space-x-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                        <a href="#" className="hover:text-white transition">Nutricionistas</a>
                        <a href="#" className="hover:text-white transition">Treinos IA</a>
                        <a href="#" className="hover:text-white transition">Conteúdo</a>
                    </div>
                </div>

                {/* Logo Central/Direita */}
                <div className="flex items-center">
                    <img src="/logo192.png" alt="Treino Fit" className="h-10 md:h-12 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="ml-2 font-black text-xl tracking-tighter italic">TREINO<span className="text-emerald-500">FIT</span></span>
                </div>
            </nav>

            {/* --- HERO SECTION (CORPO DA PÁGINA) --- */}
            <main className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center">

                {/* Badge de Destaque */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                    Tecnologia Smart IA 2026
                </div>

                <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight uppercase tracking-tighter">
                    CONHEÇA NOSSOS <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">SERVIÇOS</span>
                </h1>

                <p className="max-w-xl text-gray-400 text-lg mb-12">
                    A primeira Inteligência Artificial que monta seu treino e dieta em tempo real, baseada no seu metabolismo e rotina.
                </p>

                {/* --- BOTÕES DE AÇÃO (O QUE VOCÊ PEDIU) --- */}
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 w-full max-w-md">

                    {/* Botão de Teste Grátis (Principal) */}
                    <button
                        onClick={aoComeçar}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-5 rounded-2xl text-lg transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] active:scale-95 uppercase"
                    >
                        COMEÇAR AGORA! <span className="text-sm ml-2">🚀</span>
                    </button>

                    {/* Botão de Login (Secundário) */}
                    <button
                        onClick={aoLogar}
                        className="w-full bg-transparent border-2 border-gray-700 hover:border-emerald-500 hover:text-emerald-500 text-white font-bold py-5 rounded-2xl transition-all active:scale-95 uppercase text-sm"
                    >
                        Já sou Aluno
                    </button>
                </div>

                {/* --- GRID DE SERVIÇOS (ESTILO SMART FIT) --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 w-full max-w-6xl">
                    <div className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800 hover:border-emerald-500/50 transition">
                        <span className="text-4xl mb-4 block">🥗</span>
                        <h3 className="font-bold text-sm uppercase">Nutricionista IA</h3>
                    </div>
                    <div className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800 hover:border-emerald-500/50 transition">
                        <span className="text-4xl mb-4 block">📏</span>
                        <h3 className="font-bold text-sm uppercase">Bioimpedância</h3>
                    </div>
                    <div className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800 hover:border-emerald-500/50 transition">
                        <span className="text-4xl mb-4 block">🏋️‍♂️</span>
                        <h3 className="font-bold text-sm uppercase">Treino Personal</h3>
                    </div>
                    <div className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800 hover:border-emerald-500/50 transition">
                        <span className="text-4xl mb-4 block">📱</span>
                        <h3 className="font-bold text-sm uppercase">App Web Fit</h3>
                    </div>
                </div>

            </main>

            {/* Rodapé Simples */}
            <footer className="py-10 border-t border-gray-900 text-center text-gray-600 text-[10px] uppercase tracking-widest">
                © 2026 Treino Fit Inteligência Artificial. Todos os direitos reservados.
            </footer>
        </div>
    );
};

export default LandingPage;