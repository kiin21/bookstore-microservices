import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { OrderSummary, OrderStatus } from "../../types";
import { orderService } from "../../services";

export const OrderPage: React.FC = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<OrderSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');

    const loadOrders = async () => {
        setLoading(true);
        setError(null);

        try {
            const fetchedOrders = await orderService.getAllOrders();
            setOrders(fetchedOrders);
            applyFilter(fetchedOrders, statusFilter);
        } catch (err) {
            console.error('Failed to load orders:', err);
            setError('Failed to load your orders. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = (ordersList: OrderSummary[], status: OrderStatus | 'ALL') => {
        if (status === 'ALL') {
            setFilteredOrders(ordersList);
        } else {
            setFilteredOrders(ordersList.filter(order => order.status === status));
        }
    };

    const handleFilterChange = (status: OrderStatus | 'ALL') => {
        setStatusFilter(status);
        applyFilter(orders, status);
    };

    const handleRefresh = () => {
        loadOrders();
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const getStatusBadgeClass = (status: OrderStatus) => {
        switch (status) {
            case 'NEW':
                return 'bg-blue-100 text-blue-800';
            case 'IN_PROCESS':
                return 'bg-yellow-100 text-yellow-800';
            case 'DELIVERED':
                return 'bg-green-100 text-green-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            case 'ERROR':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleViewDetails = (orderNumber: string) => {
        navigate(`/orders/${orderNumber}`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">My Orders</h1>

            {/* Filter bar */}
            <div className="bg-white p-4 mb-6 rounded-lg shadow-sm flex flex-wrap items-center gap-4">
                <div className="font-medium">Filter by status:</div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => handleFilterChange('ALL')}
                        className={`px-3 py-1 rounded-full text-sm ${statusFilter === 'ALL'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        All
                    </button>
                    {['NEW', 'IN_PROCESS', 'DELIVERED', 'CANCELLED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => handleFilterChange(status as OrderStatus)}
                            className={`px-3 py-1 rounded-full text-sm ${statusFilter === status
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleRefresh}
                    className="ml-auto px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
                    {error}
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="text-center py-8">
                    {orders.length === 0 ? (
                        <>
                            <p className="text-gray-600 mb-4">You don't have any orders yet</p>
                            <Link
                                to="/"
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                            >
                                Start Shopping
                            </Link>
                        </>
                    ) : (
                        <>
                            <p className="text-gray-600 mb-4">No orders match your filter criteria</p>
                            <button
                                onClick={() => handleFilterChange('ALL')}
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                            >
                                Show All Orders
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order Number
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrders.map((order) => (
                                <tr key={order.orderNumber} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{order.orderNumber}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                                            {order.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleViewDetails(order.orderNumber)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};