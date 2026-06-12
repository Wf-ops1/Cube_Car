# Arquitetura Cube Car

## 🎯 Visão Geral

Este documento define os princípios arquiteturais, limites de responsabilidade e padrões de código do projeto Cube Car.

> **Princípio Fundamental**: Regras de negócio pertencem às Features. Core provê infraestrutura. Shared provê UI pura.

---

## 🏗️ Estrutura de Pastas e Responsabilidades

### 1. `src/features/` (Onde o Negócio Vive)
Contém todas as capacidades de negócio do aplicativo. É aqui que as decisões são tomadas.

**✅ PODE:**
- Validar dados de entrada
- Aplicar regras de negócio (ex: "usuário pode reservar?")
- Decidir fluxos condicionais
- Orquestrar chamadas a múltiplos gateways
- Armazenar estado local da feature

**❌ NÃO PODE:**
- Fazer chamadas HTTP diretas (deve usar gateways do core)
- Acessar `localStorage`/`sessionStorage` diretamente (deve usar serviços do core)
- Ser importado por `core/` ou `shared/`

---

### 2. `src/core/` (A Fundação)
Contém infraestrutura, dados e utilitários transversais. O Core serve às Features.

**✅ PODE:**
- Executar chamadas HTTP (Gateways)
- Gerenciar cache e persistência
- Expor contratos (Interfaces/Types)
- Fornecer utilitários globais (Formatadores, Loggers)
- Gerenciar estado global de autenticação (Auth Store)

**❌ NÃO PODE:**
- Validar regras de negócio
- Decidir se uma operação de negócio pode acontecer (deve apenas executar ou falhar)
- Conhecer detalhes de implementação de `features/`
- Importar de `features/`

---

### 3. `src/shared/` (Componentes Visuais)
Contém componentes de UI reutilizáveis, layouts e design system. Shared é "burro" em relação ao negócio.

**✅ PODE:**
- Renderizar UI baseado puramente em props
- Ter validações visuais (ex: input obrigatório, formato de email)
- Conter animações e micro-interações

**❌ NÃO PODE:**
- Conectar com stores diretamente (exceto talvez Theme/UI stores)
- Fazer decisões de negócio
- Chamar gateways ou APIs
- Importar de `features/`

---

## 🚦 Regras de Decisão (The "Who Decides" Rule)

### Regra de Ouro:
**"Se há um `if` que decide se o usuário pode fazer X, esse `if` deve estar em `features/`."**

#### Exemplo Prático: Reserva de Carro

**❌ Errado (Gateway decidindo):**
```typescript
// core/data/gateways/BookingGateway.ts
async createBooking(data) {
  if (data.startDate < new Date()) throw new Error("Data inválida"); // DECISÃO no Core
  return http.post('/bookings', data);
}
```

**✅ Correto (Feature decidindo):**
```typescript
// features/booking/services/BookingRules.ts
const canBook = (data) => data.startDate >= new Date();

// features/booking/views/Checkout.tsx
const handleBooking = async () => {
  if (!canBook(data)) showToast("Data inválida"); // DECISÃO na Feature
  await bookingGateway.createBooking(data); // EXECUÇÃO no Core
}
```

---

## 🔐 Autenticação e Estado

`core/auth` é responsável por MANTER e EXPOR o estado do usuário, mas não por decidir regras de acesso a features específicas.

**✅ Auth Store PODE:**
- `setUser(user)`
- `logout()`
- `isAuthenticated()`
- `getToken()`

**⚠️ Auth Store NÃO DEVE:**
- `canBookCar()` (Regra de Booking → `features/booking`)
- `isHostEligible()` (Regra de Fleet → `features/fleet`)

---

## 📦 Padrões de Importação

1. **Features** podem importar de: `core`, `shared`, e outras `features` (com cuidado).
2. **Core** só pode importar de: bibliotecas externas.
3. **Shared** só pode importar de: `core` (apenas types/utils, sem lógica) e bibliotecas externas.

---

## 🛠️ Contratos de Gateway

Gateways devem ser "burros". Eles apenas traduzem chamadas de método para chamadas HTTP/DB e retornam dados tipados.

**Padrão de Método:**
`executeAction(input): Promise<Output>`

Não adicione validação de negócio no Gateway. Se o backend retornar erro, lance o erro, mas não tente pré-validar regras que pertencem ao backend ou à feature.
