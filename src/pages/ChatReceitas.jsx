import { useState, useEffect, useRef } from "react";
import ListaMessagens from "../components/ListaMessagens";
import ChatBox from "../components/ChatBox";
import { api } from "../services/api";

const ChatReceitas = ({ whatsapp, isVip, aoPedirUpgrade, aoAtualizarPerfil }) => {
    const [loading, setLoading] = useState(false);
    const [mensagens, setMensagens] = useState([]);
    const [mostrarBotãoUpgrade, setMostrarBotãoUpgrade] = useState(false);
    const scrollRef = useRef(null);

    // Rola o chat para o fim
    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Extrai dados da resposta da IA para atualizar o perfil local
    const extrairEGuardarDados = (texto) => {
        const txt = texto.toLowerCase();
        let mudou = false;

        // 1. Nome
        const regexNome = /(?:obrigado|perfeito|olá|oi|entendi|certo|ótimo|bom dia|boa noite),?\s+([a-zA-Záàâãéèêíïóôõöúçñ]{3,})/i;
        const matchNome = texto.match(regexNome);
        if (matchNome?.[1]) {
            localStorage.setItem("perfil_nome", matchNome[1]);
            mudou = true;
        }

        // 2. Peso e Meta (Correção do weightNum realizada aqui)
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

        // 3. Altura
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

    // Efeito para controlar o scroll automático
    useEffect(() => {
        const timer = setTimeout(scrollToBottom, 100);
        return () => clearTimeout(timer);
    }, [mensagens, loading, mostrarBotãoUpgrade]);

    // Carrega o histórico de mensagens do banco de dados
    const carregarHistorico = async () => {
        if (!whatsapp) return;
        setLoading(true);

        try {
            const response = await api.get(`/receitas/historico/${whatsapp}`);
            const dados = Array.isArray(response.data) ? response.data : [];
            let detectouBloqueio = false;

            const historicoFormatado = dados.map((msg, index) => {
                let texto = msg.content || "";

                if (msg.role === "assistant") extrairEGuardarDados(texto);

                if (isVip) {
                    texto = texto.replace(/\[CONTEÚDO BLOQUEADO\]/g, "✅ (Liberado)")
                        .replace(/Para visualizar o restante.*/gi, "Plano VIP Ativado! 💪")
                        .replace(/clique no BOTÃO LARANJA.*/gi, "Acesso ilimitado.");
                } else if (texto.toUpperCase().includes("BLOQUEADO")) {
                    detectouBloqueio = true;
                }

                return {
                    id: index,
                    texto,
                    remetente: msg.role === "assistant" ? "bot" : "usuario"
                };
            });

            setMostrarBotãoUpgrade(!isVip && detectouBloqueio);
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

    // Envia nova mensagem e sincroniza perfil com o backend
    const onEnviarMensagem = async (textoDigitado) => {
        if (!textoDigitado.trim()) return;

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

            setMostrarBotãoUpgrade(!isVip && respostaTexto.toUpperCase().includes("BLOQUEADO"));

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
        <div className="flex flex-col h-full font-sans overflow-hidden bg-slate-900">
            <main className="flex-1 overflow-hidden bg-slate-100 flex flex-col relative">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="flex-1 overflow-y-auto p-4 z-10 custom-scrollbar">
                    <div className="max-w-4xl mx-auto w-full">
                        <ListaMessagens mensagens={mensagens} loading={loading} />

                        {mostrarBotãoUpgrade && !isVip && (
                            <div className="w-full mt-6 mb-12 animate-bounce-slow">
                                <button
                                    onClick={aoPedirUpgrade}
                                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-black py-5 rounded-2xl shadow-lg border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all uppercase"
                                >
                                    🔓 LIBERAR DIETA COMPLETA AGORA
                                </button>
                                <p className="text-center text-slate-500 text-[11px] mt-3 uppercase tracking-widest font-bold">
                                    Acesso imediato ao almoço e jantar
                                </p>
                            </div>
                        )}
                        <div ref={scrollRef} className="h-4" />
                    </div>
                </div>
            </main>

            <footer className="bg-white p-3 sm:p-4 border-t border-slate-200 z-30 shadow-inner">
                <div className="max-w-4xl mx-auto">
                    <ChatBox
                        onEnviarMensagem={onEnviarMensagem}
                        desabilitado={loading || (mostrarBotãoUpgrade && !isVip)}
                    />
                    {mostrarBotãoUpgrade && !isVip && (
                        <p className="text-center text-red-500 text-[10px] font-black uppercase mt-2 animate-pulse">
                            ⚠️ Digitação bloqueada! Clique no botão laranja para continuar.
                        </p>
                    )}
                </div>
            </footer>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
                @keyframes bounceSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
                .animate-bounce-slow { animation: bounceSlow 2s infinite ease-in-out; }
            `}} />
        </div>
    );
};

export default ChatReceitas;