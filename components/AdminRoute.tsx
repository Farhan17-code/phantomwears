import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminRouteProps {
    children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { isAdmin, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 flex justify-center">
                <div className="animate-spin h-8 w-8 border-4 border-zinc-600 border-t-white rounded-full"></div>
            </div>
        );
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute;