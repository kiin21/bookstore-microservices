import type { ApiResponse, PaginationParams, Product } from "../../types";
import { ProductApi } from "../api/ProductApi";

export class ProductService {
    private productApi: ProductApi;

    constructor() {
        this.productApi = new ProductApi();
    }

    public async getProducts(params: PaginationParams): Promise<ApiResponse<Product>> {
        const { page, size = 10 } = params;

        try {
            const response = await this.productApi.getProducts({ page, size });

            return response;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw new Error(`Failed to fetch products: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async getProductById(id: string): Promise<Product> {

        try {
            const response = await this.productApi.getProductById(id);
            return response;
        } catch (error) {
            console.error('Error fetching product by ID:', error);
            throw new Error(`Failed to fetch product: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
};