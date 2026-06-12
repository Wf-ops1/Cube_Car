# Project Context: Cube Car 77

> **Atualizado:** Junho 2026 · **Estágio:** MVP Enterprise-Lite (Backend-Ready)

---

## 1. Governança e Alicerces (CRÍTICO)

Este projeto foi desenvolvido com o apoio de **agentes de IA especializados** via o framework **BMAD (Business-Minded Agile Development)**. Cada agente atua em uma disciplina específica e todos os agentes de implementação devem se alinhar a esses norteadores:

- **Mary (Analista):** Traduz requisitos E2E em critérios de aceite verificáveis. Conecta as jornadas de todas as personas (Proprietário e Locatário) de ponta a ponta sem atritos visuais ou funcionais.
- **Winston (Arquiteto):** Foco pragmático em contratos E2E precisos e Débito Técnico contido/intencional. Blinda o repositório com API-First design para que componentes nunca dependam de lógicas zumbis.
- **John (PM):** Guardião do valor de negócio. Mocks existem *apenas* temporariamente em *Discovery* — são banidos de *Delivery* e da branch de produção.
- **Amelia (Dev):** Execução ruthlessly pragmática. Exige testes E2E e cobertura real das integrações. Payload hardcoded esquecido num service não-declarado é quebra de build.

---

## 2. Estágio Atual do Projeto

### O que foi alcançado

O projeto superou a fase de prototipação e de refatoração de dívidas técnicas. A arquitetura está consolidada:

- ✅ **13 features de negócio** implementadas e isoladas: `auth-modals`, `booking`, `catalog`, `dashboard`, `host-management`, `wallet`, `messaging`, `notifications`, `profile`, `reputation`, `verification`, `home`, `institucional`.
- ✅ **BookingService** orquestrando o fluxo E2E completo: validação → pagamento → persistência → estado → notificação via chat.
- ✅ **MessagingFacade** como ponto único de entrada para operações de chat, com validação Zod nos contratos.
- ✅ **Gateways** com interfaces declaradas e implementações mock funcionais para todos os domínios: booking, cars, auth, messaging, payment, reputation, wallet.
- ✅ **AuthStore** com persistência (`localStorage`), rehydratação resiliente e fluxo KYC integrado.
- ✅ **GeminiService** com Gemini 2.5 Flash + Google Maps grounding para busca contextual.
- ✅ **searchCarsUseCase** em `core/application/use-cases/` com filtros por texto, categoria e disponibilidade de horário.
- ✅ **ReputationService** puro e testável, com idempotência no gateway e sincronização de rating pós-avaliação.
- ✅ **Testes unitários** cobrindo: `BookingService`, `AuthStore`, `ReputationService`, `MessagingFacade`, `useCheckout.logic`.

### Padrão de entrega exigido (Enterprise-Lite)

- **Zero código genérico** ou pontas soltas em áreas core.
- **Zero mocks não-declarados em produção** — mocks são permitidos apenas como implementação temporária explícita com contrato TypeScript/Zod definido.
- **Débito Técnico zero não-intencional** — pendências estruturais que limitam o roadmap estão barradas; débito temporário deve ser isolado e documentado.
- **Fé cega eliminada por testes** — a garantia E2E não é diretriz, é evidência.

### Pendências conhecidas (próximas fases)

- 🔄 Integração com backend real (Supabase é o candidato natural — plug-and-play via gateways).
- 🔄 Migração da orquestração KYC do `AuthStore` para `features/verification`.
- 🔄 Notificações push reais (atualmente in-memory via Zustand store).
- 🔄 Pipeline CI com testes Playwright automatizados.

---

## 3. Stack Tecnológico Oficial (MANDATÓRIO)

Todas as implementações devem utilizar obrigatoriamente:

| Tecnologia | Versão | Papel |
|---|---|---|
| **React** | 19 | Framework de UI |
| **Vite** | 6 | Build tool / Dev server |
| **TypeScript** | ~5.8 | Tipagem estrita (0% de `any` em código novo) |
| **Tailwind CSS** | 3.4 | Estilização + PostCSS + Autoprefixer |
| **Zustand** | 5 | Estado global (stores de feature + core) |
| **Framer Motion** | 11 | Animações e micro-interações |
| **Lucide React** | latest | Ícones |
| **Zod** | 4 | Validação de dados e contratos de schema |
| **@google/genai** | latest | Gemini 2.5 Flash (AI + Google Maps) |
| **TensorFlow.js + BlazeFace** | 4.x / 0.1 | Reconhecimento facial (KYC) |
| **Tesseract.js** | 7 | OCR de documentos (KYC) |
| **Vitest + Testing Library** | latest | Testes unitários e de integração |
| **Playwright** | 1.60+ | Testes E2E |

---

## 4. Padrão Arquitetural (Vertical Slicing, API-First)

O repositório é sustentado por separação rigorosa de responsabilidades. Ver `ARCHITECTURE-RULES.md` para o contrato completo.

### 4.1 Camadas Fundamentais

1. **Estado:** Diferenciação clara entre estado local (UI/form), estado compartilhado (Zustand stores de feature), estado global (core stores: `AuthStore`).
2. **Lógica/Hook:** Regras de domínio encapsuladas em hooks (`use*.ts`) ou lógica (`*.logic.ts`) isolados da renderização.
3. **Services/Facades:** Orquestração E2E entre gateways. `BookingService` e `MessagingFacade` são os padrões de referência.
4. **Gateways (Core):** Contratos de API puro — sem decisão de negócio, apenas execução. Interface declarada + implementação mock substituível.
5. **UI (Apresentação):** Consome hooks, não toma decisão de negócio. Layout mudo.

### 4.2 Estrutura de Pastas (Estado Real)

```
src/
├── core/
│   ├── ai/              // GeminiService (Gemini 2.5 Flash + Google Maps)
│   ├── application/
│   │   └── use-cases/   // searchCarsUseCase e futuros use cases agnósticos
│   ├── auth/            // AuthStore (Zustand + persist + devtools)
│   ├── components/      // Componentes de infraestrutura (Layout shell, etc.)
│   ├── config/          // Constantes e configurações globais
│   ├── data/
│   │   ├── gateways/    // Contratos de API: booking, cars, auth, messaging, payment, reputation, wallet
│   │   ├── car/         // Tipos e mocks de veículo
│   │   ├── messaging/   // Tipos de mensagens e conversas
│   │   ├── mocks/       // Mocks globais de dados
│   │   ├── payment/     // Tipos de pagamento
│   │   ├── reputation/  // ReputationService + tipos + mocks
│   │   ├── review/      // Tipos de avaliação
│   │   ├── support/     // Suporte
│   │   └── verification // Tipos de verificação KYC
│   ├── domain/          // Regras de domínio puras (pricing.rules.ts)
│   ├── error/           // Tratamento de erros global
│   ├── router/          // Router.view.tsx — roteamento global
│   ├── stores/          // Stores Zustand globais
│   └── styles/          // Estilos globais e tokens de design
│
├── features/
│   ├── auth-modals/     // Login, Cadastro, modais de autenticação
│   ├── booking/         // Motor de reservas (BookingService, useCheckout, wizard)
│   ├── catalog/         // Vitrine e busca de veículos
│   ├── dashboard/       // Painel central do usuário
│   ├── home/            // Landing e entry point
│   ├── host-management/ // Gestão de frota e reservas do proprietário
│   ├── institucional/   // Páginas institucionais e legais
│   ├── messaging/       // Chat (MessagingFacade, chatStore)
│   ├── notifications/   // Sistema de notificações (notificationStore)
│   ├── profile/         // Perfil de usuário
│   ├── reputation/      // Sistema de avaliações bilateral
│   ├── verification/    // KYC: OCR + reconhecimento facial (wizard guiado)
│   └── wallet/          // Carteira digital e pagamentos
│
└── shared/
    ├── components/
    │   ├── ui/          // Átomos: Button, Input, Modal...
    │   └── domain/      // Componentes com semântica de negócio
    ├── hooks/           // Hooks transversais
    ├── types/           // Entidades compartilhadas: Booking, Car, User, Review
    └── utils/           // Formatadores, helpers de data, utilitários puros
```

---

## 5. Diretrizes para Geração de Código

- **Modularização Categórica:** Nunca criar componentes JSX extensos misturando layout com fetch de dados ou chamadas diretas a estados complexos.
- **Evidências de Integração (E2E):** Uma feature só está "pronta" se a ação testada (ex: Aprovação de Reserva) disparar as reações corretas na outra ponta do marketplace (wallet do host creditada, chat atualizado, status sincronizado).
- **Substituição Fácil:** A camada de `services/gateways` deve ser blindada por interfaces para suportar substituição de backend sem mudanças na UI ou nas regras de negócio.
- **Tipagem Estrita:** 0% de `any` em código novo. Zod para contratos de dados externos.
- **Padrão de Referência:** Antes de implementar qualquer feature nova, consultar `BookingService.ts` e `MessagingFacade.ts` como templates de orquestração.

*Este documento é a autoridade suprema para expectativas técnicas e deve ser lido por todos os agentes antes de executar mudanças sistêmicas.*

---

## 6. Protocolo de Iteração de Design (MANDATÓRIO)

Ao criar, sugerir ou codificar qualquer interface ou estrutura visual, execute um ciclo de validação estruturada antes de apresentar o resultado final.

Inicie a resposta com um bloco `<design_rationale>` seguindo as três fases:

### Fase 1 — Construção Fundamentada
Modele a estrutura focando em fricção zero. Quais princípios de design (hierarquia visual, proximidade, densidade informacional) guiam essa interface?

**Regra estrita:** Proibido o uso de componentes ou códigos genéricos em blocos críticos. Cada decisão deve fazer sentido no contexto de Mobilidade/Locação P2P.

### Fase 2 — Auditoria Anti-Repetição & Contexto
A solução reflete a maturidade de um produto Enterprise-Lite ou parece um wireframe descuidado?

Ao adicionar profundidade funcional (detalhes do carro, gestão de reservas), o usuário ainda mantém o contexto de onde está no painel?

### Fase 3 — Validação de Clareza e Controle
O estado atual ou a ação principal (Call to Action) é identificável em menos de 1 segundo?

Há informação de backend (IDs crus, logs, jargões técnicos) poluindo a UI do usuário final? Se sim, remova ou traduza para a linguagem do usuário.

**Critério de Parada:** Apenas após preencher o `<design_rationale>` passando pelas três fases, apresente o código ou a interface. Não entregue soluções preguiçosas que gerem tech debt de UI.
