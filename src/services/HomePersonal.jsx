import React, { useState } from 'react';
import { Users, Zap, LineChart, Smartphone, Share2, Dumbbell, ShieldCheck, ArrowRight, Activity, Utensils } from 'lucide-react';

export default function HomePersonal({ setEtapa }) {
    const [menuEntrarAberto, setMenuEntrarAberto] = useState(false);

    return (
        <div className="min-h-screen bg-[#07080b] text-neutral-200 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">

            {/* HEADER FLUTUANTE */}
            <header className="sticky top-0 z-[60] bg-[#07080b]/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center shadow-2xl">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        <Dumbbell size={20} className="text-white" />
                    </div>
                    <div className="text-xl md:text-2xl font-black italic text-white tracking-tight">
                        Treino Fit <span className="text-xs text-emerald-400 not-italic uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md ml-1">PRO</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button onClick={() => setEtapa("login_aluno")} className="text-neutral-400 hover:text-white font-bold text-xs md:text-sm transition-colors hidden md:block uppercase tracking-wider">
                        Portal do Aluno
                    </button>
                    <button onClick={() => setEtapa("login_personal")} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs md:text-sm rounded-xl px-6 py-2.5 shadow-[0_5px_20px_rgba(16,185,129,0.3)] transition-all uppercase tracking-wider active:scale-95 hidden md:flex items-center gap-2">
                        Acessar Painel <ArrowRight size={16} />
                    </button>

                    {/* Menu Mobile */}
                    <button className="md:hidden text-white p-2" onClick={() => setMenuEntrarAberto(!menuEntrarAberto)}>
                        <div className="w-6 h-0.5 bg-white mb-1.5 rounded-full"></div>
                        <div className="w-6 h-0.5 bg-white mb-1.5 rounded-full"></div>
                        <div className="w-4 h-0.5 bg-white rounded-full"></div>
                    </button>
                </div>

                {menuEntrarAberto && (
                    <div className="absolute right-4 top-20 w-56 bg-[#13141a] border border-neutral-800 rounded-2xl shadow-2xl z-[70] p-3 flex flex-col gap-2 md:hidden">
                        <button onClick={() => setEtapa("login_personal")} className="text-left px-4 py-3 text-sm font-black text-emerald-400 bg-emerald-500/10 rounded-xl transition-all uppercase">
                            Acessar Painel PRO
                        </button>
                        <button onClick={() => setEtapa("login_aluno")} className="text-left px-4 py-3 text-sm font-black text-neutral-300 hover:bg-neutral-800 rounded-xl transition-all uppercase">
                            Portal do Aluno
                        </button>
                    </div>
                )}
            </header>

            {/* HERO SECTION (O Impacto Inicial) */}
            <section className="relative pt-20 pb-32 px-6 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest mb-8">
                        <Zap size={14} /> Para Personal Trainers e Consultorias
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic leading-[1.1] tracking-tighter mb-8">
                        Escale sua Consultoria.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Multiplique seus Alunos.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
                        Esqueça planilhas confusas e mensagens perdidas no WhatsApp. A primeira plataforma de gestão com <strong className="text-white">Inteligência Artificial</strong> que monta treinos, calcula dobras, prescreve dietas e avisa quando seu aluno está prestes a desistir.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <button onClick={() => setEtapa("login_personal")} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black px-10 py-5 rounded-2xl uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.5)] active:scale-95 flex items-center justify-center gap-3">
                            <ShieldCheck size={20} /> Testar Gratuitamente
                        </button>
                    </div>
                </div>
            </section>

            {/* SEÇÃO 1: O CRM DO PERSONAL (Radar de Retenção) */}
            <section className="py-24 px-6 bg-[#0a0b0e] border-y border-white/5 relative">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 relative">
                        {/* Mockup do CRM */}
                        <div className="bg-[#13141a] border-2 border-neutral-800 rounded-3xl p-6 shadow-2xl relative z-10">
                            <div className="flex justify-between items-center border-b border-neutral-800 pb-4 mb-4">
                                <h3 className="text-sm font-black uppercase tracking-wider text-white">Resumo da Assessoria</h3>
                                <div className="flex gap-2">
                                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-[#0d0e12] p-4 rounded-xl border border-neutral-800"><p className="text-2xl font-black text-white">42</p><p className="text-[10px] uppercase font-bold text-neutral-500">Alunos Ativos</p></div>
                                <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20"><p className="text-2xl font-black text-red-500">3</p><p className="text-[10px] uppercase font-bold text-red-500/70">Em Risco (Sumiram)</p></div>
                            </div>
                            <div className="bg-[#0d0e12] rounded-xl p-4 border border-neutral-800">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-bold text-sm text-white">João Pedro</p>
                                    <span className="bg-red-500/20 text-red-500 text-[10px] font-black uppercase px-2 py-1 rounded">🔴 Sumiu (9 dias)</span>
                                </div>
                                <button className="w-full bg-[#25D366]/20 text-[#25D366] text-[10px] font-black uppercase py-2 rounded-lg border border-[#25D366]/30 flex items-center justify-center gap-2">
                                    Cobrar Presença no WhatsApp
                                </button>
                            </div>
                        </div>
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/20 blur-3xl rounded-full"></div>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-6">
                            <LineChart className="text-red-500" size={28} />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase italic text-white mb-6">Radar de Retenção.<br /><span className="text-neutral-500">Zere a evasão.</span></h2>
                        <p className="text-lg text-neutral-400 font-medium leading-relaxed mb-6">
                            Seu maior inimigo é o aluno que para de ir à academia e cancela a consultoria no fim do mês.
                        </p>
                        <ul className="space-y-4 text-sm font-bold text-neutral-300">
                            <li className="flex items-center gap-3"><CheckCircle size={20} className="text-emerald-500" /> Sistema acusa alunos há mais de 3 dias sem treino.</li>
                            <li className="flex items-center gap-3"><CheckCircle size={20} className="text-emerald-500" /> Botão de "Cobrar Presença" integrado ao WhatsApp.</li>
                            <li className="flex items-center gap-3"><CheckCircle size={20} className="text-emerald-500" /> Link exclusivo de Matrícula (O aluno preenche e cai no painel).</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* SEÇÃO 2: IA E PRESCRIÇÃO */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                            <Zap className="text-blue-400" size={28} />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase italic text-white mb-6">Prescrição Mágica.<br /><span className="text-blue-400">Deixe a IA trabalhar.</span></h2>
                        <p className="text-lg text-neutral-400 font-medium leading-relaxed mb-6">
                            Você não precisa mais passar horas montando fichas básicas ou calculando macros do zero. A Inteligência Artificial do Treino Fit PRO analisa a biometria e entrega a estrutura pronta para sua revisão.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="bg-[#13141a] p-4 rounded-2xl border border-neutral-800">
                                <Activity className="text-emerald-500 mb-2" size={24} />
                                <h4 className="font-black text-white text-sm uppercase">Cálculo de Dobras</h4>
                                <p className="text-xs text-neutral-500 mt-1 font-medium">Protocolo 7 Dobras automático.</p>
                            </div>
                            <div className="bg-[#13141a] p-4 rounded-2xl border border-neutral-800">
                                <Utensils className="text-orange-500 mb-2" size={24} />
                                <h4 className="font-black text-white text-sm uppercase">Base Alimentar</h4>
                                <p className="text-xs text-neutral-500 mt-1 font-medium">Cálculo de TMB e Macronutrientes.</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="bg-gradient-to-br from-[#13141a] to-[#0a0b0e] border-2 border-blue-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(59,130,246,0.15)] relative z-10">
                            <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-[10px] font-mono font-black uppercase tracking-widest mb-4">⚡ Ação da IA</span>
                            <div className="space-y-4">
                                <div className="bg-[#16171d] p-4 rounded-xl border border-neutral-800 flex justify-between items-center">
                                    <div><p className="text-[10px] uppercase text-neutral-500 font-bold">Meta de Hidratação Diária</p><p className="text-white font-black text-lg">3.5 Litros</p></div>
                                    <span className="text-2xl">💧</span>
                                </div>
                                <div className="bg-[#16171d] p-4 rounded-xl border border-neutral-800 flex flex-col gap-2">
                                    <p className="text-[10px] uppercase text-neutral-500 font-bold">Treino de Segunda</p>
                                    <div className="flex justify-between items-center bg-[#0d0e12] p-3 rounded-lg"><p className="text-sm font-black text-white">Agachamento Livre</p><p className="text-xs font-mono text-emerald-400">4x 12 Reps</p></div>
                                    <div className="flex justify-between items-center bg-[#0d0e12] p-3 rounded-lg"><p className="text-sm font-black text-white">Leg Press 45º</p><p className="text-xs font-mono text-emerald-400">4x 10 Reps</p></div>
                                </div>
                            </div>
                            <button className="w-full mt-6 bg-blue-600 text-white font-black text-xs uppercase py-4 rounded-xl shadow-lg">✓ Salvar e Enviar para Aluno</button>
                        </div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* SEÇÃO 3: O APP DO ALUNO & HORTILIFE */}
            <section className="py-24 px-6 bg-[#0a0b0e] border-y border-white/5">
                <div className="max-w-6xl mx-auto text-center mb-16">
                    <Smartphone className="text-emerald-400 mx-auto mb-4" size={40} />
                    <h2 className="text-3xl md:text-5xl font-black uppercase italic text-white">A Experiência Premium.<br /><span className="text-neutral-500">Tudo na palma da mão.</span></h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Feature 1 */}
                    <div className="bg-[#13141a] border border-neutral-800 p-8 rounded-3xl text-center group hover:border-emerald-500/50 transition-colors">
                        <div className="text-4xl mb-4 bg-[#0d0e12] w-20 h-20 mx-auto rounded-full flex items-center justify-center border border-neutral-800 group-hover:scale-110 transition-transform">🏋️‍♀️</div>
                        <h3 className="text-lg font-black text-white uppercase mb-3">Execução Perfeita</h3>
                        <p className="text-sm text-neutral-400 font-medium leading-relaxed">Cada exercício prescrito possui um botão "Ver GIF" embutido. Seu aluno nunca mais vai fazer o movimento errado ou te chamar de madrugada com dúvidas.</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-[#13141a] border border-neutral-800 p-8 rounded-3xl text-center group hover:border-blue-500/50 transition-colors relative overflow-hidden">
                        <div className="text-4xl mb-4 bg-[#0d0e12] w-20 h-20 mx-auto rounded-full flex items-center justify-center border border-neutral-800 group-hover:scale-110 transition-transform">🍽️</div>
                        <h3 className="text-lg font-black text-white uppercase mb-3">Dieta + Delivery</h3>
                        <p className="text-sm text-neutral-400 font-medium leading-relaxed mb-6">Além de ver os macros e refeições divididas por horário, nós integramos a plataforma à <strong className="text-blue-400">Hortilife</strong>. Ele clica e pede a dieta no mercado.</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-[#13141a] border border-neutral-800 p-8 rounded-3xl text-center group hover:border-orange-500/50 transition-colors">
                        <div className="text-4xl mb-4 bg-[#0d0e12] w-20 h-20 mx-auto rounded-full flex items-center justify-center border border-neutral-800 group-hover:scale-110 transition-transform">📋</div>
                        <h3 className="text-lg font-black text-white uppercase mb-3">Check-in de Esforço (RPE)</h3>
                        <p className="text-sm text-neutral-400 font-medium leading-relaxed">Ao fim do treino, o aluno registra a carga usada e responde como foi o esforço (🟢 Fácil, 🟡 Ideal, 🔴 Difícil). Você sabe exatamente quando subir o peso.</p>
                    </div>
                </div>
            </section>

            {/* SEÇÃO 4: MARKETING VIRAL (Insta Share) */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="max-w-5xl mx-auto bg-gradient-to-br from-emerald-900/40 to-[#0a0b0e] border-2 border-emerald-500/30 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-[0_20px_60px_rgba(16,185,129,0.15)] relative">
                    <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                    <div className="flex-1 z-10 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-500/30">
                            <Share2 size={12} /> Máquina de Vendas
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase italic text-white mb-6">Transforme Alunos em<br />Outdoors Ambulantes.</h2>
                        <p className="text-lg text-neutral-300 font-medium leading-relaxed mb-8">
                            Toda vez que seu aluno finaliza um treino, o app gera um <strong className="text-white">Card Exclusivo de "Tá Pago"</strong> com a sua assinatura (O Nome do Treinador).
                            Ele compartilha nos Stories do Instagram, e os amigos dele vêm procurar você.
                        </p>
                        <button onClick={() => setEtapa("login_personal")} className="bg-white text-[#07080b] hover:bg-neutral-200 font-black px-8 py-4 rounded-xl uppercase tracking-widest transition-all shadow-xl active:scale-95 text-sm">
                            Testar a Plataforma
                        </button>
                    </div>

                    {/* MOCKUP DO INSTAGRAM */}
                    <div className="w-[280px] bg-[#0d0e12] border-4 border-neutral-800 rounded-[2.5rem] p-4 shadow-2xl relative z-10 rotate-3 hover:rotate-0 transition-transform duration-500">
                        <div className="w-full aspect-[9/16] bg-gradient-to-b from-emerald-900/80 to-[#13141a] rounded-[1.5rem] border border-emerald-500/50 flex flex-col items-center justify-between p-6 relative overflow-hidden">
                            <div className="text-center w-full mt-4">
                                <p className="text-[9px] font-mono font-black text-emerald-400 uppercase tracking-widest mb-2 bg-[#0d0e12]/80 px-2 py-1 rounded-lg border border-emerald-500/30 inline-block">Treino Fit App</p>
                                <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter drop-shadow-lg">TREINO<br />PAGO!</h3>
                            </div>
                            <div className="w-full space-y-3">
                                <div className="bg-[#0a0b0e]/80 backdrop-blur-sm border border-white/10 p-3 rounded-xl text-center">
                                    <p className="text-[9px] uppercase text-neutral-400 font-black mb-0.5">Foco</p>
                                    <p className="text-sm font-black text-white uppercase">Membros Inferiores</p>
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1 bg-[#0a0b0e]/80 backdrop-blur-sm border border-emerald-500/30 p-3 rounded-xl text-center">
                                        <p className="text-[9px] uppercase text-neutral-400 font-black mb-0.5">Intensidade</p>
                                        <p className="text-sm font-black text-emerald-400 uppercase">Extremo</p>
                                    </div>
                                    <div className="flex-1 bg-[#0a0b0e]/80 backdrop-blur-sm border border-blue-500/30 p-3 rounded-xl text-center">
                                        <p className="text-[9px] uppercase text-neutral-400 font-black mb-0.5">Carga</p>
                                        <p className="text-sm font-black text-blue-400 uppercase">Pesado</p>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full text-center mt-2">
                                <p className="text-[9px] uppercase font-black text-neutral-400 tracking-widest mb-1">Treinador</p>
                                <p className="text-sm font-black text-white bg-white/10 rounded-full py-1">Seu Nome Aqui</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="text-center py-12 bg-[#07080b] border-t border-neutral-900">
                <div className="flex justify-center items-center gap-2 mb-6">
                    <Dumbbell size={24} className="text-emerald-500" />
                    <span className="text-xl font-black italic text-white tracking-tight">Treino Fit <span className="text-emerald-400">PRO</span></span>
                </div>
                <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest">
                    &copy; 2026 Treino Fit. Todos os direitos reservados.
                </p>
            </footer>
        </div>
    );
}

// Pequeno componente de CheckCircle para os tópicos
function CheckCircle({ size, className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    );
}