import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Sidebar } from '../components/Sidebar';

export function MainLayout() {
    const { currentUser, loading } = useUser();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && !currentUser) {
            navigate('/login');
        }
    }, [currentUser, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#00285f]">
                <div className="text-white flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <p className="font-medium">Carregando...</p>
                </div>
            </div>
        );
    }

    if (!currentUser) return null;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 pb-20 overflow-y-auto">
                <Outlet context={{ openSidebar: () => setIsSidebarOpen(true) }} />
            </main>
        </div>
    );
}
