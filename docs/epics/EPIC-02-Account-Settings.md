# EPIC-02: Configurações da Conta e Segurança (Account Settings)

**Status**: Draft
**Priority**: Medium
**Owner**: Analyst (Mary)

## Description
Este Épico foca na "Casa de Máquinas" da conta do usuário. Diferente do perfil público, estas são configurações privadas, de segurança e de preferências de sistema. O objetivo é fornecer controle total ao usuário sobre sua privacidade e segurança.

## Business Value
- **Segurança**: Reduz o risco de account takeover através de boas práticas de gestão de credenciais.
- **Compliance**: Garante que o usuário possa gerenciar seus dados e privacidade (LGPD).
- **Retenção**: Usuários que controlam suas notificações tendem a não desinstalar o app por incômodo.

---

## User Stories

### US-01: Gestão de Credenciais e Segurança
**Como** usuário,
**Quero** alterar minha senha e ver opções de login,
**Para que** eu possa manter minha conta segura.

**Acceptance Criteria:**
- [ ] Tela "Configurações da Conta" acessível via ProfileHub.
- [ ] Seção "Login e Segurança".
- [ ] Funcionalidade de "Alterar Senha" (requer senha atual).
- [ ] Visualização do e-mail cadastrado (geralmente read-only ou fluxo complexo de troca).
- [ ] Botão "Sair de todos os dispositivos" (opcional para primeira versão, mas desejável).

### US-02: Preferências de Notificação
**Como** usuário,
**Quero** escolher quais tipos de notificação quero receber (Email, Push, SMS),
**Para que** eu não seja bombardeado com mensagens irrelevantes.

**Acceptance Criteria:**
- [ ] Toggles para: "Promoções", "Atualizações de Viagem", "Mensagens do Chat".
- [ ] As configurações devem ser salvas no perfil do usuário.

### US-03: Excluir Conta (Danger Zone)
**Como** usuário insatisfeito ou que não usa mais o serviço,
**Quero** ter a opção de excluir minha conta,
**Para que** eu possa remover meus dados da plataforma.

**Acceptance Criteria:**
- [ ] Botão "Excluir Conta" em área destacada (vermelho/perigo).
- [ ] Modal de confirmação com step extra (digitar "DELETAR" ou senha).
- [ ] Feedback visual claro de que a ação é irreversível.
