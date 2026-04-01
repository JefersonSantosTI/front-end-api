import { useState, useEffect, useRef } from "react";
import ListaMessagens from "../components/ListaMessagens";
import ChatBox from "../components/ChatBox";
import { api } from "../services/api";

const ChatReceitas = ({ whatsapp, isVip, aoPedirUpgrade, aoAtualizarPerfil }) => {
    const [loading, setLoading] = useState(false);
    const [mensagens, setMensagens] = useState([]);
    const [mostrarBotãoUpgrade, setMostrarBotãoUpgrade] = useState(false);
    const scrollRef = useRef(null);

    // Defina aqui o limite de interações para usuários FREE
    const LIMITE_FREE = 10;

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const extrairEGuardarDados = (texto) => {
        const txt = texto.toLowerCase();
        let mudou = false;

        const regexNome = /(?:obrigado|perfeito|olá|oi|entendi|certo|ótimo|bom dia|boa noite),?\s+([a-zA-Záàâãéèêíïóôõöúçñ]{3,})/i;
        const matchNome = texto.match(regexNome);
        if (matchNome?.[1]) {
            localStorage.setItem("perfil_nome", matchNome[1]);
            mudou = true;
        }

        const regexPeso = /(\d{2,3}[.,]?\d*)\s*(?:kg|quilos|kilos|peso)/i;
        const matchPeso = txt.match(regexPeso);
        if (matchPeso) {
            const pesoLimpo = matchPeso[1].replace(',', '.');
            const pesoNum = parseFloat(pesoLimpo);
            localStorage.setItem("perfil_peso", pesoLimpo);
            if (!localStorage.getItem("perfil_faltam")) {
                localStorage.setItem("perfil_faltam", (pesoNum * 0.1).toFixed(1));
            }
            mudou = true;
        }

        const regexAltura = /(\d[.,]\d{2})/;
        const matchAltura = txt.match(regexAltura);
        if (matchAltura) {
            localStorage.setItem("perfil_altura", matchAltura[1].replace(',', '.'));
            mudou = true;
        }

        if (mudou && typeof aoAtualizarPerfil === "function") {
            aoAtualizarPerfil();
        }
    };

    useEffect(() => {
        const timer = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(timer);
    }, [mensagens, loading, mostrarBotãoUpgrade]);

    const carregarHistorico = async () => {
        if (!whatsapp) return;
        setLoading(true);

        try {
            const response = await api.get(`/receitas/historico/${whatsapp}`);
            const dados = Array.isArray(response.data) ? response.data : [];

            // Conta quantas mensagens o usuário já enviou
            const totalMsgUsuario = dados.filter(m => m.role === "user").length;
            let detectouBloqueioManual = !isVip && totalMsgUsuario >= LIMITE_FREE;
            let detectouBloqueioIA = false;

            const historicoFormatado = dados.map((msg, index) => {
                let texto = msg.content || "";
                if (msg.role === "assistant") extrairEGuardarDados(texto);

                if (isVip) {
                    texto = texto.replace(/\[CONTEÚDO BLOQUEADO\]/g, "✅ (Liberado)")
                        .replace(/Para visualizar o restante.*/gi, "Plano VIP Ativado! 💪")
                        .replace(/clique no BOTÃO LARANJA.*/gi, "Acesso ilimitado.");
                } else if (texto.toUpperCase().includes("BLOQUEADO")) {
                    detectouBloqueioIA = true;
                }

                return {
                    id: index,
                    texto,
                    remetente: msg.role === "assistant" ? "bot" : "usuario"
                };
            });

            setMostrarBotãoUpgrade(detectouBloqueioManual || detectouBloqueioIA);
            setMensagens(historicoFormatado);
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

        // VERIFICAÇÃO DE LIMITE ANTES DE ENVIAR
        const msgsEnviadas = mensagens.filter(m => m.remetente === "usuario").length;
        if (!isVip && msgsEnviadas >= LIMITE_FREE) {
            setMostrarBotãoUpgrade(true);
            return;
        }

        const novaMsgUser = { id: Date.now(), texto: textoDigitado, remetente: "usuario" };
        setMensagens(prev => [...prev, novaMsgUser]);
        setLoading(true);

        try {
            const perfilExtraido = {
                nome: localStorage.getItem("perfil_nome"),
                peso: localStorage.getItem("perfil_peso"),
                altura: localStorage.getItem("perfil_altura")
            };

            const response = await api.post("/receitas/perguntar", {
                whatsapp,
                mensagemAtual: textoDigitado,
                perfilExtraido
            });

            const respostaTexto = response.data.resposta || "";
            extrairEGuardarDados(respostaTexto);

            // Bloqueia se a IA mandou a palavra ou se atingiu o limite agora
            const atingiuLimiteAgora = !isVip && (msgsEnviadas + 1) >= LIMITE_FREE;
            const iaBloqueou = respostaTexto.toUpperCase().includes("BLOQUEADO");

            if (iaBloqueou || atingiuLimiteAgora) {
                setMostrarBotãoUpgrade(true);
            }

            setMensagens(prev => [...prev, {
                id: Date.now() + 1,
                texto: isVip ? respostaTexto.replace(/\[CONTEÚDO BLOQUEADO\]/g, "").replace(/Para visualizar o restante.*/gi, "") : respostaTexto,
                remetente: "bot"
            }]);
        } catch (error) {
            console.error("Erro ao enviar:", error);
            setMensagens(prev => [...prev, { id: Date.now() + 2, texto: "Ops! Tente novamente. 😢", remetente: "bot" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full font-sans bg-gray-950 text-white">
            <main className="flex-1 relative overflow-hidden bg-gray-950">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                <div className="absolute inset-0 overflow-y-auto px-4 py-4 z-10 custom-scrollbar">
                    <div className="max-w-2xl mx-auto w-full pb-10">
                        <ListaMessagens mensagens={mensagens} loading={loading} />

                        {mostrarBotãoUpgrade && !isVip && (
                            <div className="w-full mt-8 mb-12 flex flex-col items-center animate-bounce-slow">
                                {/* BOTÃO LARANJA DE UPGRADE */}
                                <button
                                    onClick={aoPedirUpgrade}
                                    className="w-full max-w-xs bg-orange-500 text-white font-black py-5 rounded-[2rem] shadow-[0_10px_20px_rgba(249,115,22,0.4)] hover:scale-[1.05] transition-all uppercase text-sm flex items-center justify-center gap-2"
                                >
                                    🚀 Liberar Acesso VIP Agora
                                </button>
                                <p className="text-[10px] text-orange-400 mt-4 font-black uppercase tracking-widest bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/20">
                                    Limite de mensagens free atingido
                                </p>
                            </div>
                        )}

                        <div ref={scrollRef} className="h-4 w-full" />
                    </div>
                </div>
            </main>

            <footer className="bg-gray-950 px-4 pb-6 pt-2 z-30">
                <div className="max-w-2xl mx-auto">
                    <ChatBox
                        onEnviarMensagem={onEnviarMensagem}
                        desabilitado={loading || (mostrarBotãoUpgrade && !isVip)}
                    />
                    {mostrarBotãoUpgrade && !isVip && (
                        <p className="text-center text-orange-500/80 text-[9px] font-black uppercase mt-3 tracking-tighter animate-pulse">
                            🔒 Chat bloqueado. Assine o plano VIP para continuar.
                        </p>
                    )}
                </div>
            </footer>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #10b981; }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-slow { animation: bounce-slow 2s infinite; }
            `}} />
        </div>
    );
};

export default ChatReceitas;