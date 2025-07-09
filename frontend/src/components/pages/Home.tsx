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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-16 mb-12 overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-purple-300/20 rounded-full blur-lg"></div>

                <div className="relative container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                        Welcome to BookStore
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto">
                        Discover your next favorite book from our curated collection
                    </p>

                    {/* Feature badges */}
                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">Free Shipping</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">Best Prices</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium">Fast Delivery</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div className="container mx-auto px-4 pb-16">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Featured Books
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Explore our handpicked selection of amazing books across all genres
                    </p>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-4 rounded-full"></div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <div
                                key={index}
                                className="transform hover:scale-105 transition-all duration-300"
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    animation: 'fadeInUp 0.6s ease-out forwards'
                                }}
                            >
                                <ProductSkeleton />
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                            {products.map((product, index) => (
                                <div
                                    key={product.code}
                                    className="transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                                    style={{
                                        animationDelay: `${index * 0.1}s`,
                                        animation: 'fadeInUp 0.6s ease-out forwards'
                                    }}
                                >
                                    <BookCard
                                        imageUrl={product.imageUrl}
                                        name={product.name}
                                        price={product.price}
                                        onAddToCart={() => handleAddToCart(product)}
                                    />
                                </div>
                            ))}
                        </div>

                        {apiResponse && apiResponse.totalPages > 1 && (
                            <div className="mt-16 flex justify-center">
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
                                    <Pagination
                                        currentPage={apiResponse.pageNumber}
                                        totalPages={apiResponse.totalPages}
                                        hasNext={apiResponse.hasNext}
                                        hasPrevious={apiResponse.hasPrevious}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 max-w-md mx-auto border border-white/20">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">No Books Found</h3>
                            <p className="text-gray-600 mb-8">
                                We're currently updating our collection. Please check back soon for new exciting titles!
                            </p>
                            <button
                                onClick={() => fetchProducts(1)}
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh Collection
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};