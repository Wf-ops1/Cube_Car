# Guia de Contribuição e Padrões Arquiteturais

Este documento define os "Guardrails" (guardas de proteção) para garantir que o código continue limpo, escalável e fácil de manter.

> **Para agentes de IA que atuam neste repositório:** este documento é sua referência de arquitetura. As regras aqui descritas são absolutas — não existe julgamento contextual que as substitua. Leia antes de qualquer modificação estrutural.

## 🏗️ Filosofia Central: "Quem manda e quem obedece"

Nossa arquitetura segue uma regra de ouro simples:

> **Features Decidem (Cérebro) | Core Executa (Músculo)**

### 🧠 Features (`src/features/*`)
Aqui vivem as **Regras de Negócio**.
- **Pode**: Tomar decisões, validar estados, orquestrar fluxos.
- **Não Pode**: Acessar banco de dados diretamente, chamar APIs externas diretamente (deve usar gateways).
- **Exemplo**: `BookingService.ts` decide se uma reserva pode ser aprovada.

### 💪 Core (`src/core/*`)
Aqui vivem os **Mecanismos de Execução**.
- **Pode**: Salvar no banco, chamar API, formatar datas, gerenciar autenticação global.
- **Não Pode**: Ter "opinião" ou regras de negócio complexas.
- **Exemplo**: `BookingGateway` apenas salva o status "APPROVED" no banco, sem perguntar "por quê?".

---

## 🚫 O Que Não Fazer (Anti-Patterns)

### 1. Gateway "Esperto"
Jamais coloque lógica de orquestração dentro de um Gateway.
```typescript
// ❌ ERRADO (Gateway decidindo e chamando outros serviços)
class BookingGateway {
  async approve(id) {
    if (status !== 'PENDING') throw Error; // Regra de negócio!
    await inventoryGateway.block(id);      // Orquestração!
    db.save(id, 'APPROVED');
  }
}

// ✅ CERTO (Gateway só executa dados)
class BookingGateway {
  async updateStatus(id, status) {
    db.save(id, status);
  }
}

// ✅ CERTO (Service orquestra)
class BookingService {
  async approve(id) {
    // Valida
    if (booking.status !== 'PENDING') throw Error;
    // Side effects
    await inventoryGateway.block(booking.carId);
    // Persiste
    await bookingGateway.updateStatus(id, 'APPROVED');
  }
}
```

### 2. Imports Cruzados em Core
`src/core/data/booking` NÃO deve importar `src/core/data/inventory`.
Se dois domínios precisam conversar, quem faz a ponte é um **Service** na camada de `features`.

---

## 🎯 Quando Criar Camadas (Decisão Rápida)

| Precisa de... | Crie... | Exemplo |
|---------------|---------|---------|
| Orquestrar múltiplos domínios | Service | `BookingService` coordena inventory + wallet |
| Estado da feature | Store (Zustand) | `useBookingStore()` |
| Apenas buscar/salvar dados | Use Gateway direto | `carGateway.getAll()` |
| Componente visual reutilizável | Shared component | `shared/ui/Button` |

### Regra de Ouro
**Service só quando houver orquestração ou regra de negócio complexa.**

Se é só CRUD → Gateway direto na View.  
Se precisa coordenar 2+ coisas → Service.

### Exemplo Real: Por que `BookingService` existe?
Porque aprovar booking requer:
1. ✅ Validar status (regra de negócio)
2. ✅ Bloquear carro (`inventoryGateway`)
3. ✅ Creditar dono (`walletGateway`)
4. ✅ Notificar motorista (`notificationStore`)

Se fosse só "salvar booking_id" → usaríamos Gateway direto.

---

## 📂 Estrutura de Pastas

```
src/
├── features/           # Funcionalidades (Booking, Fleet, Profile)
│   └── booking/
│       ├── services/   # Lógica de Negócio e Orquestração (BookingService.ts)
│       └── views/      # Componentes React (Telas)
├── core/
│   └── data/           # Acesso a Dados (Gateways)
│       ├── gateways/   # Implementações "Burras" (Mock/API)
│       └── contracts/  # Interfaces (Contratos)
└── shared/
    └── components/
        └── visuals/    # Componentes UI Puros (Botões, Cards) - SEM Lógica de Negócio
```

## ✅ Checklist de Code Review

Antes de abrir um PR, verifique:
1. [ ] Meu Gateway tem algum `if` que valida regra de negócio? (Se sim, mova para Service).
2. [ ] Meu componente visual em `shared` está importando algo de `features`? (Proibido!).
3. [ ] Estou orquestrando múltiplos domínios (Booking + Wallet) dentro de um arquivo de infraestrutura? (Mova para Service).
4. [ ] O código introduz algum débito técnico ou mock não documentado? (Se sim, justifique com comentário e isole em arquivo `*.mock.ts` ou `dev-mocks.ts`).

---
*Mantenha o código limpo, e a manutenção será um passeio.* 
