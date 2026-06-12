# EPIC-01: Gestão de Perfil Público e Apresentação (Profile Management)

**Status**: Draft
**Priority**: High
**Owner**: Analyst (Mary)

## Description
Este Épico abrange todas as funcionalidades relacionadas à identidade pública do usuário no ecossistema Cube Car. O foco é permitir que os usuários gerenciem como são vistos por outros (foto, nome, bio) e, crucialmente para Proprietários, como eles se apresentam nas listagens de seus veículos para gerar confiança.

## Business Value
- **Confiança**: Perfis completos com fotos e biografias aumentam a taxa de conversão de aluguel.
- **Personalização**: Permite que a plataforma pareça mais humana e menos transacional.
- **Identidade Premium**: Reforça o conceito de "Elite" ao permitir que proprietários destaquem seus diferenciais.

---

## User Stories

### US-01: Editar Informações Básicas de Perfil
**Como** usuário da plataforma,
**Quero** poder atualizar minha foto de perfil, nome de exibição e cidade,
**Para que** eu possa manter minha identidade atualizada e reconhecível.

**Acceptance Criteria:**
- [ ] O usuário pode acessar a tela "Editar Perfil" a partir do ProfileHub.
- [ ] Deve haver um formulário para editar: Nome, Sobrenome (opcional na view, obrigatório no backend), Cidade/Estado.
- [ ] O usuário pode fazer upload de uma nova foto de perfil (Update Avatar).
- [ ] A foto deve ser exibida imediatamente após o upload (preview or optimistic update).
- [ ] Salvar deve persistir os dados no backend (Supabase `auth.users` metadata ou tabela `profiles`).

### US-02: Adicionar Biografia do Proprietário ("About Me")
**Como** Proprietário (Host),
**Quero** escrever uma breve apresentação sobre mim e minha paixão por carros,
**Para que** os locatários sintam mais confiança e conexão ao verem meu carro.

**Acceptance Criteria:**
- [ ] Campo "Bio" ou "Sobre Mim" adicionado à tela de "Editar Perfil".
- [ ] Limite de caracteres razoável (ex: 300 caracteres) para manter a concisão.
- [ ] O campo deve permitir emojis para personalização.
- [ ] Persistência segura no banco de dados.

### US-03: Exibir Bio do Proprietário nos Detalhes do Carro
**Como** Locatário,
**Quero** ver a apresentação do dono do carro na tela de detalhes (CarDetails),
**Para que** eu saiba de quem estou alugando e sinta que o carro é bem cuidado.

**Acceptance Criteria:**
- [ ] Na view `CarDetails`, abaixo do header do proprietário, exibir a Bio se ela existir.
- [ ] Design sutil ("Quiet Luxury"): Texto em itálico ou dentro de um bloco quote minimalista.
- [ ] Se o proprietário não tiver Bio, a seção deve ser ocultada (não mostrar "undefined").
