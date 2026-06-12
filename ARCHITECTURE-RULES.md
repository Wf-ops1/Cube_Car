# 🧊 Cube Car — Contrato de Arquitetura Frontend

Este documento define regras obrigatórias de arquitetura para o estágio **Enterprise-Lite**. O objetivo é manter o padrão de **Vertical Slicing (Feature-First)** impecável, suportar escala horizontal sem colisão de código e obrigar o respeito irrestrito a contratos E2E.

---

## 1. Regra de Ouro (Isolamento por Feature)
**Uma Feature NUNCA importa outra Feature.**
O projeto é fatiado verticalmente. O fluxo de aluguel (`features/booking`) não pode importar regras internas do fluxo de pagamento (`features/wallet`).
- Se duas features precisam compartilhar o mesmo dado/lógica centralizada, a competência sobe para os `providers` no `core` ou a UI deve compor os blocos via `children` (Inversão de Controle) em nível de página/view.
- Componentes visuais muito parecidos? Promova-os para `shared/components/domain` ou `shared/components/ui`.

---

## 2. Camadas do Sistema (O Padrão Atual)

### 🚀 Features (A Espinha Dorsal)
Cada funcionalidade de negócio é tratada como um micro-app. Dentro de `src/features/[nome_da_feature]`, as regras são estritas:
- **`services/` (A Fronteira E2E):** Contratos de API-First fortes. Implementações de DTOs (Data Transfer Objects) e chamadas via network. Não vazam lógicas globais para os hooks imperativamente.
- **`hooks/` (A Lógica de Domínio):** Consomem os `services` e orquestram estado (`useState`, `useStore`).
  - ❌ A UI confia **cegamente** no hook. 
  - ✅ O hook não sabe se existe Tailwind ou React Native chamando-o. Ele apenas fornece dados e ações (`mutate()`, `car`, `isLoading`).
- **`components/` & `views/` (A Projetura Visual):**
  - ❌ Proibido injetar fluxos maciços de validação ou `fetching` complexo diretamente no meio do layout JSX. Layout deve ser mudo.
- **`schema.ts` e `types.ts`:** Fonte da verdade tipada rigorosamente em Zod para blindar o payload do backend.

### 🏛️ Core (A Infraestrutura Agnóstica)
O diretório `src/core` **NÃO** guarda regras de negócios de domínios específicos (isso agora vive dentro das `features`).
- Contém a infraestrutura basal (Sistema de Roteamento, Clientes Globais de API/Supabase interceptados, State Providers como Zustand na raiz e Auth AuthZ).

### 🧱 Shared (Reuso Puritano)
- **`shared/components/ui/`:** Peças Legos atômicas (Button, Input). 
  - ❌ Componentes cegos. Não podem fazer *fetch*, não importam Types complexos de Features.
- **`shared/components/domain/`:** Peças visuais universais que carregam uma semântica de negócio (ex: o card visual de um "Carro" vazio, consumido por todas as features).

---

## 3. Exemplos Práticos: Do Legado ao Moderno

### Responsalibidade de View vs Hooks
Ao invés de tentar misturar chamadas assíncronas no componente visual, separe a intenção em hooks. 

❌ **Visão Quebrada (Anti-Pattern de Acoplamento)**
```tsx
import { api } from '@/core/api'; // UI não deve fazer o fetch diretamente
import { z } from 'zod'; // UI formatando payload é má prática

export function BookingScreen() {
  const handleBooking = async () => {
     // Lógica exposta vazando no layout
     const data = await api.post('/book', { id: 123 });
  }
  return <button onClick={handleBooking}>Reservar</button>;
}
```

✅ **Visão Blindada (Vertical Slicing Pattern)**
```tsx
import { useBookingWizard } from '../hooks/useBookingWizard'; // Lógica enclausurada e reaproveitável

export function BookingScreen() {
  const { handleBooking, isSubmitting } = useBookingWizard();
  
  return <button disabled={isSubmitting} onClick={handleBooking}>Reservar</button>;
}
```

---

## 4. O Fim da Tolerância com Dados Soltos (Mocks e Hardcode)
- Mocks para descobertas (Discovery) criados no momento do design são válidos apenas dentro de pastas isoladas ou arquivos descritos como explícitos (ex: `dev-mocks.ts`).
- Eles **NÃO PODEM VAZAR** como estado padrão do aplicativo. Se um serviço não estiver pronto, use Contratos Restritos via TypeScript/Zod para garantir que quando a API for finalmente plujgada o UI irá funcionar imediatamente (E2E First).
- Nenhuma feature deve ser dada como entregue na Production Branch sem ao menos seus contratos API-First e o fluxo testáveis configurados no repositório.
