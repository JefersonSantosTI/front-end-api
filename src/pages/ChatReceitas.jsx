import { useState, useEffect, useRef } from "react";
import ListaMessagens from "../components/ListaMessagens";
import ChatBox from "../components/ChatBox";
import { api } from "../services/api";

const ChatReceitas = ({ whatsapp, isVip, aoPedirUpgrade, aoAtualizarPerfil, setTreinoIAPescado }) => {
    const [loading, setLoading] = useState(false);
    const [mensagens, setMensagens] = useState([]);
    const [mostrarBotãoUpgrade, setMostrarBotãoUpgrade] = useState(false);
    const scrollRef = useRef(null);

    const LIMITE_FREE = 6;

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const extrairEGuardarDados = (texto) => {
        if (!texto) return;
        const txt = texto.toLowerCase();
        let mudou = false;

        // --- LÓGICA DO TREINO IA (Resolve o erro do setTreinoIAPescado) ---
        if ((txt.includes("séries") || txt.includes("repetições") || txt.includes("treino montado")) && typeof setTreinoIAPescado === 'function') {
            console.log("💪 Detectado novo treino no chat");
            // Avisa o App.js que existe um novo treino para "pescar" do banco
            setTreinoIAPescado(texto);
        }

        // 1. EXTRAIR NOME
        const matchNome = texto.match(/(?:Obrigado|Perfeito|Olá|Deyvid|entendido),?\s+([a-zA-Záàâãéèêíïóôõöúçñ]{3,})/i);
        if (matchNome?.[1]) {
            localStorage.setItem("perfil_nome", matchNome[1]);
            mudou = true;
        }

        // 2. EXTRAIR PESO
        const matchPeso = txt.match(/(\d{2,3})\s*(?:kg|quilos)/i) || txt.match(/peso[:\s]*(\d{2,3})/i);
        if (matchPeso && matchPeso[1] !== "0") {
            localStorage.setItem("perfil_peso", matchPeso[1]);
            mudou = true;
        }

        // 3. EXTRAIR ALTURA
        const matchAltura = txt.match(/(\d[.,]\d{2})/);
        if (matchAltura && matchAltura[1] !== "0.00") {
            localStorage.setItem("perfil_altura", matchAltura[1].replace(',', '.'));
            mudou = true;
        }

        if (mudou && typeof aoAtualizarPerfil === 'function') {
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

            const totalMsgUsuario = dados.filter(m => m.role === "user").length;
            let detectouBloqueioManual = !isVip && totalMsgUsuario >= LIMITE_FREE;
            let detectouBloqueioIA = false;

            const historicoFormatado = dados.map((msg, index) => {
                let texto = msg.content || "";
                if (isVip) {
                    texto = texto.replace(/\[CONTEÚDO BLOQUEADO\]/g, "✅ (Liberado)")
                        .replace(/Para visualizar o restante.*/gi, "Plano VIP Ativado! 💪");
                } else if (texto.toUpperCase().includes("BLOQUEADO")) {
                    detectouBloqueioIA = true;
                }
                return { id: index, texto, remetente: msg.role === "assistant" ? "bot" : "usuario" };
            });

            setMostrarBotãoUpgrade(detectouBloqueioManual || detectouBloqueioIA);
            setMensagens(historicoFormatado);

            const ultimaMsgBot = [...dados].reverse().find(m => m.role === "assistant");
            if (ultimaMsgBot) extrairEGuardarDados(ultimaMsgBot.content);

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

            setMensagens(prev => [...prev, {
                id: Date.now() + 1,
                texto: isVip ? respostaTexto.replace(/\[CONTEÚDO BLOQUEADO\]/g, "").replace(/Para visualizar o restante.*/gi, "") : respostaTexto,
                remetente: "bot"
            }]);
        } catch (error) {
            console.error("Erro ao enviar:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full font-sans bg-gray-950 text-white">
            <main className="flex-1 relative overflow-hidden bg-gray-950">
                <div className="absolute inset-0 overflow-y-auto px-4 py-4 z-10 custom-scrollbar">
                    <div className="max-w-2xl mx-auto w-full pb-10">
                        <ListaMessagens mensagens={mensagens} loading={loading} />
                        {mostrarBotãoUpgrade && !isVip && (
                            <div className="w-full mt-8 flex flex-col items-center">
                                <button onClick={aoPedirUpgrade} className="w-full max-w-xs bg-orange-500 text-white font-black py-5 rounded-[2rem] shadow-lg uppercase text-sm">
                                    🚀 Liberar Acesso VIP Agora
                                </button>
                            </div>
                        )}
                        <div ref={scrollRef} className="h-4 w-full" />
                    </div>
                </div>
            </main>
            <footer className="bg-gray-950 px-4 pb-6 pt-2 z-30">
                <div className="max-w-2xl mx-auto">
                    <ChatBox onEnviarMensagem={onEnviarMensagem} desabilitado={loading || (mostrarBotãoUpgrade && !isVip)} />
                </div>
            </footer>
        </div>
    );
};

export default ChatReceitas;