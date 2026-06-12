# Inventário de Gateways e Auditoria de Responsabilidades

> **Data da Auditoria**: 2026-01-17
> **Status**: FASE 1 COMPLETA
> **Objetivo**: Identificar violações de arquitetura onde Gateways decidem ou orquestram regras de negócio.

---

## 🚨 Descobertas Críticas (Violações)

### 🔴 `booking.gateway.mock.ts` (RESOLVIDO ✅)
Este arquivo violava gravemente o princípio "Gateway só executa", mas foi refatorado.
- **Violação 1 (Orquestração)**: ~~Chama `inventoryGateway`, `walletGateway` e `notificationStore`.~~ (Resolvido: Movido para `BookingService`)
- **Violação 2 (Regra de Negócio)**: ~~`validateTransition` decide se o status pode mudar.~~ (Resolvido: Movido para `BookingService`)
- **Violação 3 (Retries/Rollback)**: ~~Implementa lógica complexa de transação distribuída simulada.~~ (Resolvido: Gateway agora é "dumb")

---

## 📋 Inventário Geral

| Gateway | Localização | Status | Observações |
|---------|-------------|--------|-------------|
| `BookingGatewayMock` | `core/data/gateways/mock/` | 🟢 OK | Refatorado para ser apenas Data Store. Lógica movida p/ `BookingService`. |
| `CarGateway` | `core/data/car/` | 🟡 MÉDIO | Define valores default (`rating: 5.0`) e IDs. Aceitável p/ Mock, mas idealmente seria no Service. |
| `MockAuthGateway` | `core/data/gateways/mock/` | 🟢 OK | Apenas simula latência e retorna dados. |
| `FleetGateway` | `core/data/car/` | 🟡 MÉDIO | Verificar se `save` valida dados. |
| `InventoryGateway` | `core/data/car/` | 🟢 OK | Parece focar apenas em disponibilidade. |
| `WalletGateway` | `core/data/gateways/` | 🟢 OK | Gerencia saldo, parece anêmico (correto). |

---

## 🛠️ Plano de Ação (Para Fase 2/3)

### 1. Refatorar `BookingGatewayMock`
Criar `features/booking/logic/BookingOrchestrator.ts`:
```typescript
class BookingOrchestrator {
  async approveBooking(bookingId) {
    // 1. Validar
    const booking = await bookingGateway.getById(bookingId);
    if (booking.status !== 'PENDING') throw new Error("Status inválido");

    // 2. Executar (Gateway)
    await bookingGateway.setStatus(bookingId, 'APPROVED');

    // 3. Side Effects (Orquestrador)
    await inventoryGateway.markUnavailable(booking.carId);
    await walletGateway.addCredit(...);
  }
}
```

### 2. Isolar Gateways
Garantir que um Gateway NUNCA importe outro Gateway. Eles devem ser cegos uns aos outros.
