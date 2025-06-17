import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'accessToken';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(() => localStorage.getItem(TOKEN_KEY));
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        console.log(`[AuthContext - Tải lại trang] Đang kiểm tra token trong localStorage...`);

        if (token) {
            console.log(`   -> Đã tìm thấy token.`);
            try {
                const decoded = jwtDecode(token);
                const expiryDate = new Date(decoded.exp * 1000);
                const isExpired = expiryDate < new Date();

                console.log(`   -> Token sẽ hết hạn lúc: ${expiryDate.toLocaleString()}`);
                console.log(`   -> Token đã hết hạn? ${isExpired}`);

                if (isExpired) {
                    console.error("   -> Lỗi: Token đã hết hạn. Đang xóa...");
                    localStorage.removeItem(TOKEN_KEY);
                    setAuthToken(null);
                    setUser(null);
                } else {
                    console.log("   -> OK: Token hợp lệ. Đang set user state.");
                    setUser(decoded);
                }
            } catch (e) {
                console.error("   -> Lỗi: Token không thể giải mã. Đang xóa...", e);
                localStorage.removeItem(TOKEN_KEY);
                setAuthToken(null);
            }
        } else {
            console.log("   -> Không tìm thấy token trong localStorage.");
        }
        setIsLoading(false);
    }, [authToken]);

    const login = (token) => {
        if (token) {
            console.log(`%c[AuthContext - LOGIN] Đang lưu token vào localStorage...`, "color: green; font-weight: bold;");
            localStorage.setItem(TOKEN_KEY, token);
            setAuthToken(token); // Cập nhật state để trigger useEffect ở trên
        }
    };

    const logout = () => {
        console.log(`%c[AuthContext - LOGOUT] Đang xóa token...`, "color: red; font-weight: bold;");
        localStorage.removeItem(TOKEN_KEY);
        setAuthToken(null);
        setUser(null);
        navigate('/');
    };

    const value = { isAuthenticated: !!authToken, user, isLoading, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);