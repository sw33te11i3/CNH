import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

export function MainLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Sidebar is available if needed, but triggered from page-specific headers now */}
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
