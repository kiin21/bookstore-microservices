import { ApiClient } from './ApiClient';
import { API_ENDPOINTS } from '../constants';
import type { OrderRequest, OrderResponse, OrderDetails, OrderSummary } from '../../types';

export class OrderApi {
    private apiClient: ApiClient;

    constructor() {
        this.apiClient = new ApiClient(API_ENDPOINTS.ORDERS);
    }

    async createOrder(orderData: OrderRequest, token?: string): Promise<OrderResponse> {
        return this.apiClient.post('/orders', orderData, token);
    }

    async getAllOrders(token?: string): Promise<OrderSummary[]> {
        return this.apiClient.get('/orders', token);
    }

    async getOrderById(orderId: string, token?: string): Promise<OrderDetails> {
        return this.apiClient.get(`/orders/${orderId}`, token);
    }
}