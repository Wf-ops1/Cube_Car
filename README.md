<div align="center">

# 🧊 Cube Car

### O marketplace de mobilidade P2P construído para escalar.

*Conectando proprietários de veículos a quem precisa de transporte — com a experiência fluida dos dois lados.*

---

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![Status](https://img.shields.io/badge/Status-MVP_Ativo-22C55E?style=for-the-badge)]()

</div>

---

## 🚀 O Produto

**Cube Car** é uma plataforma de Car Sharing Peer-to-Peer que resolve dos dois lados do problema de mobilidade urbana:

- **Para quem tem carro parado:** transformar um ativo ocioso em renda, com controle total da frota, agenda e pagamentos em um único painel.
- **Para quem precisa de um carro:** encontrar, reservar e pagar por um veículo próximo em minutos, sem burocracia.

---

## 🧭 Por que essa arquitetura?

O Cube Car foi desenvolvido como um MVP — mas não como um MVP descartável.

A maioria dos projetos gerados com IA prioriza velocidade acima de tudo e resulta em um amontoado de arquivos sem direção: funciona, mas qualquer mudança vira um risco. Este projeto tomou um caminho diferente. Passou por diversas revisões estruturais deliberadas para garantir organização, previsibilidade e facilidade de manutenção a longo prazo.

A motivação não foi complexidade por ego ou vaidade técnica. Foi uma decisão de founder: **prefiro investir meu tempo entendendo clientes, validando hipóteses e evoluindo o negócio — não refatorando código toda semana.**

A arquitetura existe para permitir isso. 13 módulos de produto isolados, cada um evoluindo de forma independente, com uma base de infraestrutura que suporta a integração de backend quando chegar a hora — sem reescrever nada.

O processo de construção foi simultâneo: discovery e delivery acontecendo em paralelo, com agentes de IA como parceiros de execução e revisão contínua de estrutura. O resultado é um produto que pode ser mantido com atenção parcial enquanto o foco real fica onde deveria estar.

### Orquestrado com BMAD

O desenvolvimento foi conduzido com o framework **BMAD (Business-Minded Agile Development)** — um sistema de agentes de IA com papéis especializados em análise de produto, arquitetura, PM e engenharia. O papel do founder foi o de **orquestrador**: definir a visão, revisar decisões e garantir que velocidade não comprometesse estrutura. O que normalmente exigiria uma equipe multidisciplinar foi operacionalizado por agentes com contratos de entrega definidos e revisão humana em cada etapa crítica.

---

## 🎯 Visão de Produto & Negócio

### O Problema
O mercado de mobilidade P2P ainda carece de plataformas que resolvam simultaneamente a experiência do **proprietário** (confiança, controle, pagamento) e do **locatário** (descoberta, reserva, verificação de segurança) sem atritos entre os dois lados.

### A Solução
Uma plataforma de dois lados com **journeys completamente conectadas E2E** — a ação do locatário ao confirmar uma reserva dispara automaticamente as reações corretas no painel do proprietário, na carteira digital e no sistema de notificações.

### Personas

| Persona | Papel | Jornada Principal |
|---|---|---|
| 👨‍💼 **Roberto** | Proprietário / Host | Cadastra veículos, gerencia frota e reservas, acompanha pagamentos |
| 🧑‍💻 **Alex** | Locatário | Busca, filtra, reserva e paga por veículos próximos |
| 👩 **Mariana** | Usuária Geral | Cria conta, verifica identidade, gerencia perfil e reputação |

---

## ✨ Diferenciais do Produto

### 🧠 Assistente de Busca com IA
O Cube Car tem um assistente nativo alimentado pelo **Gemini 2.5 Flash** com contexto geográfico em tempo real via Google Maps. O locatário descreve a viagem em linguagem natural e o sistema sugere veículos, destinos e pontos de retirada — sem precisar saber o nome da rua.

### 👁️ Verificação Inteligente de Identidade
O processo de KYC (Know Your Customer) usa **reconhecimento facial** (TensorFlow.js + BlazeFace) combinado com **OCR de documentos** (Tesseract.js) para verificar identidade sem fricção. Segurança para o proprietário, rapidez para o locatário.

### 💳 Carteira Digital Integrada
Pagamentos, créditos e repasses gerenciados dentro da plataforma — sem depender de soluções externas na camada de produto. A wallet é uma feature isolada com contrato API-First, pronta para plugar qualquer gateway de pagamento.

### 💬 Mensagens Diretas
Chat em tempo real entre locatário e proprietário integrado ao fluxo de reserva — negociação, confirmação e suporte sem sair da plataforma.

### ⭐ Sistema de Reputação Bilateral
Avaliações nos dois sentidos — o locatário avalia o carro, o proprietário avalia o locatário. Reputação como ativo da plataforma, não apenas uma métrica de vanidade.

---

## 🗺️ Arquitetura do Produto (Fluxo E2E)

```
         PROPRIETÁRIO                          LOCATÁRIO
              │                                    │
    ┌─────────▼──────────┐             ┌───────────▼────────┐
    │  Host Dashboard    │             │  Catálogo + Busca  │◄── 🧠 AI Gemini
    │  Gestão de Frota   │             │  (Filtros em tempo │
    └─────────┬──────────┘             │   real)            │
              │                        └───────────┬────────┘
              │                                    │
    ┌─────────▼──────────────────────────────────▼────────┐
    │                  BOOKING ENGINE                      │
    │         (Fluxo de reserva E2E — o coração)          │
    └───────┬────────────────────────────────┬────────────┘
            │                                │
    ┌───────▼────────┐              ┌────────▼───────────┐
    │ Wallet /       │              │ Verificação / KYC  │◄── 👁️ OCR + Facial
    │ Pagamentos     │              │ (Wizard guiado)    │
    └───────┬────────┘              └────────┬───────────┘
            │                                │
    ┌───────▼────────────────────────────────▼───────────┐
    │           Notificações + Mensagens + Reputação      │
    └────────────────────────────────────────────────────┘
```

---

## 🏗️ Decisões Técnicas que Importam para o Produto

> Esta seção existe porque decisões de arquitetura **são** decisões de produto.

### Feature-First (Vertical Slicing)
Cada capacidade de negócio vive isolada em seu próprio módulo (`booking`, `wallet`, `verification`, etc.). Isso significa que **uma feature pode evoluir ou ser substituída sem regredir as outras** — fundamental para um roadmap ágil.

### API-First Design (Backend Plug-and-Play)
A camada de dados opera com contratos TypeScript/Zod estritos, independente de qualquer backend. Quando chegar a hora de integrar um backend real (Supabase, Firebase, próprio), **nenhuma linha de UI ou regra de negócio precisa mudar** — só os services.

### Zero Tech Debt Intencional
Nenhuma pendência estrutural oculta. O débito técnico temporário (ex: mocks de descoberta) é isolado, documentado e banido das branches de produção. A regra é simples: **se não está testável, não está entregue**.

### Estrutura Modular (13 domínios de negócio)

O produto é construído sobre 13 módulos independentes — `booking`, `wallet`, `verification` (KYC), `messaging`, `reputation`, `host-management` e outros — cada um isolado com sua própria lógica, estado e contratos de dados. Nenhuma mudança em um módulo afeta os demais.

→ Detalhe completo de cada módulo: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)

---

## 🛠️ Stack Tecnológico

| Camada | Tecnologia | Decisão de Produto |
|---|---|---|
| **UI Framework** | React 19 + TypeScript | Componentes previsíveis, tipagem que blinda bugs em produção |
| **Build & DX** | Vite 6 | Dev server instantâneo, build otimizado |
| **Estilização** | Tailwind CSS 3.4 | Design system consistente em toda a plataforma |
| **Estado Global** | Zustand 5 | Estado simples, sem boilerplate que atrasa features |
| **Animações** | Framer Motion 11 | Micro-interações que elevam a percepção de qualidade |
| **AI & LLM** | Google Gemini 2.5 Flash | Assistente de busca com grounding geográfico |
| **Visão Computacional** | TensorFlow.js + BlazeFace | Verificação facial no browser, sem servidor |
| **OCR** | Tesseract.js | Leitura de documentos no cliente |
| **Validação** | Zod 4 | Contratos de dados rigorosos, tipo-seguros |
| **Testes E2E** | Playwright | Cobertura real das jornadas críticas |
| **Testes Unit** | Vitest + Testing Library | Lógica de domínio testada isoladamente |

---



## 🧱 Como o Código é Organizado

O projeto é dividido em **3 camadas** com responsabilidades claras e sem sobreposição:

| Camada | O que vive aqui | Analogia |
|---|---|---|
| **`core/`** | Infraestrutura: autenticação, clientes de API, IA, roteamento, gateways de dados | O motor do carro — você não toca nele todo dia, mas tudo depende dele |
| **`features/`** | As 13 capacidades de negócio do produto (booking, wallet, messaging...) | Os departamentos de uma empresa — cada um cuida do seu escopo |
| **`shared/`** | Design system, tipos e utilitários reutilizáveis por todas as features | A identidade visual e o vocabulário comum |

> A regra de ouro: **features não conversam diretamente entre si.** Toda comunicação passa pelo `core` ou por composição de tela. Isso garante que mudar o fluxo de pagamento nunca quebre o fluxo de reservas.

Para detalhes técnicos completos: [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)

---

## 🗺️ Roadmap

| Status | Marco |
|---|---|
| ✅ | Arquitetura modular e escalável estabelecida |
| ✅ | 13 módulos de feature estruturados |
| ✅ | Integração com Gemini AI (busca + Google Maps) |
| ✅ | Verificação KYC (OCR + Facial Recognition) |
| ✅ | Booking Engine E2E |
| ✅ | Wallet, Messaging, Notifications, Reputation |
| 🔄 | Integração com backend (Supabase / API própria) |
| ✅ | Deploy na Vercel |
| 📋 | App Mobile (React Native) |

---

<div align="center">

*Cube Car — Mobilidade com intenção.*

</div>
