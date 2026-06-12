# EPIC-03: Centro de Verificação e Confiança (Verification Center)

**Status**: Draft
**Priority**: Critical (For Trust)
**Owner**: Analyst (Mary)

## Description
O Centro de Verificação é o hub de confiança da plataforma. É onde usuários "Upam" seu nível para poder alugar carros melhores ou se tornarem anfitriões. A experiência deve ser séria, segura, mas com feedback visual claro de progresso ("Gamificação da Confiança").

## Business Value
- **Segurança da Frota**: Garante que apenas motoristas habilitados aluguem carros.
- **Redução de Fraude**: Verificação de identidade inibe perfis falsos.
- **Experiência Premium**: Um processo de verificação fluido reforça a seriedade da marca "Elite".

---

## User Stories

### US-01: Dashboard de Status de Verificação
**Como** usuário,
**Quero** ver claramente qual meu nível atual de verificação e o que falta para o próximo nível,
**Para que** eu saiba por que certos carros estão bloqueados para mim.

**Acceptance Criteria:**
- [ ] Tela "Centro de Verificação" acessível via ProfileHub.
- [ ] Indicador visual de Status: "Pendente", "Em Análise", "Verificado", "Rejeitado".
- [ ] Lista de requisitos: E-mail (Verificado), Telefone (Verificado), CNH (Pendente), Selfie (Pendente).
- [ ] Badge visual "Verificado" que será exibido no perfil público após conclusão.

### US-02: Upload de Documentos (CNH)
**Como** motorista,
**Quero** enviar fotos da minha CNH (frente e verso),
**Para que** a plataforma valide minha habilitação para dirigir.

**Acceptance Criteria:**
- [ ] Interface de upload para Frente e Verso da CNH.
- [ ] Feedback visual durante o upload (progress bar).
- [ ] Estado "Em Análise" após envio bem-sucedido.
- [ ] Instruções claras sobre legibilidade (sem reflexo, bordas visíveis).

### US-03: Selfie de Validação (Liveness)
**Como** plataforma (requisito de segurança),
**Quero** que o usuário envie uma selfie atual,
**Para que** eu possa comparar com a foto do documento e garantir que ele é quem diz ser.

**Acceptance Criteria:**
- [ ] Interface de captura de câmera ou upload de selfie.
- [ ] Feedback visual de "Rosto detectado" (se possível via IA no futuro, ou apenas UX de upload por enquanto).
- [ ] Armazenamento seguro desta imagem (privacidade rigorosa).
