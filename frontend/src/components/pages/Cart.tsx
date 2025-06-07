import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Cart } from "../../types";
import { cartService, orderService, userService } from "../../services";

export const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState<Cart>({ items: [], totalAmount: 0 });
    const [loading, setLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Customer information form state
    const [customerInfo, setCustomerInfo] = useState({
        customer: {
            name: "sample name",
            email: "test@gmail.com",
            phone: "0123456789"
        },
        deliveryAddress: {
            addressLine1: "Long Bien",
            addressLine2: "Baker Street",
            city: "HCMC",
            state: "Thu Duc",
            zipCode: "01234",
            country: "VN"
        }
    });

    // Form visibility state
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = () => {
        setLoading(true);
        const cartData = cartService.getCart();
        setCart(cartData);
        setLoading(false);
    };

    const handleUpdateQuantity = (code: string, quantity: number) => {
        const updatedCart = cartService.updateQuantity(code, quantity);
        setCart(updatedCart);
    };

    const handleRemoveItem = (code: string) => {
        if (window.confirm("Are you sure you want to remove this item from your cart?")) {
            const updatedCart = cartService.removeItem(code);
            setCart(updatedCart);
        }
    };

    const handleClearCart = () => {
        if (window.confirm("Are you sure you want to clear your cart?")) {
            const emptyCart = cartService.clearCart();
            setCart(emptyCart);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, section: string, field: string) => {
        const { value } = e.target;
        setCustomerInfo(prev => ({
            ...prev,
            [section]: {
                ...prev[section as keyof typeof prev],
                [field]: value
            }
        }));
    };

    const handleSubmitOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        // Kiểm tra xem giỏ hàng có trống không
        if (cart.items.length === 0) {
            alert("Your cart is empty");
            return;
        }

        // Kiểm tra đăng nhập
        if (!userService.isLoggedIn()) {
            sessionStorage.setItem('redirectAfterLogin', '/cart');
            navigate('/login');
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                items: cart.items.map(item => ({
                    code: item.code,
                    quantity: item.quantity
                })),
                customer: customerInfo.customer,
                deliveryAddress: customerInfo.deliveryAddress
            };

            const result = await orderService.placeOrder(orderData);

            setCart({ items: [], totalAmount: 0 });

            // Hiển thị thông báo thành công
            alert(`Order placed successfully! Order ID: ${result.orderId}`);

            // Chuyển hướng đến trang chi tiết đơn hàng
            navigate(`/orders/${result.orderId}`);

        } catch (error) {
            console.error('Error placing order:', error);

            if (error instanceof Error) {
                alert(`Failed to place order: ${error.message}`);
            } else {
                alert('Failed to place order. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="p-4 text-center">Loading cart...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>

            {cart.items.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Your cart is empty</p>
                    <Link
                        to="/"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                    >
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-50 border-b border-gray-200">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quantity
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {cart.items.map((item) => (
                                    <tr key={item.code}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-16 w-16 flex-shrink-0">
                                                    <img className="h-16 w-16 object-contain" src={item.imageUrl} alt={item.name} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                    <div className="text-sm text-gray-500">Code: {item.code}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${item.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.code, item.quantity - 1)}
                                                    className="p-1 border border-gray-300 rounded-l-md"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => handleUpdateQuantity(item.code, parseInt(e.target.value) || 1)}
                                                    className="p-1 w-12 text-center border-t border-b border-gray-300"
                                                />
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.code, item.quantity + 1)}
                                                    className="p-1 border border-gray-300 rounded-r-md"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button
                                                onClick={() => handleRemoveItem(item.code)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-50">
                                    <td colSpan={3} className="px-6 py-4 text-right font-medium">
                                        Total Amount:
                                    </td>
                                    <td className="px-6 py-4 font-bold text-green-600">
                                        ${cart.totalAmount.toFixed(2)}
                                    </td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-between items-center mb-8">
                        <Link to="/">
                            Continue Shopping
                        </Link>

                        <div className="flex space-x-2">
                            <button className="bg-red-700 text-white" onClick={handleClearCart}> Clear Cart </button>

                            <button className="bg-blue-400 text-white" onClick={() => setShowCheckoutForm(!showCheckoutForm)} >
                                {showCheckoutForm ? 'Hide Checkout Form' : 'Proceed to Checkout'}
                            </button>
                        </div>
                    </div>

                    {showCheckoutForm && (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
                            <h2 className="text-xl font-semibold mb-4">Checkout Information</h2>

                            <form onSubmit={handleSubmitOrder}>
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-2">Customer Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Full Name*
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={customerInfo.customer.name}
                                                onChange={(e) => handleInputChange(e, 'customer', 'name')}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email*
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={customerInfo.customer.email}
                                                onChange={(e) => handleInputChange(e, 'customer', 'email')}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone*
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={customerInfo.customer.phone}
                                                onChange={(e) => handleInputChange(e, 'customer', 'phone')}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-2">Delivery Address</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Address Line 1*
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={customerInfo.deliveryAddress.addressLine1}
                                                onChange={(e) => handleInputChange(e, 'deliveryAddress', 'addressLine1')}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Address Line 2
                                            </label>
                                            <input
                                                type="text"
                                                value={customerInfo.deliveryAddress.addressLine2}
                                                onChange={(e) => handleInputChange(e, 'deliveryAddress', 'addressLine2')}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                City*
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={customerInfo.deliveryAddress.city}
                                                onChange={(e) => handleInputChange(e, 'deliveryAddress', 'city')}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                State/Province*
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={customerInfo.deliveryAddress.state}
                                                onChange={(e) => handleInputChange(e, 'deliveryAddress', 'state')}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Zip/Postal Code*
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={customerInfo.deliveryAddress.zipCode}
                                                onChange={(e) => handleInputChange(e, 'deliveryAddress', 'zipCode')}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Country*
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={customerInfo.deliveryAddress.country}
                                                onChange={(e) => handleInputChange(e, 'deliveryAddress', 'country')}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <button
                                        type="submit"
                                        className="bg-green-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Processing...' : 'Place Order'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
