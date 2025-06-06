interface BookCardProps {
    imageUrl: string;
    name: string;
    price: number;
    onAddToCart?: (book: BookCardProps) => void;
}

const BookCard = ({ imageUrl, name, price, onAddToCart }: BookCardProps) => {
    const handleAddToCart = () => {
        if (onAddToCart) {
            onAddToCart({ imageUrl, name, price });
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col transition-transform hover:scale-105 hover:shadow-lg">
            {/* Book Image */}
            <div className="relative h-64 flex items-center justify-center bg-gray-100">
                <img
                    src={imageUrl}
                    alt={name}
                    className="max-h-64 max-w-full object-contain"
                />
            </div>

            {/* Card Body */}
            <div className="p-4 flex-grow flex flex-col">
                <h5
                    className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors"
                    title={name}
                >
                    {name}
                </h5>
                <p
                    className="text-xl font-bold text-green-600"
                    title={`Price: $${price}`}
                >
                    Price: ${price.toFixed(2)}
                </p>
            </div>

            {/* Card Footer */}
            <div className="p-2 pt-0 mt-auto">
                <button
                    onClick={handleAddToCart}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-black font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default BookCard;