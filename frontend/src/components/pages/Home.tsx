import { useEffect, useState, useCallback } from "react";
import type { ApiResponse, Product } from "../../types";
import { BookCard, ErrorMessage, LoadingSkeleton as ProductSkeleton, Pagination } from "../common";
import { ProductService } from "../../services/domain/ProductService";
import { CartService } from "../../services/domain/CartService";

const productService = new ProductService();
const cartService = new CartService();

export const Home: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

    const fetchProducts = useCallback(async (page: number = 1) => {
        try {
            setLoading(true);
            setError(null);

            const data = await productService.getProducts({ page, size: 10 });

            // Validate response data
            if (!data || !Array.isArray(data.data)) {
                throw new Error('Invalid response format');
            }

            setProducts(data.data);
            setApiResponse(data);
            setCurrentPage(page);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
            setError(errorMessage);
            setProducts([]);
            setApiResponse(null);

            // Log error for debugging
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts(1);
    }, [fetchProducts]);

    const handleAddToCart = useCallback((book: Product) => {
        const product: Product = {
            code: book.code || '',
            name: book.name,
            imageUrl: book.imageUrl,
            price: book.price,
            description: book.description || ''
        };

        cartService.addToCart(product);
        alert(`Added "${book.name}" to cart!`);
    }, []);

    const handlePageChange = useCallback((page: number) => {
        // Validate page number
        if (page < 1 || (apiResponse && page > apiResponse.totalPages)) {
            console.warn('Invalid page number:', page);
            return;
        }

        fetchProducts(page);
        // Scroll to top when changing pages
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [fetchProducts, apiResponse]);

    const handleRetry = useCallback(() => {
        fetchProducts(currentPage);
    }, [fetchProducts, currentPage]);

    if (error) {
        return <ErrorMessage message={error} onRetry={handleRetry} />;
    }

    return (
        <div className="bg-gray-200">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-12 mb-8">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Welcome to BookStore
                    </h1>
                    <p className="text-xl md:text-2xl mb-8">
                        Discover your next favorite book
                    </p>
                </div>
            </div>

            {/* Products Section */}
            <div className="container mx-auto px-4">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <ProductSkeleton key={index} />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                            {products.map((product) => (
                                <BookCard
                                    key={product.code}
                                    imageUrl={product.imageUrl}
                                    name={product.name}
                                    price={product.price}
                                    onAddToCart={() => handleAddToCart(product)}
                                />
                            ))}
                        </div>

                        {apiResponse && apiResponse.totalPages > 1 && (
                            <Pagination
                                currentPage={apiResponse.pageNumber}
                                totalPages={apiResponse.totalPages}
                                hasNext={apiResponse.hasNext}
                                hasPrevious={apiResponse.hasPrevious}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
                        <p className="text-gray-600">Check back later for new books!</p>
                        <button
                            onClick={() => fetchProducts(1)}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            Refresh
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
