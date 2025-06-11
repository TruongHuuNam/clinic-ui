// File: src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode'; // Cài đặt thư viện: npm install jwt-decode

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('accessToken'));
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setAuthToken(token);
                    setUser(decodedToken);
                }
            } catch (error) {
                logout();
            }
        }
        setIsLoading(false); // Hoàn tất kiểm tra ban đầu
    }, []);

    const login = (token) => {
        localStorage.setItem('accessToken', token);
        setAuthToken(token);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setAuthToken(null);
        setUser(null);
    };
    const value = {
        isAuthenticated: !!authToken,
        user,
        isLoading, // Truyền isLoading ra ngoài
        login,
        logout
    };

    //const isAuthenticated = !!authToken;
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};