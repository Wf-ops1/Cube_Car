# 🧊 Cube Car — Contrato de Arquitetura Frontend

> **Versão:** MVP Enterprise-Lite · **Atualizado:** Junho 2026

Este documento define as regras obrigatórias de arquitetura do projeto. O objetivo é manter o padrão de **Vertical Slicing (Feature-First)** consolidado, suportar escala horizontal sem colisão de código e garantir respeito irrestrito aos contratos E2E.

---

## 1. Regra de Ouro (Isolamento por Feature)

**Uma Feature NUNCA importa diretamente outra Feature.**

O projeto é fatiado verticalmente. O fluxo de reserva (`features/booking`) não importa regras internas do fluxo de pagamento (`features/wallet`) — e vice-versa.

**As únicas exceções aceitas, já em uso no projeto:**
- Comunicação via **Facade** exposta em `services/` da feature de origem (ex: `MessagingFacade` usada pelo `BookingService`).
- Consumo de **stores Zustand** de outra feature quando o dado é genuinamente compartilhado e não há alternativa via `core`.

**Quando duas features precisam compartilhar:**
- Dado/lógica → promove para `core/` (use case, gateway, ou store global).
- Componente visual → promove para `shared/components/domain/` ou `shared/components/ui/`.
- Fluxo de UI → composição via `children` (Inversão de Controle) em nível de página/view.

---

## 2. Camadas do Sistema

### 🚀 Features (A Espinha Dorsal)

Cada capacidade de negócio é um micro-domínio autônomo. Dentro de `src/features/[feature]/`:

- **`services/`** — Orquestração E2E e Facades. É aqui que vivem os **Orchestrators** (ex: `BookingService`) e **Facades** (ex: `MessagingFacade`). Contratos de API-First fortes. Sem lógica de UI vazando aqui.
- **`hooks/` ou `logic/`** — Lógica de domínio e casos de uso locais. Consomem services e orquestram estado (`useState`, stores Zustand da feature). A UI confia cegamente no hook — o hook não sabe nada sobre como é renderizado.
- **`components/` & `views/`** — Apresentação pura. Proibido injetar fetch complexo ou validação de negócio diretamente no JSX. Layout deve ser mudo.
- **`stores/`** — Estado Zustand restrito à feature. Não vaza para outras features diretamente.
- **`wizards/`** — Fluxos sequenciais guiados (ex: verificação de identidade em etapas).
- **`types.ts` / `schema.ts`** — Fonte da verdade tipada com Zod/TypeScript para blindar contratos de dados.

### 🏛️ Core (A Infraestrutura Agnóstica)

`src/core/` **NÃO** guarda regras de negócio de domínios específicos — isso pertence às features.

Contém:
- **`auth/`** — `AuthStore` global (Zustand + persist + devtools). Estado de sessão do usuário.
- **`ai/`** — `GeminiService` singleton. Toda integração com IA passa por aqui.
- **`data/gateways/`** — Contratos de API (interfaces + implementações mock). Gateways são **burros**: só executam chamadas, nunca decidem regras de negócio.
- **`data/reputation/`** — `ReputationService` puro + tipos + mocks. Sem estado.
- **`application/use-cases/`** — Use cases agnósticos que orquestram múltiplos gateways (ex: `searchCarsUseCase`).
- **`domain/`** — Regras de domínio puras sem efeitos colaterais (ex: `pricing.rules.ts`).
- **`router/`** — Roteamento global da aplicação.
- **`config/`** — Constantes e configurações globais.

### 🧱 Shared (Reuso Puritano)

- **`shared/components/ui/`** — Átomos (Button, Input, Modal). Cegos ao negócio. Sem fetch, sem stores de feature.
- **`shared/components/domain/`** — Peças visuais com semântica de negócio reutilizáveis entre features.
- **`shared/types/`** — Fonte da verdade para entidades compartilhadas: `Booking`, `Car`, `User`, `Review`.
- **`shared/utils/`** — Formatadores, helpers de data, utilitários puros.
- **`shared/hooks/`** — Hooks transversais sem lógica de negócio.

---

## 3. Padrões em Uso (Consolidados)

### Facade Pattern
Quando uma feature precisa expor funcionalidades a outra sem quebrar o isolamento, usa-se uma **Facade** em `services/`.

```tsx
// ✅ BookingService usa MessagingFacade — sem importar internals de messaging
import { messagingFacade } from '@/features/messaging/services/MessagingFacade';

await messagingFacade.notifyBookingEvent({ carId, hostId, renterId, ... });
```

### Orchestrator Pattern
Services de feature orquestram múltiplos gateways em sequência, gerenciando efeitos colaterais e estado.

```tsx
// ✅ BookingService.createBooking():
// 1. Validação → 2. Pagamento → 3. Persistência → 4. Estado local → 5. Notificação via Facade
```

### Use Case Pattern
Lógica agnóstica de feature que orquestra múltiplos gateways fica em `core/application/use-cases/`.

```tsx
// ✅ searchCarsUseCase — filtra catálogo por texto, categoria e horário de disponibilidade
const cars = await searchCarsUseCase({ query, category, pickupTime, dropoffTime });
```

### View vs Hook (Regra Fundamental)

❌ **Anti-Pattern — lógica vazando no layout:**
```tsx
export function BookingScreen() {
  const handleBooking = async () => {
    const data = await api.post('/book', { id: 123 }); // ❌ UI fazendo fetch direto
  };
  return <button onClick={handleBooking}>Reservar</button>;
}
```

✅ **Padrão correto — UI confia no hook:**
```tsx
import { useCheckout } from '../logic/useCheckout.logic';

export function BookingScreen() {
  const { handleBooking, isSubmitting } = useCheckout(); // ✅ lógica encapsulada
  return <button disabled={isSubmitting} onClick={handleBooking}>Reservar</button>;
}
```

---

## 4. Contratos de Gateway (Plug-and-Play)

Todo gateway deve:
1. Declarar uma **interface de contrato** (`BookingGatewayContract`, `ReputationGatewayContract`, etc.)
2. Implementar atualmente como **Mock** (in-memory, com simulação de latência realista)
3. Ser **"burro"**: executa chamadas, nunca decide regras de negócio

```typescript
// Hoje:
export const bookingGateway = new MockBookingGateway();

// Com backend (zero mudança em features ou UI):
export const bookingGateway = new SupabaseBookingGateway(supabaseClient);
```

Gateways **não importam outros gateways**. Quando há sincronização entre domínios (ex: atualizar rating de carro após avaliação), o gateway pode disparar side effects pontuais documentados — mas a orquestração principal pertence aos Services de feature.

---

## 5. Mocks e Estado de Integração

**Estado atual:** o sistema opera em **modo Mock-First** — todos os gateways têm contratos TypeScript/Zod definidos e implementações mock funcionais.

**Regras:**
- Mocks de descoberta (Discovery) são válidos **apenas** em pastas isoladas com nome explícito (ex: `*.mock.ts`, `dev-mocks.ts`).
- Mocks **NÃO PODEM** vazar como estado padrão de produção. Se a API ainda não existe, use contratos estritos + mocks declarados — não dados hardcoded misturados ao código de produção.
- Uma feature só é considerada **entregue** se seus contratos API-First e o fluxo E2E estiverem configurados e testáveis no repositório.
