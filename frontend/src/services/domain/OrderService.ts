import type { OrderDetails, OrderRequest, OrderSummary } from "../../types";
import { UserService } from "./UserService";
import { OrderApi } from "../api/OrderApi";
import { CartService } from "./CartService";

const cartService = new CartService();

export class OrderService {
    private orderApi: OrderApi;

    constructor() {
        this.orderApi = new OrderApi();
    }

    public async placeOrder(orderData: OrderRequest): Promise<string> {
        try {
            if (!UserService.isLoggedIn()) {
                throw new Error('User must be logged in to place an order');
            }

            const token = UserService.getToken();

            const response = await this.orderApi.createOrder(orderData, token);

            const orderResult = response.orderNumber;

            cartService.clearCart();

            return orderResult;
        } catch (error) {
            console.error('Order service error:', error);
            throw error;
        }
    }

    public async getAllOrders(): Promise<OrderSummary[]> {
        try {
            if (!UserService.isLoggedIn()) {
                throw new Error('User must be logged in to see orders');
            }

            const token = UserService.getToken();
            const response = await this.orderApi.getAllOrders(token);
            return response;
        } catch (error) {
            console.error('Order service error:', error);
            throw error;
        }

    }

    public async getOrderById(orderId: string): Promise<OrderDetails> {
        try {
            const token = UserService.getToken();

            const response = await this.orderApi.getOrderById(orderId, token);

            return response;
        } catch (error) {
            console.error('Order service error:', error);
            throw error;
        }
    }
}