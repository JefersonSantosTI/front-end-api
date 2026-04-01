import { useState, useEffect, useRef } from "react"
import ListaMessagens from "../components/ListaMessagens"
import ChatBox from "../components/ChatBox"
import { api } from "../services/api"

const ChatReceitas = ({ whatsapp, isVip, aoPedirUpgrade, aoAtualizarPerfil }) => {
    const [loading, setLoading] = useState(false)
    const [mensagens, setMensagens] = useState([])
    const [mostrarBotãoUpgrade, setMostrarBotãoUpgrade] = useState(false)

    const scrollRef = useRef(null);

    // Função de scroll melhorada com timeout para garantir que o DOM renderizou
    const scrollToBottom = () => {
        setTimeout(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
            }
        }, 100);
    };

    const extrairEGuardarDados = (texto) => {
        const txt = texto.toLowerCase();
        let mudou = false;

        const regexNome = /(?:obrigado|perfeito|olá|bem-vinda|fala|oi|entendi|certo),?\s+([a-zA-Záàâãéèêíïóôõöúçñ]+)/i;
        const matchNome = texto.match(regexNome);
        if (matchNome && matchNome[1] && matchNome[1].length > 2) {
            localStorage.setItem("perfil_nome", matchNome[1]);
            mudou = true;
        }

        const regexPeso = /(?:peso:?|pesando)\s*(\d+[.,]?\d*)/i;
        const matchPeso = txt.match(regexPeso);
        if (matchPeso) {
            localStorage.setItem("perfil_peso", matchPeso[1].replace(',', '.'));
            mudou = true;
        }

        const regexAltura = /(?:altura:?)\s*(\d[.,]\d{2})/i;
        const matchAltura = txt.match(regexAltura);
        if (matchAltura) {
            localStorage.setItem("perfil_altura", matchAltura[1].replace(',', '.'));
            mudou = true;
        }

        if (mudou && typeof aoAtualizarPerfil === "function") {
            aoAtualizarPerfil();
        }
    };

    // Trigger de scroll apenas quando novas mensagens chegarem
    useEffect(() => {
        scrollToBottom();
    }, [mensagens]);

    const carregarHistorico = async () => {
        if (!whatsapp) return;
        setLoading(true);

        try {
            const response = await api.get(`/receitas/historico/${whatsapp}`);
            const dados = Array.isArray(response.data) ? response.data : [];

            let detectouBloqueioNoHistorico = false;

            const historicoFormatado = dados.map((msg, index) => {
                let texto = msg.content || "";
                if (msg.role === "assistant") extrairEGuardarDados(texto);

                if (isVip) {
                    texto = texto.replace(/\[CONTEÚDO BLOQUEADO\]/g, "✅ (Conteúdo Liberado)");
                    texto = texto.replace(/Para visualizar o restante do seu plano.*/gi, "Plano VIP Ativado! 💪");
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

            setMostrarBotãoUpgrade(!isVip && detectouBloqueioNoHistorico);
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

        const novaMensagemUsuario = {
            id: Date.now(),
            texto: textoDigitado,
            remetente: "usuario"
        };

        setMensagens((prev) => [...prev, novaMensagemUsuario]);
        setLoading(true);

        try {
            const nomeReal = localStorage.getItem("perfil_nome") || "";
            const response = await api.post("/receitas/perguntar", {
                whatsapp: whatsapp,
                mensagemAtual: textoDigitado,
                nomeNoPerfil: nomeReal
            });

            const respostaTexto = response.data.resposta || "";
            extrairEGuardarDados(respostaTexto);

            const temTextoDeBloqueio = respostaTexto.toUpperCase().includes("BLOQUEADO");

            if (!isVip && temTextoDeBloqueio) {
                setMostrarBotãoUpgrade(true);
            }

            setMensagens((prev) => [...prev, {
                id: Date.now() + 1,
                texto: isVip ? respostaTexto.replace(/\[CONTEÚDO BLOQUEADO\]/g, "").replace(/Para visualizar o restante.*/gi, "") : respostaTexto,
                remetente: "bot"
            }]);

        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-slate-900 overflow-hidden">
            {/* CORREÇÃO AQUI: main agora é o container de scroll principal */}
            <main className="flex-1 overflow-y-auto bg-slate-100 relative custom-scrollbar">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                <div className="max-w-4xl mx-auto w-full p-4 z-10 min-h-full flex flex-col">
                    <ListaMessagens mensagens={mensagens} loading={loading} />

                    {mostrarBotãoUpgrade && !isVip && (
                        <div className="w-full mt-6 mb-10 transition-all">
                            <button
                                onClick={aoPedirUpgrade}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-black py-5 rounded-2xl shadow-xl uppercase text-sm sm:text-base animate-bounce-slow"
                            >
                                🔓 LIBERAR DIETA COMPLETA AGORA
                            </button>
                        </div>
                    )}
                    {/* Elemento de ancoragem para o scroll */}
                    <div ref={scrollRef} className="h-2 w-full flex-none" />
                </div>
            </main>

            <footer className="bg-white p-3 sm:p-4 border-t border-slate-200 z-30 shadow-2xl">
                <div className="max-w-4xl mx-auto">
                    <ChatBox
                        onEnviarMensagem={onEnviarMensagem}
                        desabilitado={loading || (mostrarBotãoUpgrade && !isVip)}
                    />
                    {mostrarBotãoUpgrade && !isVip && (
                        <p className="text-center text-red-500 text-[10px] font-black uppercase mt-2 tracking-widest animate-pulse">
                            ⚠️ Digitação bloqueada! Clique no botão laranja.
                        </p>
                    )}
                </div>
            </footer>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
                @keyframes bounceSlow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-slow { animation: bounceSlow 2s infinite ease-in-out; }
            `}} />
        </div>
    );
};

export default ChatReceitas;