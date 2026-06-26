import React, { useState, useEffect } from "react";
import axios from "axios";
import { HiOutlineRefresh, HiOutlineEye, HiOutlineDotsVertical, HiOutlineCash, HiOutlineCheckCircle, HiOutlineClock, HiX, HiTrash } from "react-icons/hi";
import TileLoader from "../../components/TileLoader";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    
    // Status update modal state
    const [updateModal, setUpdateModal] = useState({ isOpen: false, status: '', note: '' });
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders`);
            setOrders(res.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteOrder = async (id) => {
        if (!window.confirm("Are you sure you want to completely delete this order?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${id}`);
            setOrders(prev => prev.filter(order => order._id !== id));
            setActiveDropdown(null);
        } catch (error) {
            console.error("Error deleting order:", error);
            alert("Failed to delete order");
        }
    };

    const submitStatusUpdate = async () => {
        if (!selectedOrder) return;
        setIsUpdating(true);
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/orders/${selectedOrder._id}/status`,
                {
                    status: updateModal.status,
                    adminNote: updateModal.note
                }
            );

            // Update local state
            setOrders(prev => prev.map(o => o._id === res.data._id ? res.data : o));
            setSelectedOrder(res.data);
            setUpdateModal({ isOpen: false, status: '', note: '' });
        } catch (error) {
            console.error("Error updating order status:", error);
            alert("Failed to update status");
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending": return "bg-gray-100 text-gray-600";
            case "Processing": return "bg-blue-50 text-blue-600";
            case "Shipped": return "bg-purple-50 text-purple-600";
            case "Delivered": return "bg-green-50 text-green-600";
            case "Cancelled": return "bg-red-50 text-red-600";
            default: return "bg-gray-50 text-gray-400";
        }
    };

    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateString));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tighter uppercase italic text-gray-900">Order Management</h1>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1 italic">Monitor your premium tile sales</p>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={fetchOrders}
                        className="p-2.5 bg-white border border-gray-200 rounded-none text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                        title="Refresh Orders"
                    >
                        <HiOutlineRefresh className={`${loading ? 'animate-spin' : ''} text-lg`} />
                    </button>
                    <div className="h-10 w-px bg-gray-200 mx-2 hidden md:block"></div>
                    <div className="bg-blue-600 text-white px-4 py-2 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20">
                        {orders.length} TOTAL ORDERS
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-gray-100 shadow-xl overflow-hidden rounded-none">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-900 border-b border-gray-800">
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date & Time</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer Details</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-10 bg-white">
                                        <TileLoader />
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-3 opacity-20">
                                            <HiOutlineClock className="text-5xl" />
                                            <p className="text-xs font-black uppercase tracking-[0.3em]">No orders received yet</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50/80 transition-all group">
                                        <td className="px-6 py-5">
                                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 uppercase tracking-tighter">
                                                #{order._id.slice(-6).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-[11px] font-black text-gray-900 uppercase italic leading-none">{formatDate(order.createdAt).split(',')[0]}</p>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">{formatDate(order.createdAt).split(',')[1]}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-xs font-black text-gray-900 uppercase tracking-tight line-clamp-1">{order.customer.fullName}</p>
                                            <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400 font-bold">
                                                <span>{order.customer.phone}</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span className="line-clamp-1 italic">{order.customer.city}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="text-sm font-black text-gray-900 italic tracking-tighter">
                                                ₹{order.totalAmount.toLocaleString()}
                                            </span>
                                            <p className="text-[8px] text-blue-600 font-black uppercase tracking-widest mt-0.5">COD</p>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`text-[9px] font-black px-3 py-1 uppercase tracking-[0.2em] rounded-none ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 relative">
                                                <button 
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                                    title="View Full Details"
                                                >
                                                    <HiOutlineEye />
                                                </button>
                                                <div className="relative">
                                                    <button 
                                                        onClick={() => setActiveDropdown(activeDropdown === order._id ? null : order._id)}
                                                        className="p-2 text-gray-400 hover:text-gray-900"
                                                    >
                                                        <HiOutlineDotsVertical />
                                                    </button>
                                                    {activeDropdown === order._id && (
                                                        <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl border border-gray-100 z-50 rounded-none">
                                                            <button
                                                                onClick={() => handleDeleteOrder(order._id)}
                                                                className="w-full text-left px-4 py-3 text-[11px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 flex items-center justify-between transition-colors"
                                                            >
                                                                Delete Order <HiTrash />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom Insight Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 p-6 shadow-xl border border-gray-800 flex items-center justify-between group">
                    <div>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1 italic">Total Revenue</p>
                        <h3 className="text-2xl font-black text-white italic tracking-tighter">₹{orders.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString()}</h3>
                    </div>
                    <div className="bg-blue-600/10 p-3 group-hover:bg-blue-600/20 transition-all uppercase text-blue-600 font-black text-xs">INR</div>
                </div>
                <div className="bg-white p-6 shadow-xl border border-gray-100 flex items-center justify-between group">
                    <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 italic">Monthly Growth</p>
                        <h3 className="text-2xl font-black text-gray-900 italic tracking-tighter">+12.5%</h3>
                    </div>
                    <HiOutlineCheckCircle className="text-3xl text-green-500 opacity-20" />
                </div>
                <div className="bg-white p-6 shadow-xl border border-gray-100 flex items-center justify-between group">
                    <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1 italic">Pending Orders</p>
                        <h3 className="text-2xl font-black text-gray-900 italic tracking-tighter">{orders.filter(o => o.status === "Pending").length}</h3>
                    </div>
                    <div className="h-6 w-1 bg-blue-600"></div>
                </div>
            </div>

            {/* Modal for Order Details */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in duration-300">
                        <div className="sticky top-0 bg-gray-900 text-white p-6 flex justify-between items-center z-10">
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-widest italic">Order Details</h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">#{selectedOrder._id}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white transition-colors p-2">
                                <HiX className="text-2xl" />
                            </button>
                        </div>
                        
                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-100 pb-8">
                                <div>
                                    <h3 className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-4">Customer Information</h3>
                                    <p className="font-black text-gray-900 uppercase">{selectedOrder.customer.fullName}</p>
                                    <p className="text-sm font-bold text-gray-500 mt-2">{selectedOrder.customer.phone}</p>
                                </div>
                                <div>
                                    <h3 className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-4">Shipping Address</h3>
                                    <p className="font-bold text-gray-600 text-sm">{selectedOrder.customer.address}</p>
                                    <p className="font-bold text-gray-600 text-sm uppercase mt-1">{selectedOrder.customer.city} - {selectedOrder.customer.pincode}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-4">Ordered Items</h3>
                                <div className="space-y-4">
                                    {selectedOrder.items.map((item, idx) => {
                                        const isSampleItem = item.isSample || item.pricePerBox === 0;
                                        return (
                                        <div key={idx} className="flex justify-between items-center bg-gray-50 p-4 border border-gray-100">
                                            <div>
                                                <p className="font-black text-gray-900 text-xs uppercase tracking-widest leading-none">
                                                    {item.name} {isSampleItem && <span className="text-blue-600 font-black text-[8px] tracking-widest">(SAMPLE)</span>}
                                                </p>
                                                <div className="flex flex-wrap gap-3 mt-2 text-[10px] font-bold text-gray-500 uppercase">
                                                    <span>{item.quantity} {isSampleItem ? (item.quantity === 1 ? 'Sample' : 'Samples') : (item.quantity === 1 ? 'Box' : 'Boxes')}</span>
                                                    {!isSampleItem && (
                                                        <>
                                                            <span>•</span>
                                                            <span>₹{item.pricePerBox ? item.pricePerBox.toLocaleString() : '0'}/box</span>
                                                        </>
                                                    )}
                                                    {item.selectedSize && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="text-blue-600">Size: {item.selectedSize}</span>
                                                        </>
                                                    )}
                                                    {item.selectedColor && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="text-blue-600">Color: {item.selectedColor}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-black italic ${isSampleItem ? 'text-green-600 uppercase text-xs' : 'text-gray-900'}`}>
                                                    {isSampleItem ? 'FREE' : `₹${((item.pricePerBox || 0) * item.quantity).toLocaleString()}`}
                                                </p>
                                            </div>
                                        </div>
                                    )})}
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-gray-900 text-white p-6">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Total Amount (COD)</span>
                                <span className="text-3xl font-black italic">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                            </div>

                            {/* Admin Action Buttons */}
                            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
                                {selectedOrder.status === 'Pending' ? (
                                    <>
                                        <button 
                                            onClick={() => setUpdateModal({ isOpen: true, status: 'Processing', note: '' })}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 font-black text-xs uppercase tracking-widest transition-colors shadow-lg shadow-blue-500/20"
                                        >
                                            Accept Order
                                        </button>
                                        <button 
                                            onClick={() => setUpdateModal({ isOpen: true, status: 'Cancelled', note: '' })}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 font-black text-xs uppercase tracking-widest transition-colors shadow-lg shadow-red-500/20"
                                        >
                                            Cancel Order
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex-1 text-center py-2">
                                        <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                                            Current Status: <span className="text-gray-900">{selectedOrder.status}</span>
                                        </p>
                                        {selectedOrder.adminNote && (
                                            <p className="text-sm font-bold text-gray-600 mt-2 italic bg-white p-3 border border-gray-200">
                                                Note: "{selectedOrder.adminNote}"
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Status Update Note Modal */}
            {updateModal.isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-white max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 rounded-none overflow-hidden">
                        <div className={`p-6 text-white ${updateModal.status === 'Cancelled' ? 'bg-red-600' : 'bg-blue-600'}`}>
                            <h3 className="text-lg font-black uppercase tracking-widest italic flex items-center justify-between">
                                {updateModal.status === 'Cancelled' ? 'Cancel Order' : 'Accept Order'}
                                <button onClick={() => setUpdateModal({ isOpen: false, status: '', note: '' })} className="hover:opacity-75 transition-opacity">
                                    <HiX className="text-xl" />
                                </button>
                            </h3>
                        </div>
                        <div className="p-6">
                            <label className="block text-xs font-black text-gray-900 uppercase tracking-widest mb-3">
                                Message for Customer
                            </label>
                            <textarea
                                value={updateModal.note}
                                onChange={(e) => setUpdateModal({ ...updateModal, note: e.target.value })}
                                placeholder={updateModal.status === 'Cancelled' ? "e.g., Sorry, out of stock." : "e.g., Will be delivered in 3-5 days."}
                                className="w-full border-2 border-gray-200 p-4 min-h-[120px] focus:outline-none focus:border-gray-900 transition-colors resize-none font-bold text-sm"
                            ></textarea>
                            <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-widest">
                                This message will be visible to the user on their orders page.
                            </p>
                            
                            <div className="mt-6 flex justify-end gap-3">
                                <button 
                                    onClick={() => setUpdateModal({ isOpen: false, status: '', note: '' })}
                                    className="px-6 py-3 font-black text-xs text-gray-500 hover:text-gray-900 uppercase tracking-widest transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={submitStatusUpdate}
                                    disabled={isUpdating}
                                    className={`px-8 py-3 font-black text-xs text-white uppercase tracking-widest transition-colors ${
                                        updateModal.status === 'Cancelled' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                                    } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isUpdating ? 'Updating...' : 'Confirm'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;