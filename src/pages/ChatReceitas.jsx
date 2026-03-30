import { useState, useEffect, useRef } from "react"
import ListaMessagens from "../components/ListaMessagens"
import ChatBox from "../components/ChatBox"
import { api } from "../services/api"

const ChatReceitas = ({ whatsapp, isVip, aoPedirUpgrade }) => {
    const [loading, setLoading] = useState(false)
    const [mensagens, setMensagens] = useState([])
    const [mostrarBotãoUpgrade, setMostrarBotãoUpgrade] = useState(false)

    const scrollRef = useRef(null);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    // --- FUNÇÃO PARA ATUALIZAR O DASHBOARD AUTOMATICAMENTE ---
    const extrairEGuardarDados = (texto) => {
        const txt = texto.toLowerCase();

        // 1. Tentar capturar Nome (Ex: "Obrigado, Marina!" ou "Perfeito, Marina!")
        const regexNome = /(?:obrigado|perfeito|olá|bem-vinda|fala|oi),?\s+([a-zA-Záàâãéèêíïóôõöúçñ]+)/i;
        const matchNome = texto.match(regexNome);
        if (matchNome && matchNome[1]) {
            localStorage.setItem("perfil_nome", matchNome[1]);
        }

        // 2. Tentar capturar Peso (Ex: "Peso: 70kg" ou "seu peso é 70")
        const regexPeso = /(?:peso:?|pesando)\s*(\d+)/i;
        const matchPeso = txt.match(regexPeso);
        if (matchPeso) localStorage.setItem("perfil_peso", matchPeso[1]);

        // 3. Tentar capturar Altura (Ex: "Altura: 1.76" ou "1,76m")
        const regexAltura = /(?:altura:?)\s*(\d[.,]\d{2})/i;
        const matchAltura = txt.match(regexAltura);
        if (matchAltura) localStorage.setItem("perfil_altura", matchAltura[1].replace(',', '.'));

        // 4. Tentar capturar Meta (Ex: "Meta: Secar" ou "foco em emagrecimento")
        if (txt.includes("emagrecer") || txt.includes("secar") || txt.includes("perder peso")) {
            localStorage.setItem("perfil_meta", "Secar");
        } else if (txt.includes("hipertrofia") || txt.includes("ganhar massa")) {
            localStorage.setItem("perfil_meta", "Ganhar");
        }

        // 5. Cálculo Dinâmico de "Quanto falta" (Simulação simples baseada no IMC)
        if (txt.includes("imc")) {
            // Se a IA calculou o IMC, podemos assumir que ela deu um norte
            // Aqui você pode definir uma lógica ou apenas salvar um valor fixo de progresso
            localStorage.setItem("perfil_faltam", "7.5");
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [mensagens, loading, mostrarBotãoUpgrade]);

    const carregarHistorico = async () => {
        if (!whatsapp) return;
        setLoading(true);

        try {
            const response = await api.get(`/receitas/historico/${whatsapp}`);
            const dados = Array.isArray(response.data) ? response.data : [];

            let detectouBloqueioNoHistorico = false;

            const historicoFormatado = dados.map((msg, index) => {
                let texto = msg.content || "";

                // Sempre que carregar o histórico, tenta atualizar o dashboard com a última info
                if (msg.role === "assistant") extrairEGuardarDados(texto);

                if (isVip) {
                    texto = texto.replace(/\[CONTEÚDO BLOQUEADO\]/g, "✅ (Liberado)");
                    texto = texto.replace(/Para ver o resto do seu plano, clique no BOTÃO LARANJA.*/gi, "Aproveite sua dieta completa abaixo! 💪");
                }

                if (!isVip && texto.toUpperCase().includes("BLOQUEADO")) {
                    detectouBloqueioNoHistorico = true;
                }

                return {
                    id: index,
                    texto: texto,
                    remetente: msg.role === "assistant" ? "bot" : "usuario"
                };
            });

            setMostrarBotãoUpgrade(detectouBloqueioNoHistorico);
            setMensagens(historicoFormatado);

            if (isVip && detectouBloqueioNoHistorico) {
                onEnviarMensagem("Obrigado! Agora mande minha dieta completa sem bloqueios por favor.");
            }

        } catch (error) {
            console.error("Erro ao carregar histórico:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarHistorico();
    }, [whatsapp, isVip]);

    const onEnviarMensagem = async (textoDigitado) => {
        if (!textoDigitado.trim()) return;

        const novaMensagemUsuario = {
            id: Date.now(),
            texto: textoDigitado,
            remetente: "usuario"
        };

        setMensagens((prev) => [...prev, novaMensagemUsuario]);
        setLoading(true);

        try {
            const response = await api.post("/receitas/perguntar", {
                whatsapp: whatsapp,
                mensagemAtual: textoDigitado
            });

            const respostaTexto = response.data.resposta || "";

            // ATUALIZA OS DADOS NO STORAGE ASSIM QUE O BOT RESPONDE
            extrairEGuardarDados(respostaTexto);

            const temTextoDeBloqueio = respostaTexto.toUpperCase().includes("BLOQUEADO");

            if (!isVip && temTextoDeBloqueio) {
                setMostrarBotãoUpgrade(true);
            } else {
                setMostrarBotãoUpgrade(false);
            }

            const novaMensagemBot = {
                id: Date.now() + 1,
                texto: respostaTexto,
                remetente: "bot"
            };

            setMensagens((prev) => [...prev, novaMensagemBot]);

        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            setMensagens((prev) => [...prev, {
                id: Date.now() + 2,
                texto: "Ops! Tente novamente em instantes. 😢",
                remetente: "bot"
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full font-sans overflow-hidden bg-slate-900">
            {/* Removi o Header fixo interno pois agora o App.jsx já prove um header superior melhor */}

            <main className="flex-1 overflow-hidden bg-slate-100 flex flex-col relative">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                <div className="flex-1 overflow-y-auto p-4 z-10 custom-scrollbar">
                    <div className="max-w-4xl mx-auto w-full">
                        <ListaMessagens mensagens={mensagens} loading={loading} />

                        {mostrarBotãoUpgrade && !isVip && (
                            <div className="w-full mt-6 mb-12 animate-bounce-slow transition-all">
                                <button
                                    onClick={aoPedirUpgrade}
                                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-black py-5 rounded-2xl shadow-[0_10px_25px_rgba(234,88,12,0.4)] border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all uppercase text-sm sm:text-base px-2"
                                >
                                    🔓 LIBERAR DIETA COMPLETA AGORA
                                </button>
                                <p className="text-center text-slate-500 text-[11px] mt-3 font-black uppercase tracking-widest">
                                    Acesso imediato ao almoço e jantar
                                </p>
                            </div>
                        )}
                        <div ref={scrollRef} className="h-4" />
                    </div>
                </div>
            </main>

            <footer className="bg-white p-3 sm:p-4 border-t border-slate-200 flex-none z-30 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                <div className="max-w-4xl mx-auto">
                    <ChatBox
                        onEnviarMensagem={onEnviarMensagem}
                        desabilitado={loading || (mostrarBotãoUpgrade && !isVip)}
                    />
                    {mostrarBotãoUpgrade && !isVip && (
                        <p className="text-center text-red-500 text-[10px] font-black uppercase mt-2 tracking-widest animate-pulse">
                            ⚠️ Digitação bloqueada! Clique no botão laranja para continuar.
                        </p>
                    )}
                </div>
            </footer>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
                input, textarea { font-size: 16px !important; }
                @keyframes bounceSlow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .animate-bounce-slow { animation: bounceSlow 2s infinite ease-in-out; }
            `}} />
        </div>
    );
};

export default ChatReceitas;