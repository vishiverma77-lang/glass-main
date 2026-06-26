import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiArrowRight } from 'react-icons/hi';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to where they came from or home
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await register(name, email, password);
    }

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-full sm:w-[50vw] sm:h-screen sm:bg-[#111] overflow-hidden hidden sm:flex items-center justify-center p-12">
        <div className="text-white z-10 max-w-md">
            <h2 className="text-5xl font-black mb-6 leading-tight uppercase tracking-tighter italic">Welcome to <br/><span className="text-blue-600">Ceragreslux.</span></h2>
            <p className="text-gray-300 text-lg">Sign in to save your favorite collections, track your orders, and manage your trade pricing seamlessly.</p>
        </div>
        <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200" 
            alt="Tiles" 
            className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#111]"></div>
      </div>

      <div className="bg-white rounded-none shadow-2xl overflow-hidden w-full max-w-md relative z-10 sm:mr-auto sm:ml-[10%] border border-gray-100 p-8 md:p-12">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-500 font-medium">
            {isLogin ? "Enter your details to access your account." : "Join us for an exclusive experience."}
          </p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-none text-sm font-bold mb-6 border border-red-100 flex items-center gap-2">
                ⚠️ {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {!isLogin && (
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Full Name</label>
                <div className="relative">
                    <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input 
                        type="text" 
                        required 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="John Doe"
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-none outline-none focus:border-blue-600 focus:bg-white transition-colors" 
                    />
                </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Email Address</label>
            <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-none outline-none focus:border-blue-600 focus:bg-white transition-colors" 
                />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Password</label>
                {isLogin && <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-800">Forgot?</a>}
            </div>
            <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input 
                    type="password" 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-none outline-none focus:border-blue-600 focus:bg-white transition-colors" 
                />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-blue-600 text-white font-black py-4 rounded-none transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-8 disabled:opacity-70 group"
          >
            {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
            {!loading && <HiArrowRight className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 text-center bg-gray-50 p-4 rounded-none border border-gray-100">
          <p className="text-sm font-medium text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }} 
              className="text-blue-600 font-bold hover:text-blue-800"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
