import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiMail, HiLockClosed, HiArrowRight, HiShieldCheck, HiEye, HiEyeOff } from 'react-icons/hi';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAdmin } = useAuth();

    const from = location.state?.from?.pathname || "/admin";

    useEffect(() => {
        if (isAdmin) {
            navigate(from, { replace: true });
        }
    }, [isAdmin, navigate, from]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);

        const res = await login(email, password);
        if (res.success) {
            navigate(from, { replace: true });
        } else {
            setError(res.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
                <div className="bg-slate-900 p-8 text-center text-white">
                    <div className="bg-blue-600 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                        <HiShieldCheck className="text-4xl" />
                    </div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter italic">Ceragres Admin</h1>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                        Secure Authentication Portal
                    </p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700 text-[10px] font-black uppercase animate-in shake">
                           {error}
                        </div>
                    )}
                    
                    {successMsg && !error && (
                        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 mb-6 text-emerald-700 text-[10px] font-black uppercase animate-in slide-in-from-top-1">
                           {successMsg}
                        </div>
                    )}

                    <div className="mb-8 text-center">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em] mb-1">
                            Administrator Access
                        </h3>
                        <div className="h-0.5 w-12 bg-blue-600 mx-auto rounded-full"></div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <HiMail className="text-lg" />
                                </div>
                                <input 
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-5 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800"
                                    placeholder="Enter Email Address"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                    <HiLockClosed className="text-lg" />
                                </div>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-12 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800"
                                    placeholder="Enter Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                                >
                                    {showPassword ? <HiEyeOff className="text-lg" /> : <HiEye className="text-lg" />}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full py-4 rounded-xl text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all ${loading ? 'bg-slate-400' : 'bg-slate-900 hover:bg-black shadow-xl shadow-slate-900/20 active:scale-95'}`}
                        >
                            {loading ? 'Authenticating...' : 'Access Dashboard'} <HiArrowRight />
                        </button>
                    </form>
                </div>

                <div className="bg-slate-50 p-6 text-center border-t border-slate-100 mt-auto">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">
                        Authorized Personnel Only • IP Logged
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;

