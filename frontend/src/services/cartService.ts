import type { ApiResponse, PaginationParams, Product } from "../types";


export const cartService = {
    getProducts: async (params: PaginationParams): Promise<ApiResponse<Product>> => {
        const { page, size = 10 } = params;
        const response = await fetch(`http://localhost:8989/catalog/api/products?page=${page}&size=${size}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    getProductById: async (id: string): Promise<Product> => {
        const response = await fetch(`http://localhost:8989/catalog/api/products/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
    }
};