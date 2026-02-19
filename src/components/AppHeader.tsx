import { Menu, Bell } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

interface AppHeaderProps {
    className?: string;
}

export function AppHeader({ className = "" }: AppHeaderProps) {
    const { openSidebar } = useOutletContext<{ openSidebar: () => void }>();

    return (
        <div className={`bg-[#00285f] text-white pt-12 pb-6 px-6 flex justify-between items-center relative z-30 ${className}`}>
            <div className="flex items-center gap-4">
                <button
                    onClick={openSidebar}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                    <Menu size={32} strokeWidth={2} />
                </button>
                <span className="font-bold text-lg tracking-wide">GABRIEL</span>
            </div>
            <div className="flex items-center gap-4">
                <button className="p-1 hover:bg-white/10 rounded-full transition-colors relative">
                    <Bell size={28} />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#00285f]"></span>
                </button>
                <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center bg-white/10 text-sm font-bold">
                    G
                </div>
            </div>
        </div>
    );
}
