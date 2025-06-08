export const API_ENDPOINTS = {
    CATALOG: '/api/catalog',
    ORDERS: '/api/orders'
} as const;

export const STORAGE_KEYS = {
    CART: import.meta.env.VITE_BOOKSTORE_STATE_KEY || 'BOOKSTORE_STATE'
} as const;