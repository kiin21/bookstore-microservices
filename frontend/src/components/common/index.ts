// Export all components from the common folder
export { default as BookCard } from './BookCard';
export { default as ErrorMessage } from './ErrorMessage';
export { default as LoadingSkeleton } from './LoadingSkeleton';
export { default as Pagination } from './Pagination';

// Export types
export interface BookCardProps {
    imageUrl: string;
    name: string;
    price: number;
    onAddToCart?: (book: BookCardProps) => void;
}

export interface ErrorMessageProps {
    message: string;
    onRetry: () => void;
}

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
    onPageChange: (page: number) => void;
}