import { cartService, userService } from '../services';

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
    orderId: string;
    status: string;
    totalAmount: number;
}

class OrderService {
    private apiUrl = 'http://localhost:8989/orders/api/orders';

    public async placeOrder(orderData: OrderRequest): Promise<OrderResponse> {
        try {
            // Kiểm tra trạng thái đăng nhập
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

            // Xóa giỏ hàng sau khi đặt hàng thành công
            cartService.clearCart();

            return orderResult;
        } catch (error) {
            console.error('Order service error:', error);
            throw error;
        }
    }
}

export const orderService = new OrderService();