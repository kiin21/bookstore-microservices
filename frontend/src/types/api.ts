import type { Product } from "./product";

export interface ApiResponse<T = Product> {
    data: T[];
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    isFirst: boolean;
    isLast: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface ApiError {
    message: string;
    status: number;
    timestamp: string;
}

export interface PaginationParams {
    page: number;
    size?: number;
    sort?: string;
    direction?: 'asc' | 'desc';
}