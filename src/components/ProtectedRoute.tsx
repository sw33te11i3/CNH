import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { currentUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'admin') {
            navigate('/admin/login');
        }
    }, [currentUser, navigate]);

    if (!currentUser || currentUser.role !== 'admin') {
        return null; // ou um loading spinner
    }

    return <>{children}</>;
}
