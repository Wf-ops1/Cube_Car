# Project Context: Cube Car 77

## 1. Governança e Alicerces (CRÍTICO)
Este projeto é regido por diretrizes rigorosas baseadas nos perfis dos seguintes agentes especialistas:
- **Mary (Analista):** Foco em traduzir requisitos E2E (End-to-End) em critérios de aceite verificáveis e conectando as jornadas de todas as personas (Proprietário e Locatário) de ponta a ponta sem atritos visuais ou funcionais.
- **Winston (Arquiteto):** Foco pragmático na criação de contratos E2E precisos e Débito Técnico contido/intencional (Zero "Tech Debt" oculto). Ele blinda o repositório garantindo o API-First design para que componentes não dependam de lógicas zumbis.
- **John (PM):** Guardião do valor de negócio. Ele defende que mockups podem existir *apenas* temporariamente em *Discovery* (para experimentar ux), mas são terminantemente banidos de *Delivery* e da branch de produção.
- **Amelia (Dev):** A execução ruthlessly pragmática. Exige testes E2E e cobertura real das integrações. Qualquer payload "hardcoded" esquecido num service que não seja um mock declarado temporário é considerado quebra de build.

Todos os agentes de implementação DEVEM se alinhar a esses norteadores.

---

## 2. Estágio Atual do Projeto (MVP Enterprise-Lite)
Não estamos mais na fase de prototipação ou de refatoração de dívidas técnicas básicas. O projeto amadureceu. O foco absoluto deste projeto é a **entrega de um produto maduro, escalável e com integração End-to-End (E2E) completa** conectando perfeitamente a jornada do proprietário do veículo à do locatário.

Apesar de ser a nossa primeira versão comercial (MVP), o padrão de entrega exigido é o de um sistema **Enterprise-lite**:
- **Zero código genérico** ou "pontas soltas" em áreas core.
- **Zero mockups definitivos em produção** (Mocks são banidos em Delivery; os fluxos devem estar integrados ou respeitar contratos API rígidos).
- **Débito Técnico zero não-intencional** (Pendências estruturais que limitem o roadmap estão barradas; se houver débito temporário para MVP, ele deve ser isolado e documentado).
- **Fé cega eliminada por testes** (A garantia E2E não é apenas uma diretriz, deve ser apoiada por estabilidade nos testes).

### 2.1 Stack Tecnológico Oficial (MANDATÓRIO)
Todas as implementações devem obrigatoriamente utilizar o seguinte stack, conforme definido no `package.json`:
- **Frontend Framework:** React 19
- **Build Tool / Bundler:** Vite
- **Estilização:** Tailwind CSS v3.4 + PostCSS + Autoprefixer
- **Gerenciamento de Estado Global:** Zustand v5
- **Animações e Micro-interações:** Framer Motion v11
- **Ícones:** Lucide React
- **Validação de Dados:** Zod v4
- **Inteligência Artificial & ML:** `@google/genai`, TensorFlow.js (`@tensorflow/tfjs`, `@tensorflow-models/blazeface`), Tesseract.js
- **Testes:** Vitest + React Testing Library

---

## 3. Padrão Arquitetural Atual (Vertical Slicing, DDD, e API-First)
No passado, o projeto necessitou refatorações para separar forte acoplamento (lógica misturada na UI). Esse problema foi **vencido**. 

Atualmente, o repositório é sustentado por excelência arquitetural garantindo separação rigorosa de responsabilidades. O projeto adota **Vertical Slicing e Feature-First design**, sendo vital expandir novas funcionalidades mantendo a integridade dessa estrutura:

### 3.1 Camadas Fundamentais
1. **Estado:** Diferenciação clara entre estado local (UI form), estado compartilhado (Zustand stores), e remoto.
2. **Lógica/Hook:** Regras de domínio e mapeamentos complexos devem ser encapsulados em actions (hooks customizados `use*`) isolados da renderização.
3. **Integração (Contratos Estritos):** `Services` operam contratos fortes (`API-first`). Dados temporários devem ser obrigatoriamente tipados e não podem estar misturados no escopo do componente ou vazados como soluções permanentes.
4. **UI (Apresentação):** Consome os hooks e não toma decisão de negócio. 

### 3.2 Estrutura de Pastas
O projeto segue a divisão de domínios explícita:
```text
src/
 ├── core/           // Núcleo agnóstico (Auth, Clientes de API globais, Roteamento)
 ├── features/       // Funcionalidades isoladas baseadas em domínio de negócio (car, booking, profile, dashboard, wallet, etc.)
 │   └── [feature]/
 │       ├── components/    // UI restrita da funcionalidade (ex: CarCard)
 │       ├── hooks/         // Casos de uso e lógica da funcionalidade (ex: useCarSearch)
 │       ├── services/      // Contratos de API E2E e chamadas remotas
 │       ├── stores/        // Gerenciamento de estado global da funcionalidade via Zustand
 │       ├── views/         // Telas inteiras (páginas baseadas no domínio)
 │       ├── wizards/       // Fluxos sequenciais complexos (ex: Cadastro de Carro em etapas)
 │       ├── types.ts       // Tipos de domínio estritos em Zod/TypeScript
 │       └── schema.ts      // Regras de validação restritivas
 ├── shared/         // Botões, Inputs universais, utilitários, e componentes de Layout puros
```

---

## 4. Diretrizes para Geração de Código
- **Modularização Categórica:** Nunca criar componentes JSX extensos misturando layout com conversão (parsing) de dados da API ou chamadas diretas a estados complexos.
- **Evidências de Integração (E2E):** Toda feature desenvolvida sob o manto do MVP Enterprise-lite só está "pronta" se a ação correspondente testada (ex: Alterar Status de Pagamento) disparar a reação na visão da outra ponta do marketplace sem travamentos.
- **Substituição Fácil:** A camada de `services` deve nascer blindada por interfaces para ser injetável/revisável e suportar uma conexão de backend simples.

*Este documento é a autoridade suprema para expectativas técnicas e obrigatoriamente deve ser lido por todos os agentes antes de executar mudanças sistêmicas.*

---

## 5. Protocolo de Iteração de Design (MANDATÓRIO)
Ao criar, sugerir ou codificar qualquer interface ou estrutura visual, você (IA) deve obrigatoriamente executar um ciclo de validação estruturada antes de apresentar o código/resultado final.

Para comprovar esse ciclo, inicie sua resposta com um bloco de análise técnica (<design_rationale>) seguindo as três fases abaixo:

### Fase 1 — Construção Fundamentada:
Modele a estrutura focando em fricção zero. Quais princípios de design (hierarquia visual, proximidade, densidade informacional) guiam essa interface?
**Regra estrita:** É proibido o uso de componentes ou códigos genéricos (ex: placeholders sem estilo) em blocos críticos. Cada decisão deve fazer sentido no contexto de Mobilidade/Locação P2P.

### Fase 2 — Auditoria Anti-Repetição & Contexto:
A solução reflete a maturidade de um produto Enterprise-Lite ou parece um wireframe descuidado de fase embrionária?
Ao adicionar profundidade funcional (ex: detalhes do carro, gestão de reservas), o usuário ainda mantém o contexto de onde está no painel de locação ou hospedagem?

### Fase 3 — Validação de Clareza e Controle:
O estado atual ou a ação principal da tela (Call to Action) é identificável em menos de 1 segundo?
Há alguma informação de backend (IDs crus, logs, jargões de banco de dados) poluindo a UI do usuário final? Se sim, remova ou traduza para a linguagem do usuário.

**Critério de Parada e Saída Final:**
Apenas após preencher o bloco `<design_rationale>` passando por essas três fases, apresente a estrutura visual ou o código da interface.
**Regra de Ouro:** Não entregue soluções preguiçosas que gerem "tech debts de UI". Se a solução não atingir a excelência de navegação exigida, refaça o racional antes de me responder.
