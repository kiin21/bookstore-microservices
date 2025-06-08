import React, { useEffect } from 'react';
import { UserService } from '../../services';
import { Navigate } from 'react-router-dom';

export const LogoutPage: React.FC = () => {
    useEffect(() => {
        UserService.doLogout();
    }, []);

    return <Navigate to="/" />;
};
