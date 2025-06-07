import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { AuthenticatedRoute, ProtectedRoute } from "./components/auth";
import {userService} from "./services";
import { LoginPage, LogoutPage, Home, CartPage } from "./components/pages";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Orders = () => <div>📦 Orders Page</div>;

// Component để xử lý redirect sau khi đăng nhập Keycloak
const KeycloakCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Lấy URL đích từ sessionStorage
        const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/';
        sessionStorage.removeItem('redirectAfterLogin');

        // Chuyển hướng đến URL đích
        navigate(redirectPath, { replace: true });
    }, [navigate]);

    return <div>Processing authentication...</div>;
};

function App() {
    const location = useLocation();

    // Kiểm tra nếu đây là callback từ Keycloak
    useEffect(() => {
        const handleKeycloakCallback = async () => {
            if (location.search.includes('state=') && location.search.includes('code=')) {
                // Đây là callback từ Keycloak, khởi tạo lại Keycloak để xử lý token
                try {
                    await userService.getKeycloak().init({
                        onLoad: 'check-sso',
                        checkLoginIframe: false
                    });
                } catch (error) {
                    console.error("Failed to process Keycloak callback:", error);
                }
            }
        };

        handleKeycloakCallback();
    }, [location]);

    return (
        <Routes>
            {/* Route xử lý callback từ Keycloak */}
            <Route path="/callback" element={<KeycloakCallback />} />

            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="home" element={<Home />} />

                {/* Public cart */}
                <Route path="cart" element={<CartPage />} />

                <Route path="login" element={
                    <ProtectedRoute>
                        <LoginPage />
                    </ProtectedRoute>
                } />

                {/* Protected route */}
                <Route path="orders" element={
                    <AuthenticatedRoute>
                        <Orders />
                    </AuthenticatedRoute>
                } />

                {/* Logout route */}
                <Route path="logout" element={<LogoutPage />} />
            </Route>
        </Routes>
    );
}

export default App;