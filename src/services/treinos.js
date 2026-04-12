export const PROTOCOLOS_TREINO = {
    academia: {
      titulo: "Foco Academia",
      cor: "blue",
      grupos: [
        {
          id: "abc_a",
          nome: "Treino A: Peito / Ombro / Tríceps",
          icone: "🔱",
          exercicios: [
            { id: "a1", nome: "Supino Reto", series: "4x10", gif: "https://www.mundoboaforma.com.br/wp-content/uploads/2020/12/supino-reto.gif" },            { id: "a2", nome: "Supino Inclinado Halter", series: "3x12", gif: "https://www.mundoboaforma.com.br/wp-content/uploads/2020/12/supino-inclinado-com-halteres.gif" },
            { id: "a3", nome: "Peck Deck (Voador)", series: "3x15", gif: "https://gymvisual.com/img/p/5/7/4/0/5740.gif" },
            { id: "a4", nome: "Desenvolvimento Ombro", series: "3x10", gif: "https://www.mundoboaforma.com.br/wp-content/uploads/2020/12/desenvolvimento-para-ombros-com-halteres.gif" },
            { id: "a5", nome: "Elevação Lateral", series: "4x12", gif: "https://www.mundoboaforma.com.br/wp-content/uploads/2020/12/ombros-elevacao-lateral-de-ombros-com-halteres.gif" },
            { id: "a6", nome: "Tríceps Corda", series: "4x12", gif: "https://i.pinimg.com/originals/15/6b/79/156b79c6e5418472dc05fd4bc161cd16.gif" }
          ]
        },
        {
          id: "abc_b",
          nome: "Treino B: Costas / Bíceps",
          icone: "🦅",
          exercicios: [
            { id: "b1", nome: "Puxada Aberta Pulley", series: "4x12", gif: "https://www.mundoboaforma.com.br/wp-content/uploads/2020/12/costas-puxada-aberta-com-barra-no-pulley.gif" },
            { id: "b2", nome: "Remada Baixa", series: "3x10", gif: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8pKet_QvGZCSJtXzUEtSqz7sCDfLkl6aHRg&s" },
            { id: "b3", nome: "Serrote (Remada Unilateral)", series: "3x12", gif: "https://www.mundoboaforma.com.br/wp-content/uploads/2020/12/costas-remada-unilateral-com-halter-serrote-no-banco.gif" },
            { id: "b4", nome: "Rosca Direta Barra W", series: "4x10", gif: "https://www.hipertrofia.org/blog/wp-content/uploads/2024/12/rosca-direta-com-barra-w.gif" },
            { id: "b5", nome: "Rosca Martelo", series: "3x12", gif: "https://www.hipertrofia.org/blog/wp-content/uploads/2023/04/dumbbell-hammer-curl-v-2.gif" }
          ]
        },
        {
          id: "abc_c",
          nome: "Treino C: Pernas Completo",
          icone: "🦵",
          exercicios: [
            { id: "c1", nome: "Agachamento Livre", series: "4x10", gif: "https://media.tenor.com/pdMmsiutWkcAAAAM/gym.gif" },
            { id: "c2", nome: "Leg Press 45", series: "4x12", gif: "https://i0.wp.com/omelhortreino.com.br/wp-content/uploads/2025/04/Leg-press-45.gif?resize=550%2C550&ssl=1" },
            { id: "c3", nome: "Cadeira Extensora", series: "3x15", gif: "https://media.tenor.com/bqKtsSuqilQAAAAM/gym.gif" },
            { id: "c4", nome: "Mesa Flexora", series: "3x12", gif: "https://image.tuasaude.com/media/article/hz/mb/mesa-flexora_75623.gif?width=686&height=487" },
            { id: "c5", nome: "Panturrilha em Pé", series: "4x20", gif: "https://www.mundoboaforma.com.br/wp-content/uploads/2021/03/Panturrilha-em-pe-no-aparelho.gif" }
          ]
        },
        {
          id: "especifico_bracos",
          nome: "E: Braços (Bíceps / Tríceps)",
          icone: "💪",
          exercicios: [
            { id: "e1", nome: "Rosca Direta Polia", series: "4x10", gif: "https://www.hipertrofia.org/blog/wp-content/uploads/2019/04/rosca-direta-polia.gif" },
            { id: "e2", nome: "Tríceps Testa", series: "4x10", gif: "https://image.tuasaude.com/media/article/hd/sc/exercicios-para-biceps-e-triceps_75262.gif?width=242&height=161" },
            { id: "e3", nome: "Rosca Concentrada", series: "3x12", gif: "https://i.pinimg.com/originals/c7/a5/9c/c7a59c7fc471066f2a1fea5da7a78e0d.gif" },
            { id: "e4", nome: "Tríceps Francês", series: "3x12", gif: "https://www.hipertrofia.org/blog/wp-content/uploads/2025/01/triceps-frances-com-um-halter-sentado.gif" },
            { id: "e5", nome: "Rosca Inversa (Antebraço)", series: "3x15", gif: "https://i0.wp.com/omelhortreino.com.br/wp-content/uploads/2025/04/Rosca-Inversa.gif?resize=550%2C550&ssl=1" }
          ]
        },
        {
          id: "upper_body",
          nome: "Upper Body (Superior)",
          icone: "👕",
          exercicios: [
            { id: "u1", nome: "Supino Reto", series: "3x10", gif: "https://www.mundoboaforma.com.br/wp-content/uploads/2020/12/supino-reto.gif" },
            { id: "u2", nome: "Puxada Frontal", series: "3x10", gif: "https://image.tuasaude.com/media/article/uh/yp/puxada-frontal_75625.gif?width=686&height=487" },
            { id: "u3", nome: "Desenvolvimento Halter", series: "3x10", gif: "https://www.mundoboaforma.com.br/wp-content/uploads/2020/12/desenvolvimento-para-ombros-com-halteres.gif" },
            { id: "u4", nome: "Remada Curvada", series: "3x10", gif: "https://www.mundoboaforma.com.br/wp-content/uploads/2020/12/costas-remada-curvada-.gif" },
            { id: "u5", nome: "Rosca Direta + Tríceps Corda", series: "3x12 (Bi-set)", gif: "https://www.hipertrofia.org/blog/wp-content/uploads/2024/08/cable-hammer-curl-with-rope.gif" }
          ]
        },
        {
          id: "lower_body",
          nome: "Lower Body (Inferior)",
          icone: "🩳",
          exercicios: [
            { id: "l1", nome: "Leg Press 45", series: "4x12", gif: "https://i0.wp.com/omelhortreino.com.br/wp-content/uploads/2025/04/Leg-press-45.gif?resize=550%2C550&ssl=1" },
            { id: "l2", nome: "Afundo com Halter", series: "3x10 (cada perna)", gif: "https://www.hipertrofia.org/blog/wp-content/uploads/2023/12/dumbbell-lunge.gif" },
            { id: "l3", nome: "Cadeira Extensora", series: "3x15", gif: "https://media.tenor.com/bqKtsSuqilQAAAAM/gym.gif" },
            { id: "l4", nome: "Mesa Flexora", series: "3x15", gif: "https://image.tuasaude.com/media/article/hz/mb/mesa-flexora_75623.gif?width=686&height=487" },
            { id: "l5", nome: "Panturrilha Sentado", series: "4x20", gif: "https://treinoemalta.com.br/wp-content/uploads/2023/07/sentado.gif" }
          ]
        }
      ]
    }, // <--- Fechamento correto da academia
  
    casa: {
      titulo: "Treino em Casa",
      cor: "emerald",
      grupos: [
        {
          id: "circuito_queima",
          nome: "Circuito Queima (15-25 min)",
          icone: "⏱️",
          exercicios: [
            { id: "cq1", nome: "Agachamento Livre", series: "3-4x 15 rep", gif: "https://www.mundoboaforma.com.br/wp-content/uploads/2020/11/agachamento-livre.gif" },
            { id: "cq2", nome: "Flexão (Joelho no chão)", series: "3-4x Limite", gif: "https://i.pinimg.com/originals/92/6e/c5/926ec5127683c2779b7f5cc627cf75e0.gif" },
            { id: "cq3", nome: "Afundo Alternado", series: "3-4x 10 cada perna", gif: "https://www.mundoboaforma.com.br/wp-content/uploads/2021/04/pernas-afundo-tradicional-sem-pesos-1.gif" },
            { id: "cq4", nome: "Prancha Isométrica", series: "3-4x 45 seg", gif: "https://www.mundoboaforma.com.br/wp-content/uploads/2020/12/prancha-com-elevacao-das-pernas-prancha-aranha.gif" },
            { id: "cq5", nome: "Polichinelo", series: "3-4x 1 minuto", gif: "https://i0.wp.com/omelhortreino.com.br/wp-content/uploads/2025/07/Polichinelo-Frontal.gif?resize=550%2C550&ssl=1" }
          ]
        },
        {
          id: "cardio_hiit",
          nome: "Cardio & Fôlego",
          icone: "🫀",
          exercicios: [
            { id: "ch1", nome: "Burpee", series: "3x 10 rep", gif: "https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUyM2xmOWcxbzZ5NzdqeHZiYm40YWpiZDJydzhxZ2owcHo3MTBid3Y2MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l4pT6Obikzs5gxWSI/giphy.gif" },
            { id: "ch2", nome: "Corrida no Lugar", series: "3x 1 min", gif: "https://www.mundoboaforma.com.br/wp-content/uploads/2023/11/31991301-corrida-estacionaria-360.gif" }
          ]
        },
        {
          id: "adaptados",
          nome: "Uso de Móveis/Objetos",
          icone: "🪑",
          exercicios: [
            { id: "ad1", nome: "Tríceps Banco (Cadeira)", series: "3x12", gif: "https://media1.tenor.com/m/XZ0zLOLCbm0AAAAd/tr%C3%ADceps-na-cadeira-4x10.gif" },
            { id: "ad2", nome: "Elevação de Panturrilha", series: "4x20", gif: "https://www.calistenia.net/wp-content/uploads/2017/09/STEPUP.gif" },
            { id: "ad3", nome: "Remada com Mochila", series: "3x15", gif: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHRreXp3eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKu56g0v4v8Wf9m/giphy.gif" }
          ]
        },
        {
          id: "abs_core",
          nome: "Abdominal & Core",
          icone: "🧘",
          exercicios: [
            { id: "ab1", nome: "Abdominal Tradicional", series: "4x20", gif: "https://www.mundoboaforma.com.br/wp-content/uploads/2021/03/abdominal.gif" },
            { id: "ab2", nome: "Abdominal Infra", series: "3x15", gif: "https://www.hipertrofia.org/blog/wp-content/uploads/2017/09/Abdominal-infra-solo.gif" }
          ]
        }
      ]
    }, // <--- Fechamento correto da casa
  
    
  }; // <--- Fechamento final do objeto PROTOCOLOS_TREINO