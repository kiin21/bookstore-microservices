import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Cart } from "../../types";
import { CartService } from "../../services/domain/CartService";
import { OrderService } from "../../services/domain/OrderService";
import { UserService } from "../../services/domain/UserService";


const cartService = new CartService();
const orderService = new OrderService();

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

        if (cart.items.length === 0) {
            alert("Your cart is empty");
            return;
        }

        if (!UserService.isLoggedIn()) {
            sessionStorage.setItem('redirectAfterLogin', '/cart');
            navigate('/login');
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                items: cart.items.map(item => ({
                    name: item.name,
                    description: item.description,
                    imageUrl: item.imageUrl,
                    price: item.price,
                    code: item.code,
                    quantity: item.quantity
                })),
                customer: customerInfo.customer,
                deliveryAddress: customerInfo.deliveryAddress
            };

            const orderNumber = await orderService.placeOrder(orderData);

            setCart({ items: [], totalAmount: 0 });
            alert(`Order placed successfully! Order ID: ${orderNumber}`);
            navigate(`/orders/${orderNumber}`);

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Your Shopping Cart</h1>
                </div>

                {cart.items.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19" />
                            </svg>
                        </div>
                        <p className="text-gray-600 mb-6 text-lg">Your cart is empty</p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 font-medium px-6 py-3 rounded-lg transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                            </svg>
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border border-gray-100">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                                        <tr>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {cart.items.map((item) => (
                                            <tr key={item.code} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-20 w-20 flex-shrink-0">
                                                            <img className="h-20 w-20 object-cover rounded-lg border border-gray-200" src={item.imageUrl} alt={item.name} />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-base font-semibold text-gray-900">{item.name}</div>
                                                            <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md inline-block mt-1">Code: {item.code}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <span className="text-lg font-semibold text-green-600">${item.price.toFixed(2)}</span>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 w-fit">
                                                        <button
                                                            onClick={() => { handleUpdateQuantity(item.code, item.quantity - 1); }}
                                                            className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors duration-150"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                                            </svg>
                                                        </button>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => { handleUpdateQuantity(item.code, parseInt(e.target.value) || 1); }}
                                                            className="py-2 w-16 text-center border-0 bg-transparent font-semibold"
                                                        />
                                                        <button
                                                            onClick={() => { handleUpdateQuantity(item.code, item.quantity + 1); }}
                                                            className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors duration-150"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <span className="text-lg font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <button
                                                        onClick={() => { handleRemoveItem(item.code); }}
                                                        className="inline-flex items-center gap-2 text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors duration-150"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="bg-gradient-to-r from-green-50 to-emerald-50 border-t-2 border-green-200">
                                            <td colSpan={3} className="px-6 py-6 text-right text-lg font-semibold text-gray-700">
                                                Total Amount:
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className="text-2xl font-bold text-green-600">${cart.totalAmount.toFixed(2)}</span>
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 text-white-800 font-medium transition-colors duration-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                                </svg>
                                Continue Shopping
                            </Link>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleClearCart}
                                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Clear Cart
                                </button>

                                <button
                                    onClick={() => setShowCheckoutForm(!showCheckoutForm)}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    {showCheckoutForm ? 'Hide Checkout Form' : 'Proceed to Checkout'}
                                </button>
                            </div>
                        </div>

                        {showCheckoutForm && (
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        Checkout Information
                                    </h2>
                                </div>

                                <div className="p-6">
                                    <form onSubmit={(e) => { e.preventDefault(); handleSubmitOrder(e); }}>
                                        <div className="mb-8">
                                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Customer Information
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Full Name*
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={customerInfo.customer.name}
                                                        onChange={(e) => { handleInputChange(e, 'customer', 'name'); }}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-black"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Email*
                                                    </label>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={customerInfo.customer.email}
                                                        onChange={(e) => { handleInputChange(e, 'customer', 'email'); }}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-black"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Phone*
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        required
                                                        value={customerInfo.customer.phone}
                                                        onChange={(e) => { handleInputChange(e, 'customer', 'phone'); }}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-black"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-8">
                                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Delivery Address
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Address Line 1*
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={customerInfo.deliveryAddress.addressLine1}
                                                        onChange={(e) => { handleInputChange(e, 'deliveryAddress', 'addressLine1'); }}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-black"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Address Line 2
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={customerInfo.deliveryAddress.addressLine2}
                                                        onChange={(e) => { handleInputChange(e, 'deliveryAddress', 'addressLine2'); }}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-black"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        City*
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={customerInfo.deliveryAddress.city}
                                                        onChange={(e) => { handleInputChange(e, 'deliveryAddress', 'city'); }}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-black"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        State/Province*
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={customerInfo.deliveryAddress.state}
                                                        onChange={(e) => { handleInputChange(e, 'deliveryAddress', 'state'); }}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-black"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Zip/Postal Code*
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={customerInfo.deliveryAddress.zipCode}
                                                        onChange={(e) => { handleInputChange(e, 'deliveryAddress', 'zipCode'); }}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-black"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Country*
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={customerInfo.deliveryAddress.country}
                                                        onChange={(e) => { handleInputChange(e, 'deliveryAddress', 'country'); }}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-black"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-6 border-t border-gray-200">
                                            <button
                                                type="submit"
                                                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Place Order
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
