import { ApiClient } from './ApiClient';
import { API_ENDPOINTS } from '../constants';
import type { ApiResponse, PaginationParams, Product } from '../../types';

export class ProductApi{
    private apiClient: ApiClient;

    constructor() {
        this.apiClient = new ApiClient(API_ENDPOINTS.CATALOG);
    }

    async getProducts(params: PaginationParams): Promise<ApiResponse<Product>> {
        const { page, size = 10 } = params;
        return this.apiClient.get(`/products?page=${page}&size=${size}`);
    }

    async getProductById(id: string): Promise<Product> {
        return this.apiClient.get(`/products/${id}`);
    }
}