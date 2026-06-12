import { Review } from './reputation.types';

export const mockReviews: Review[] = [
    {
        id: "d4b5b7c8-8df0-11ec-b909-0242ac120002",
        carReferenceId: "c1", // Porsche 911
        authorId: "user-4",
        authorName: "Roberto Alves",
        authorAvatar: "https://i.pravatar.cc/150?u=roberto",
        body: "Experiência incrível. O carro está em perfeito estado, motor roncando alto e a suspensão impecável. O Wallace foi super prestativo durante a entrega.",
        overallRating: 5.0,
        subCriteria: [
            { criterion: "limpeza", score: 5.0 },
            { criterion: "manutencao", score: 5.0 },
            { criterion: "comunicacao", score: 5.0 },
            { criterion: "precisao", score: 5.0 },
        ],
        status: "APPROVED",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "d4b5ba3e-8df0-11ec-b909-0242ac120002",
        carReferenceId: "c2", // BMW M3
        authorId: "user-5",
        authorName: "Carolina Silva",
        authorAvatar: "https://i.pravatar.cc/150?u=carolina",
        body: "Ótimo carro, mas achei que a comunicação demorou um pouco no momento da devolução. No geral, recomendo.",
        overallRating: 4.0,
        subCriteria: [
            { criterion: "limpeza", score: 5.0 },
            { criterion: "manutencao", score: 4.0 },
            { criterion: "comunicacao", score: 3.0 },
            { criterion: "precisao", score: 4.0 },
        ],
        status: "APPROVED",
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "d4b5bcc8-8df0-11ec-b909-0242ac120002",
        carReferenceId: "c1", // Porsche 911
        authorId: "user-6",
        authorName: "Fernando Costa",
        authorAvatar: "https://i.pravatar.cc/150?u=fernando",
        body: "Sensacional. Sem palavras. Veículo entregue pontualmente e limpo.",
        overallRating: 5.0,
        status: "APPROVED",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    }
];
