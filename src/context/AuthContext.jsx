import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const ADMIN_API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth/admin`;
    const USER_API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/users`;

    useEffect(() => {
        const checkAuth = async () => {
            const adminToken = localStorage.getItem('adminToken');
            const userToken = localStorage.getItem('userToken');

            try {
                // Check Admin
                if (adminToken) {
                    try {
                        const res = await axios.get(`${ADMIN_API_URL}/check`, {
                            headers: { Authorization: `Bearer ${adminToken}` }
                        });
                        setAdmin(res.data);
                    } catch (error) {
                        if (error.response && error.response.status === 401) {
                            localStorage.removeItem('adminToken');
                        }
                    }
                }

                // Check User
                if (userToken) {
                    try {
                        const res = await axios.get(`${USER_API_URL}/check`, {
                            headers: { Authorization: `Bearer ${userToken}` }
                        });
                        setUser(res.data);
                    } catch (error) {
                        if (error.response && error.response.status === 401) {
                            localStorage.removeItem('userToken');
                        }
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Admin Login - Password Based
    const login = async (email, password) => {
        try {
            const res = await axios.post(`${ADMIN_API_URL}/login`, { email, password });
            
            if (res.data.success && res.data.token) {
                const { token, admin: adminData } = res.data;
                localStorage.setItem('adminToken', token);
                setAdmin(adminData);
                return { success: true };
            }
            return { success: false, message: "Invalid response from server" };
        } catch (error) {
            const serverMsg = error.response?.data?.message || 'Admin login failed.';
            return { 
                success: false, 
                message: serverMsg
            };
        }
    };

    // Verify OTP - Disabled
    const verifyOtp = async () => {
        return { success: false, message: "OTP disabled. Use password login." };
    };


    const logout = () => {
        localStorage.removeItem('adminToken');
        setAdmin(null);
    };

    // User Auth Functions
    const userLogin = async (email, password) => {
        try {
            const res = await axios.post(`${USER_API_URL}/login`, { email, password });
            const { token, user: userData } = res.data;
            
            localStorage.setItem('userToken', token);
            setUser(userData);
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed.' 
            };
        }
    };

    const userRegister = async (email, phone, password) => {
        try {
            const res = await axios.post(`${USER_API_URL}/register`, { email, phone, password });
            const { token, user: userData } = res.data;
            
            localStorage.setItem('userToken', token);
            setUser(userData);
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Registration failed.' 
            };
        }
    };

    const userLogout = () => {
        localStorage.removeItem('userToken');
        setUser(null);
    };

    const value = {
        admin,
        user,
        loading,
        login,
        verifyOtp,
        logout,
        userLogin,
        userRegister,
        userLogout,
        isAdmin: !!admin,
        isUser: !!user
    };


    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
