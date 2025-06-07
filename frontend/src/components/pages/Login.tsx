import React from 'react';
import { userService } from '../../services';
import { useLocation } from 'react-router-dom';

export const LoginPage: React.FC = () => {
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const handleLogin = () => {
        // Lưu URL đích để sau khi đăng nhập thành công sẽ chuyển hướng về đó
        sessionStorage.setItem('redirectAfterLogin', from);

        // Sử dụng URL hiện tại làm redirectUri cho Keycloak
        userService.doLogin(window.location.origin);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6">BookStore Login</h2>
                <p className="text-black-600 text-center mb-8">
                    Please login to continue shopping
                </p>
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Sign in with Keycloak
                </button>
            </div>
        </div>
    );
};
