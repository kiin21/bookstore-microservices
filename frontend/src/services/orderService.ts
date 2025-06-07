import { cartService, userService } from '../services';
import type { OrderDetails, OrderSummary } from '../types';

export interface OrderAddress {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface OrderCustomer {
    name: string;
    email: string;
    phone: string;
}

export interface OrderRequest {
    items: Array<{
        code: string;
        name: string;
        description: string;
        imageUrl: string;
        price: number;
        quantity: number;
    }>;
    customer: OrderCustomer;
    deliveryAddress: OrderAddress;
}

export interface OrderResponse {
    orderNumber: string;
}

class OrderService {
    private apiUrl = 'http://localhost:8989/orders/api/orders';

    public async placeOrder(orderData: OrderRequest): Promise<OrderResponse> {
        try {
            if (!userService.isLoggedIn()) {
                throw new Error('User must be logged in to place an order');
            }

            const token = userService.getToken();

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to place order');
            }

            const orderResult = await response.json();

            cartService.clearCart();

            return orderResult;
        } catch (error) {
            console.error('Order service error:', error);
            throw error;
        }
    }

    public async getAllOrders(): Promise<OrderSummary[]> {
        try {
            if (!userService.isLoggedIn()) {
                throw new Error('User must be logged in to see orders');
            }

            const token = userService.getToken();

            const response = await fetch(this.apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to retrieve orders');
            }

            const result = await response.json();

            return result;
        } catch (error) {
            console.error('Order service error:', error);
            throw error;
        }

    }
    
    public async getOrderById(orderId: string): Promise<OrderDetails> {
        try {
            const token = userService.getToken();

            const response = await fetch(`${this.apiUrl}/${orderId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to fetch order');
            }

            return response.json();
        } catch (error) {
            console.error('Order service error:', error);
            throw error;
        }
    }
}

export const orderService = new OrderService();