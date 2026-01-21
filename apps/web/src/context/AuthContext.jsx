import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('ruangkopi_token'));
    const [loading, setLoading] = useState(true);

    // Check if user is authenticated on mount
    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = localStorage.getItem('ruangkopi_token');

            if (storedToken) {
                try {
                    const userData = await authApi.getMe();
                    setUser(userData);
                    setToken(storedToken);
                } catch (error) {
                    // Token invalid or expired
                    console.error('Auth check failed:', error);
                    localStorage.removeItem('ruangkopi_token');
                    localStorage.removeItem('ruangkopi_user');
                    setUser(null);
                    setToken(null);
                }
            }

            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authApi.login(email, password);

            // Store token and user
            localStorage.setItem('ruangkopi_token', response.token);
            localStorage.setItem('ruangkopi_user', JSON.stringify(response.user));

            setToken(response.token);
            setUser(response.user);

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('ruangkopi_token');
        localStorage.removeItem('ruangkopi_user');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
