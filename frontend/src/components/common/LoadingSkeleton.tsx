const ProductSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col animate-pulse">
        <div className="w-full h-72 bg-gray-300"></div>
        <div className="p-4 flex-grow flex flex-col">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
        </div>
        <div className="p-4 pt-0">
            <div className="h-10 bg-gray-300 rounded"></div>
        </div>
    </div>
);

export default ProductSkeleton;