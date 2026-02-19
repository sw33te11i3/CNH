import { Menu, Bell } from 'lucide-react';

interface HeaderProps {
    onMenuClick: () => void;
    title?: string;
}

export function Header({ onMenuClick, title = "GABRIEL" }: HeaderProps) {
    return (
        <header className="bg-blue-900 text-white p-4 flex items-center justify-between shadow-md relative z-10">
            <div className="flex items-center gap-4">
                <button onClick={onMenuClick} className="p-1 hover:bg-blue-800 rounded-md transition-colors">
                    <Menu size={32} />
                </button>
                <h1 className="text-xl font-medium tracking-wide uppercase">{title}</h1>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-1 hover:bg-blue-800 rounded-full transition-colors">
                    <Bell size={24} />
                </button>
                <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center bg-blue-900">
                    <span className="font-bold text-lg">G</span>
                </div>
            </div>
        </header>
    );
}
