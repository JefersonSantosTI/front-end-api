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
        <div className="flex flex-col h-full font-sans bg-gray-950 text-white">
            <main className="flex-1 relative overflow-hidden bg-gray-950">
                {/* Textura sutil de fundo estilo Carbono */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                <div className="absolute inset-0 overflow-y-auto px-4 py-4 z-10 custom-scrollbar">
                    <div className="max-w-2xl mx-auto w-full pb-10">

                        <ListaMessagens mensagens={mensagens} loading={loading} />

                        {mostrarBotãoUpgrade && !isVip && (
                            <div className="w-full mt-8 mb-12 flex flex-col items-center animate-fade-in">
                                <button
                                    onClick={aoPedirUpgrade}
                                    className="w-full max-w-xs bg-emerald-500 text-black font-black py-5 rounded-[2rem] shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] transition-transform uppercase text-xs"
                                >
                                    🔓 Liberar Plano Premium
                                </button>
                                <p className="text-[9px] text-gray-500 mt-3 font-black uppercase tracking-widest">
                                    Acesso ilimitado às receitas e treinos
                                </p>
                            </div>
                        )}

                        <div ref={scrollRef} className="h-4 w-full" />
                    </div>
                </div>
            </main>

            {/* Footer Dark - Agora sem a borda superior quadrada */}
            <footer className="bg-gray-950 px-4 pb-6 pt-2 z-30">
                <div className="max-w-2xl mx-auto">
                    <ChatBox
                        onEnviarMensagem={onEnviarMensagem}
                        desabilitado={loading || (mostrarBotãoUpgrade && !isVip)}
                    />
                    {/* Aviso sutil de bloqueio se não for VIP */}
                    {mostrarBotãoUpgrade && !isVip && (
                        <p className="text-center text-red-500/80 text-[8px] font-black uppercase mt-2 tracking-widest">
                            Chat bloqueado para usuários free
                        </p>
                    )}
                </div>
            </footer>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #10b981; }
            `}} />
        </div>
    );
};

export default ChatReceitas;