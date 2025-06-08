import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import type { OrderDetails } from "../../types";
import { OrderService } from "../../services";

const orderService = new OrderService();

export const OrderDetailPage: React.FC = () => {
    const { orderNumber } = useParams<{ orderNumber: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (orderNumber) {
            loadOrderDetails(orderNumber);
        }
    }, [orderNumber]);

    const loadOrderDetails = async (orderNumber: string) => {
        setLoading(true);
        setError(null);

        try {
            const orderDetails = await orderService.getOrderById(orderNumber);
            orderDetails.items.forEach(item => {
                item.totalPrice = item.price * item.quantity;
            });
            console.log('Order Details:', orderDetails);
            setOrder(orderDetails);
        } catch (err) {
            console.error('Failed to load order details:', err);
            setError('Failed to load order details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
                    {error}
                </div>
                <button
                    onClick={() => navigate('/orders')}
                    className="text-blue-600 hover:text-blue-800"
                >
                    ← Back to Orders
                </button>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Order not found</p>
                    <Link
                        to="/orders"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                    >
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Order Details</h1>
                <button
                    onClick={() => navigate('/orders')}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                    ← Back to Orders
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Order Information</h2>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-600">Order Number:</div>
                            <div className="font-medium">{order.orderNumber}</div>

                            <div className="text-gray-600">Date:</div>
                            <div>{new Date(order.createdAt).toLocaleString()}</div>

                            <div className="text-gray-600">Total Amount:</div>
                            <div className="font-medium">${order.totalAmount.toFixed(2)}</div>
                        </div>

                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
                        <address className="not-italic">
                            <div>{order.deliveryAddress.street}</div>
                            <div>
                                {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                            </div>
                            <div>{order.deliveryAddress.country}</div>
                        </address>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <h2 className="text-lg font-semibold p-4 border-b">Order Items</h2>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quantity
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {order.items.map((item) => (
                            <tr key={item.code}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            {item.name}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                    ${item.price.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                    {item.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    ${item.totalPrice.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                        <tr className="bg-gray-50">
                            <td colSpan={3} className="px-6 py-4 text-right font-medium">
                                Total:
                            </td>
                            <td className="px-6 py-4 text-right font-bold">
                                ${order.totalAmount}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};