export const AUTH_CONFIG = {
    PASSWORD: {
        MIN_LENGTH_LOGIN: 6,
        MIN_LENGTH_SIGNUP: 10,
        REQUIRE_LETTER: true,
        REQUIRE_NUMBER: true,
        REQUIRE_SPECIAL: true,
    },
    EMAIL: {
        MIN_LENGTH: 5,
    },
    TIMEOUTS: {
        LOGIN_TIMEOUT_MS: 10000,
        SIGNUP_TIMEOUT_MS: 15000,
    },
    DEMO: {
        ENABLED: process.env.NODE_ENV === 'development',
        EMAIL: 'novo@cubecar.com',
    },
} as const;
