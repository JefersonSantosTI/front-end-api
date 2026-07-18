import React from 'react';
import { Bot, Apple, MessageCircle, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HomeUsuario() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">

            {/* 1. HERO SECTION (O topo de impacto) */}
            <header className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-20 px-6 text-center rounded-b-[3rem] shadow-xl">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-700/50 text-emerald-400 text-sm font-semibold mb-6">
                        <Zap size={16} />
                        <span>Treinos e Dietas com Inteligência Artificial</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        Atingir sua melhor forma <br className="hidden md:block" /> nunca foi tão inteligente.
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                        Nossa Inteligência Artificial analisa seu perfil e cria uma rotina de treinos e uma base alimentar 100% personalizadas para você alcançar seus resultados em tempo recorde.
                    </p>
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-lg py-4 px-10 rounded-full shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 mx-auto w-full md:w-auto"
                    >
                        Começar Minha Transformação
                        <ArrowRight size={20} />
                    </button>
                </div>
            </header>

            {/* 2. PROVA SOCIAL (Antes e Depois) */}
            <section className="py-20 px-6 max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Eles testaram e comprovaram</h2>
                    <p className="text-slate-600 text-lg">Resultados reais de quem seguiu o plano da nossa IA.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100">
                        <div className="flex gap-2 mb-4 h-48">
                            <div className="w-1/2 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm font-bold">FOTO ANTES</div>
                            <div className="w-1/2 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm font-bold">FOTO DEPOIS</div>
                        </div>
                        <h3 className="font-bold text-xl mb-1">Lucas M.</h3>
                        <p className="text-sm text-emerald-600 font-semibold mb-3">-8kg em 45 dias</p>
                        <p className="text-slate-600 text-sm">"A base alimentar gerada pela IA foi o que mudou meu jogo. Nunca foi tão fácil seguir a dieta."</p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100">
                        <div className="flex gap-2 mb-4 h-48">
                            <div className="w-1/2 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm font-bold">FOTO ANTES</div>
                            <div className="w-1/2 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm font-bold">FOTO DEPOIS</div>
                        </div>
                        <h3 className="font-bold text-xl mb-1">Mariana S.</h3>
                        <p className="text-sm text-emerald-600 font-semibold mb-3">Hipertrofia Acelerada</p>
                        <p className="text-slate-600 text-sm">"Eu estava estagnada. O treino gerado pelo Treino Fit me tirou do platô na segunda semana."</p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100">
                        <div className="flex gap-2 mb-4 h-48">
                            <div className="w-1/2 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm font-bold">FOTO ANTES</div>
                            <div className="w-1/2 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-sm font-bold">FOTO DEPOIS</div>
                        </div>
                        <h3 className="font-bold text-xl mb-1">Rafael T.</h3>
                        <p className="text-sm text-emerald-600 font-semibold mb-3">Rotina Adaptada</p>
                        <p className="text-slate-600 text-sm">"Treino em casa com pouco equipamento. A IA adaptou meus exercícios perfeitamente!"</p>
                    </div>
                </div>
            </section>

            {/* 3. RECURSOS DA IA (O que o app faz) */}
            <section className="bg-slate-900 text-white py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Tudo que você precisa em um só lugar</h2>

                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="text-center flex flex-col items-center">
                            <div className="bg-blue-500/20 p-6 rounded-full text-blue-400 mb-6">
                                <Bot size={48} />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Treinos com IA</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Esqueça treinos genéricos. Receba fichas estruturadas de acordo com seu objetivo, biotipo e disponibilidade de tempo.
                            </p>
                        </div>

                        <div className="text-center flex flex-col items-center">
                            <div className="bg-emerald-500/20 p-6 rounded-full text-emerald-400 mb-6">
                                <Apple size={48} />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Base Alimentar</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Nossa IA calcula seus macronutrientes ideais e sugere opções de refeições diárias estritamente focadas na sua meta.
                            </p>
                        </div>

                        <div className="text-center flex flex-col items-center">
                            <div className="bg-purple-500/20 p-6 rounded-full text-purple-400 mb-6">
                                <MessageCircle size={48} />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Chat Tira-Dúvidas</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Surgiu alguma dúvida no meio do exercício? Nosso assistente virtual está disponível 24h para te orientar.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. FOOTER E CHAMADA FINAL */}
            <section className="py-20 px-6 text-center">
                <h2 className="text-3xl font-bold mb-8">Pronto para dar o primeiro passo?</h2>
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <CheckCircle2 className="text-emerald-500" size={24} /> Sem planilhas confusas
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <CheckCircle2 className="text-emerald-500" size={24} /> Acesso imediato
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                        <CheckCircle2 className="text-emerald-500" size={24} /> Cancele quando quiser
                    </div>
                </div>
                <button
                    onClick={() => window.location.href = '/login'}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg py-4 px-12 rounded-full shadow-xl transition-all"
                >
                    Criar Minha Conta Agora
                </button>
            </section>

            <footer className="border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
                <p>© 2026 Treino Fit. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}