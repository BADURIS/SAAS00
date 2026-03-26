import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('cda_auth_user');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error('Auth sync error:', error);
            return null;
        }
    });

    const isAuthenticated = !!user;

    const login = (username, password) => {
        let role = null;

        if (username === 'CasaDosAssados' && password === 'Assados@2k26') {
            role = 'manager';
        } else if (username === 'Balcao01' && password === 'Atender@2026') {
            role = 'employee';
        }

        if (role) {
            const userData = { username, role, token: 'simulated-token' };
            localStorage.setItem('cda_auth_user', JSON.stringify(userData));
            setUser(userData);
            return role;
        }
        return null;
    };

    const logout = () => {
        localStorage.removeItem('cda_auth_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
