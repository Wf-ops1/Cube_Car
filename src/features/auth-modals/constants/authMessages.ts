export const AUTH_MESSAGES = {
    ERROR: {
        EMAIL_REQUIRED: 'Email é obrigatório',
        EMAIL_INVALID: 'Email inválido',
        PASSWORD_REQUIRED: 'Senha é obrigatória',
        PASSWORD_TOO_SHORT: 'Senha muito curta',
        PASSWORD_WEAK: 'Senha não atende aos requisitos de segurança',
        NAME_REQUIRED: 'Nome é obrigatório',
        RATE_LIMIT: 'Muitas tentativas. Tente novamente em 1 minuto.',
        INVALID_CREDENTIALS: 'Email ou senha incorretos',
        NETWORK_ERROR: 'Erro ao conectar. Tente novamente.',
    },
    SUCCESS: {
        LOGIN: 'Login realizado com sucesso!',
        SIGNUP: 'Conta criada com sucesso!',
        PASSWORD_RESET_SENT: 'Email de recuperação enviado!',
    },
} as const;
