import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineTruck, HiOutlineExclamationCircle } from 'react-icons/hi';
import TileLoader from '../components/TileLoader';

const MyOrders = () => {
    const { currentUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyOrders = async () => {
            const token = localStorage.getItem('userToken');
            if (!token) {
                setError('Please log in to view your orders.');
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders/my-orders`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setOrders(res.data);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError('Failed to load your orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchMyOrders();
    }, []);

    const getStatusInfo = (status) => {
        switch (status) {
            case 'Pending':
                return { icon: <HiOutlineClock className="text-xl text-yellow-500" />, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' };
            case 'Processing':
                return { icon: <HiOutlineCheckCircle className="text-xl text-blue-500" />, color: 'text-blue-600 bg-blue-50 border-blue-200' };
            case 'Shipped':
                return { icon: <HiOutlineTruck className="text-xl text-purple-500" />, color: 'text-purple-600 bg-purple-50 border-purple-200' };
            case 'Delivered':
                return { icon: <HiOutlineCheckCircle className="text-xl text-green-500" />, color: 'text-green-600 bg-green-50 border-green-200' };
            case 'Cancelled':
                return { icon: <HiOutlineXCircle className="text-xl text-red-500" />, color: 'text-red-600 bg-red-50 border-red-200' };
            default:
                return { icon: <HiOutlineClock className="text-xl text-gray-500" />, color: 'text-gray-600 bg-gray-50 border-gray-200' };
        }
    };

    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(new Date(dateString));
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50"><TileLoader /></div>;
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
                <HiOutlineExclamationCircle className="text-6xl text-red-400 mb-4" />
                <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-wide">Oops!</h2>
                <p className="text-gray-500 font-bold">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900">My Orders</h1>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Track your premium tile deliveries</p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white p-12 text-center shadow-xl border border-gray-100">
                        <HiOutlineTruck className="text-6xl text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-gray-900 uppercase">No Orders Found</h3>
                        <p className="text-gray-500 font-bold mt-2">You haven't placed any orders yet.</p>
                        <a href="/" className="inline-block mt-6 px-8 py-3 bg-blue-600 hover:bg-black text-white font-black uppercase tracking-widest transition-colors text-xs">
                            Discover Collections
                        </a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const statusInfo = getStatusInfo(order.status);
                            
                            return (
                                <div key={order._id} className="bg-white shadow-lg border border-gray-100 overflow-hidden group">
                                    {/* Order Header */}
                                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-sm font-black text-blue-600 uppercase tracking-widest">
                                                    Order #{order._id.slice(-6).toUpperCase()}
                                                </h3>
                                                <span className={`px-3 py-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest border ${statusInfo.color}`}>
                                                    {statusInfo.icon} {order.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 font-bold mt-2 tracking-wide block uppercase">
                                                Placed on: {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Total</p>
                                            <p className="text-2xl font-black text-gray-900 italic tracking-tighter">
                                                ₹{order.totalAmount.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Admin Note Section - CRITICAL REQUIREMENT */}
                                    {order.adminNote && (
                                        <div className={`p-4 border-l-4 ${order.status === 'Cancelled' ? 'border-red-500 bg-red-50' : 'border-blue-500 bg-blue-50'} m-6 text-sm font-bold text-gray-700 flex flex-col`}>
                                            <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${order.status === 'Cancelled' ? 'text-red-500' : 'text-blue-600'}`}>
                                                Message from Store
                                            </span>
                                            <p className="italic">"{order.adminNote}"</p>
                                        </div>
                                    )}

                                    {/* Order Items */}
                                    <div className="p-6">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Items Included</h4>
                                        <div className="space-y-4">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center border border-gray-100 p-4 hover:border-gray-300 transition-colors">
                                                    <div>
                                                        <p className="font-black text-gray-900 text-sm uppercase tracking-wider">{item.name}</p>
                                                        <div className="flex gap-3 text-[10px] font-bold text-gray-500 uppercase mt-1">
                                                            <span>Qty: {item.quantity}</span>
                                                            <span>•</span>
                                                            <span>₹{item.pricePerBox?.toLocaleString() || 0}/box</span>
                                                            {item.selectedSize && <span>• Size: {item.selectedSize}</span>}
                                                            {item.selectedColor && <span>• Color: {item.selectedColor}</span>}
                                                        </div>
                                                    </div>
                                                    <p className="font-black text-gray-900">
                                                        ₹{((item.pricePerBox || 0) * item.quantity).toLocaleString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
