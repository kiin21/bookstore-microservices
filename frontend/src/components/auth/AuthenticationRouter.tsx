import { Navigate, useLocation } from "react-router-dom";
import { userService } from "../../services";
import type { JSX } from "react";

interface AuthenticatedRouteProps {
    children: JSX.Element;
}

export function AuthenticatedRoute({ children }: AuthenticatedRouteProps) {
    const location = useLocation();
    const isAuthenticated = userService.isLoggedIn();

    if (isAuthenticated) {
        return children;
    } else {
        // Chuyển hướng đến trang đăng nhập và lưu vị trí hiện tại
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
}