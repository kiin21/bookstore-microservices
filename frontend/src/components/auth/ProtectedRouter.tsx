import { Navigate } from "react-router-dom";
import { userService } from "../../services";
import type { JSX } from "react";

interface ProtectedRouteProps {
    children: JSX.Element;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const isAuthenticated = userService.isLoggedIn();

    if (!isAuthenticated) {
        return children;
    } else {
        return <Navigate to="/" replace />;
    }
}