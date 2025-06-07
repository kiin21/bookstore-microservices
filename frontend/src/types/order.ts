import type { Product } from "./product";


export interface OrderItem {
    id: number;
    product: Product;
    quantity: number;
    price: number;
    totalPrice: number;
}

export interface OrderSummary {
    orderNumber: string;
    status: OrderStatus;
}

interface Customer {
    name: string;
    email: string;
    phone: string;
}

interface OrderItemResponse {
    code: string;
    name: string;
    price: number;
    quantity: number;
    totalPrice: number;
}

export interface OrderDetails {
    orderNumber: string;
    user: string;
    items: OrderItemResponse[];
    customer: Customer;
    deliveryAddress: Address;
    comment?: string;
    createdAt: string;
    totalAmount: number;
}

export type OrderStatus = 'NEW' | 'IN_PROCESS' | 'DELIVERED' | 'CANCELLED' | 'ERROR';

export interface Address {
    id?: number;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}
