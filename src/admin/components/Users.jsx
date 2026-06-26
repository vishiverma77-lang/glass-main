import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineUserGroup, HiOutlineShieldCheck, HiOutlineExternalLink } from 'react-icons/hi';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { logout } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('adminToken');
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(res.data);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    // Token expired or invalid
                    logout();
                    window.location.href = '/admin/login';
                    return;
                }
                setError('Failed to load users. Please check your admin privileges.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [logout]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Accessing User Database...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <HiOutlineUserGroup size={28} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Users</p>
                        <p className="text-3xl font-black text-slate-900">{users.length}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                        <HiOutlineShieldCheck size={28} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Admins</p>
                        <p className="text-3xl font-black text-slate-900">{users.filter(u => u.role === 'admin').length}</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 text-sm font-bold border-l-4 border-red-600">
                    {error}
                </div>
            )}

            {/* Users Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Registered User Base</h3>
                    <div className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Real-time Data
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity & Contact</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Activity</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Login Source</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {user.email.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="max-w-[200px] truncate">
                                                <p className="text-sm font-black text-slate-800">{user.email.split('@')[0]}</p>
                                                <p className="text-xs font-bold text-slate-400 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-bold text-slate-600">{user.phone || 'N/A'}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${user.role === 'admin' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-sm font-bold text-slate-800">{formatDate(user.lastLogin)}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="inline-flex flex-col items-end">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-black text-slate-800 px-2 py-1 bg-slate-100 rounded-lg">{user.lastLoginIP || 'Unknown'}</span>
                                                {user.lastLoginIP && user.lastLoginIP !== 'Unknown' && (
                                                    <a
                                                        href={`https://ipapi.co/${user.lastLoginIP}/`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-blue-500 hover:text-black transition-colors"
                                                    >
                                                        <HiOutlineExternalLink size={16} />
                                                    </a>
                                                )}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                {user.lastLoginLocation || 'Network Access'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="text-slate-400 font-bold italic">No records found in the user vault.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
