import type { Product } from "./product";

export interface Order {
    id: number;
    orderNumber: string;
    userId: number;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    shippingAddress: Address;
    billingAddress: Address;
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    id: number;
    product: Product;
    quantity: number;
    price: number;
    totalPrice: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Address {
    id?: number;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}
