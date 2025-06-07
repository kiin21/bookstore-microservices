import React, { useEffect } from 'react';
import { userService } from '../../services';
import { Navigate } from 'react-router-dom';

export const LogoutPage: React.FC = () => {
    useEffect(() => {
        userService.doLogout();
    }, []);

    return <Navigate to="/" />;
};
