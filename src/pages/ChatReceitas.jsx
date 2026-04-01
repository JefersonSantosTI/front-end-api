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
        <div className="flex flex-col h-screen font-sans overflow-hidden bg-[#f0f2f5]">
            {/* Header Estilo WhatsApp (Opcional, mas dá o toque profissional) */}
            <header className="bg-[#00a884] py-3 px-4 flex items-center shadow-sm z-20">
                <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex-shrink-0 overflow-hidden">
                    <img src="https://via.placeholder.com/40" alt="Bot" />
                </div>
                <div>
                    <h2 className="text-white font-medium leading-none">Nutricionista IA</h2>
                    <span className="text-[11px] text-emerald-100">online</span>
                </div>
            </header>

            <main className="flex-1 relative overflow-hidden bg-[#e5ddd5]">
                {/* Papel de parede sutil do WhatsApp */}
                <div
                    className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{ backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')` }}
                />

                <div className="absolute inset-0 overflow-y-auto px-[5%] py-4 z-10 custom-scrollbar flex flex-col">
                    <div className="max-w-[800px] mx-auto w-full pb-10">

                        <ListaMessagens mensagens={mensagens} loading={loading} />

                        {mostrarBotãoUpgrade && !isVip && (
                            <div className="w-full mt-6 mb-12 flex justify-center">
                                <button
                                    onClick={aoPedirUpgrade}
                                    className="w-full max-w-md bg-[#00a884] hover:bg-[#008f70] text-white font-bold py-4 rounded-lg shadow-md transition-all uppercase tracking-wide"
                                >
                                    🔓 Liberar Dieta Completa
                                </button>
                            </div>
                        )}

                        <div ref={scrollRef} className="h-2 w-full" />
                    </div>
                </div>
            </main>

            {/* Footer Estilo WhatsApp */}
            <footer className="bg-[#f0f2f5] p-2 sm:p-3 z-30 relative">
                <div className="max-w-[800px] mx-auto flex items-center gap-2">
                    <div className="flex-1">
                        <ChatBox
                            onEnviarMensagem={onEnviarMensagem}
                            desabilitado={loading || (mostrarBotãoUpgrade && !isVip)}
                        />
                    </div>
                </div>
                {mostrarBotãoUpgrade && !isVip && (
                    <p className="text-center text-red-500 text-[10px] font-bold uppercase mt-1">
                        ⚠️ Limite atingido. Faça upgrade para continuar.
                    </p>
                )}
            </footer>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 10px; }
                .custom-scrollbar { -webkit-overflow-scrolling: touch; scroll-behavior: smooth; }
            `}} />
        </div>
    );
};

export default ChatReceitas;