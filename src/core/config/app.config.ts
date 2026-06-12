export const APP_CONFIG = {
    DEFAULT_AVATAR: 'https://i.pravatar.cc/150',
    getAvatarUrl: (id?: string) => `https://i.pravatar.cc/150${id ? `?u=${id}` : ''}`
};
