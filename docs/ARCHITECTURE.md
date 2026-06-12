# Arquitetura Cube Car

> **Versão:** MVP Enterprise-Lite · **Atualizado:** Junho 2026
> **Princípio Fundamental:** Regras de negócio pertencem às Features. Core provê infraestrutura. Shared provê UI pura.

---

## 🎯 Visão Geral

O Cube Car é uma plataforma de Car Sharing P2P com dois lados de marketplace: **Proprietários (Hosts)** e **Locatários**. A arquitetura reflete essa dualidade — cada domínio de negócio vive isolado em sua própria feature, enquanto a infraestrutura compartilhada reside no `core`.

O projeto saiu da fase de prototipagem. A arquitetura atual está consolidada no padrão **Vertical Slicing (Feature-First)**, com separação estrita de responsabilidades e contratos API-First em todos os gateways.

---

## 🗺️ Mapa do Sistema (Estado Real)

```
┌─────────────────────────────────────────────────────────────────┐
│                         src/features/                           │
│                                                                 │
│  auth-modals  booking  catalog  dashboard  host-management      │
│  wallet  messaging  notifications  profile  reputation          │
│  verification  home  institucional                              │
│                                                                 │
│  ┌─────────────┐    ┌──────────────┐    ┌────────────────────┐  │
│  │  components │    │    hooks/    │    │     services/      │  │
│  │  (UI muda)  │───►│  (lógica de │───►│ (contratos E2E,    │  │
│  │             │    │  domínio)   │    │  Facades, Orches.) │  │
│  └─────────────┘    └──────────────┘    └────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │ importa de
┌────────────────────────────▼────────────────────────────────────┐
│                          src/core/                              │
│                                                                 │
│  auth/          → AuthStore (Zustand + persist + devtools)      │
│  ai/            → Gemini 2.5 Flash + Google Maps grounding      │
│  data/gateways/ → Contratos de API (Mock-first, typesafe)      │
│  data/car/      → tipos e mocks de veículo                     │
│  data/reputation/→ ReputationService + tipos + mocks           │
│  application/   → Use Cases agnósticos (ex: searchCarsUseCase) │
│  domain/        → Regras de domínio puras (ex: pricing.rules)  │
│  router/        → Router.view.tsx (roteamento global)          │
│  config/        → Constantes e configurações globais           │
└────────────────────────────┬────────────────────────────────────┘
                             │ importa de
┌────────────────────────────▼────────────────────────────────────┐
│                         src/shared/                             │
│  components/ui/     → Átomos (Button, Input, Modal...)          │
│  components/domain/ → Peças visuais com semântica de negócio    │
│  hooks/             → Hooks utilitários transversais            │
│  types/             → Tipos compartilhados (Booking, Car, User) │
│  utils/             → Formatadores, helpers, utilitários        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Camadas do Sistema

### 1. `src/features/` — Onde o Negócio Vive

Cada feature é um **micro-domínio autônomo** com estrutura padronizada:

```
src/features/[feature]/
├── components/  → UI restrita da feature
├── hooks/       → Lógica de domínio e casos de uso locais
├── services/    → Orquestração E2E (Services, Facades)
├── stores/      → Estado Zustand da feature
├── views/       → Telas completas (páginas)
├── wizards/     → Fluxos sequenciais guiados (ex: verificação)
├── types.ts     → Tipos de domínio da feature
└── schema.ts    → Regras de validação Zod
```

**✅ Features PODEM:**
- Validar dados e aplicar regras de negócio
- Orquestrar múltiplos gateways (via Services/Facades)
- Gerenciar estado local da feature (Zustand store da feature)
- Importar de `core` e `shared`

**❌ Features NÃO PODEM:**
- Fazer chamadas HTTP diretas (usa gateways do core)
- Importar outra feature diretamente (comunicação via `core` ou composição)
- Poluir o `core` com regras de domínio específicas

---

### 2. `src/core/` — A Fundação

Infraestrutura agnóstica a domínios. Não conhece regras de negócio — apenas executa.

#### `core/auth/`
`AuthStore` global com **Zustand + persist + devtools**. Gerencia sessão, rehydratação e o fluxo de verificação de identidade (KYC). Expõe selectors otimizados: `useUser`, `useIsAuthenticated`, `useAuthActions`.

> ⚠️ **Observação de Evolução:** O `AuthStore` atualmente orquestra parte do fluxo de verificação (submissão de documentos, auto-aprovação dev). Conforme o backend for integrado, essas responsabilidades migram para `features/verification`.

#### `core/ai/`
`GeminiService` — cliente singleton para o **Gemini 2.5 Flash** com Google Maps grounding. Expõe `searchWithGemini(query, userLocation?)`. Toda lógica de IA passa por aqui — features consomem este serviço, nunca instanciam o cliente diretamente.

#### `core/data/gateways/`
**A fronteira do sistema.** Todos os gateways seguem o contrato:
- Definem uma **Interface** (`BookingGatewayContract`, `ReputationGatewayContract`, etc.)
- Implementam atualmente como **Mock** (in-memory, com simulação de latência)
- São **"burros"**: só executam chamadas, nunca decidem regras de negócio

| Gateway | Contrato | Status Mock |
|---|---|---|
| `booking.gateway.ts` | `BookingGatewayContract` | ✅ Funcional |
| `cars.gateway.ts` | — | ✅ Funcional |
| `auth.gateway.ts` | — | ✅ Funcional |
| `messaging.gateway.ts` | — | ✅ Funcional |
| `payment.gateway.ts` | — | ✅ Funcional |
| `reputation.gateway.ts` | `ReputationGatewayContract` | ✅ Funcional |
| `wallet.gateway.ts` | — | ✅ Funcional |

> Quando o backend estiver pronto, **apenas** as implementações dos gateways são substituídas. Nenhum código de feature ou UI muda.

#### `core/data/reputation/`
`ReputationService` puro — calcula ratings, agrega métricas. Consumido pelo `reputation.gateway.ts` para atualizar o snapshot de rating do carro após cada avaliação. Testado independentemente.

#### `core/application/use-cases/`
Use cases agnósticos que orquestram múltiplos gateways sem pertencer a uma feature específica. Atualmente: `searchCarsUseCase` — filtra catálogo por query, categoria e disponibilidade de horário.

#### `core/domain/`
Regras de domínio puras sem efeitos colaterais. Atualmente: `pricing.rules.ts`. Nenhum estado, nenhuma chamada de rede — apenas lógica calculada.

---

### 3. `src/shared/` — Design System e Utilitários

**Shared é "burro" em relação ao negócio.**

- `components/ui/` → Átomos atômicos (Button, Input, Modal). Sem fetch, sem stores de feature.
- `components/domain/` → Peças visuais com semântica de domínio reutilizáveis entre features.
- `types/` → **Fonte da verdade tipada** para entidades compartilhadas: `Booking`, `Car`, `User`, `Review`.
- `utils/` → Formatadores, helpers de data, utilitários puros.
- `hooks/` → Hooks transversais sem lógica de negócio.

---

## 🔌 Padrões Arquiteturais em Uso

### Facade Pattern — `MessagingFacade`
A feature `messaging` expõe uma `MessagingFacade` como ponto único de entrada para todas as operações de chat. O `BookingService` usa a facade — não acessa o `messagingGateway` diretamente. Isso protege os detalhes internos do domínio de mensagens.

```
BookingService ──→ MessagingFacade ──→ messagingGateway
                                  └──→ chatStore (Zustand)
```

### Orchestrator Pattern — `BookingService`
`features/booking/services/BookingService.ts` é o orquestrador do fluxo de reserva E2E:

```
createBooking():
  1. Validação de negócio
  2. paymentGateway.processPayment()
  3. bookingGateway.create()
  4. bookingStore.createBooking()          ← estado local
  5. messagingFacade.notifyBookingEvent()  ← side effect

approveBooking():
  1. bookingGateway.getById()
  2. Validação de transição de estado
  3. bookingGateway.updateStatus('APPROVED')
  4. walletGateway.addFunds()             ← crédito ao host
```

### Use Case Pattern — `searchCarsUseCase`
Lógica de busca/filtro isolada em `core/application/use-cases/`. Recebe `SearchParams`, consulta o gateway e aplica filtros de categoria, texto e disponibilidade de horário. Chamável de qualquer feature sem acoplamento.

### Idempotency — `ReputationGateway`
O `submitReview` implementa verificação de idempotência por `idempotencyKey` — prevenindo avaliações duplicadas por clique duplo ou retry. Padrão que espelha o comportamento esperado de uma API real.

---

## 🔐 Autenticação e Estado Global

O `AuthStore` (`core/auth/auth.store.ts`) é o único ponto de verdade sobre a sessão do usuário:

```typescript
// O que o AuthStore FAZ:
setAuth(user)           // Autentica o usuário
logout()                // Encerra a sessão
isAuthenticated         // Estado booleano da sessão
submitVerificationDocuments()  // Submete docs KYC
approveVerification()   // Aprova verificação
rejectVerification(reason)     // Rejeita com motivo

// Selectors otimizados (evitam re-renders desnecessários):
useUser()
useIsAuthenticated()
useAuthLoading()
useAuthActions()
```

**Estado persistido** via `localStorage` (`cube-car-auth-storage`) com rehydratação resiliente — o timer de auto-aprovação dev retoma após F5, calculando o tempo restante baseado na data de submissão.

---

## 📦 Regras de Importação

| De \ Para | `core` | `features` | `shared` | Externas |
|---|---|---|---|---|
| **`features`** | ✅ | ⚠️ Facade/Store apenas | ✅ | ✅ |
| **`core`** | ✅ (intra-core) | ❌ | ✅ (types/utils) | ✅ |
| **`shared`** | ✅ (types/utils) | ❌ | ✅ | ✅ |

> ⚠️ A comunicação entre features, quando necessária, deve passar por um Facade no `core` ou por composição de componentes via `children` — nunca importação direta.

---

## 🧪 Estratégia de Testes

| Tipo | Ferramenta | Cobertura Atual |
|---|---|---|
| Unitário (lógica pura) | Vitest + Testing Library | `BookingService`, `AuthStore`, `ReputationService`, `MessagingFacade` |
| E2E (jornadas completas) | Playwright | Configurado em `playwright.config.ts` |
| Integração (hooks) | Vitest + jsdom | `useCheckout.logic.spec.ts` |

---

## 🔄 Estado do Backend (Plug-and-Play)

O sistema opera atualmente em **modo Mock-First**:

- Todos os gateways têm contratos TypeScript/Zod definidos
- As implementações mock simulam latência de rede e comportamento de backend
- A substituição por um backend real (Supabase, REST API, etc.) exige **apenas** trocar a implementação dos gateways — zero mudança em features, stores ou UI

```typescript
// Hoje:
export const bookingGateway = new MockBookingGateway(); // ← troca aqui

// Com backend:
export const bookingGateway = new SupabaseBookingGateway(supabaseClient);
```

---

## 📋 Decisões em Aberto (Próximas Fases)

| Decisão | Contexto | Impacto |
|---|---|---|
| Integração de Backend real | Supabase é o candidato natural | Substituição dos gateways mock |
| Migração KYC para `features/verification` | AuthStore orquestra demais o fluxo | Separação de responsabilidades |
| Notificações push reais | Atualmente in-memory via store | Requer WebSocket ou polling |
| Testes E2E em CI | Playwright configurado, não automatizado | Pipeline de qualidade |
