import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('cda_auth_token') === 'simulated-token';
    });
    const [userRole, setUserRole] = useState(() => {
        return localStorage.getItem('cda_auth_role') || null;
    });

    const login = (username, password) => {
        // Employee Logic
        if (username === 'caixa' && password === '1234') {
            localStorage.setItem('cda_auth_token', 'simulated-token');
            localStorage.setItem('cda_auth_role', 'employee');
            setIsAuthenticated(true);
            setUserRole('employee');
            return true;
        }

        // Admin Logic
        if (username === 'CasaDosAssados' && password === 'Assados@2k26') {
            localStorage.setItem('cda_auth_token', 'simulated-token');
            localStorage.setItem('cda_auth_role', 'admin');
            setIsAuthenticated(true);
            setUserRole('admin');
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('cda_auth_token');
        localStorage.removeItem('cda_auth_role');
        setIsAuthenticated(false);
        setUserRole(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
