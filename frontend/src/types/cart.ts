import type { Product } from "./product";

export interface CartItem {
    id: number;
    product: Product;
    quantity: number;
    totalPrice: number;
}

export interface Cart {
    id: number;
    items: CartItem[];
    totalItems: number;
    totalAmount: number;
    userId?: number;
}