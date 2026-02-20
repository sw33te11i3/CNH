import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, LogOut, Settings, BookOpen,
    HelpCircle, Info, Star, FileText, ShieldCheck
} from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const navigate = useNavigate();

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const handleLogout = () => {
        onClose();
        navigate('/login');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black z-40"
                    />

                    {/* Sidebar Container */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
                        className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-[#F5F7FA] z-50 shadow-2xl flex flex-col font-sans"
                    >
                        {/* Header Section */}
                        <div className="px-6 pt-12 pb-6 bg-[#F5F7FA]">
                            {/* Logo Area */}
                            <div className="mb-6">
                                <img
                                    src="/logos/cnh-do-brasil-seeklogo.png"
                                    alt="CNH do Brasil"
                                    className="h-12 object-contain"
                                />
                            </div>

                            {/* User Info */}
                            <div className="space-y-1">
                                <h2 className="text-[#00285f] font-bold text-lg leading-tight uppercase">
                                    GABRIEL DE CARVALHO<br />ALMEIDA
                                </h2>
                                <p className="text-gray-500 text-sm font-medium">065.494.269-28</p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gray-300 mx-0 w-full" />

                        {/* Menu List */}
                        <div className="flex-1 overflow-y-auto py-2">
                            {/* Group 1 */}
                            <div className="space-y-1">
                                <MenuButton icon={Mail} label="Central de Mensagens" />
                                <MenuButton icon={ShieldCheck} label="Política de Privacidade" />
                                <MenuButton icon={FileText} label="Termo de Responsabilidade" />
                                <MenuButton icon={Star} label="Avaliar" />
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-gray-300 mx-0 w-full my-3" />

                            {/* Group 2 */}
                            <div className="space-y-1">
                                <MenuButton icon={Settings} label="Preferências" />
                                <MenuButton icon={BookOpen} label="Tutorial" />
                                <MenuButton icon={HelpCircle} label="Assistente Virtual" />
                                <MenuButton icon={Info} label="Sobre a CNH do Brasil" />
                            </div>
                        </div>

                        {/* Footer - Logout */}
                        <div className="p-0">
                            <div className="h-px bg-gray-300 mx-0 w-full" />
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-4 px-6 py-5 text-[#333] hover:bg-gray-100 transition-colors"
                            >
                                <LogOut size={24} className="text-[#333]" strokeWidth={2} />
                                <span className="text-[15px] font-normal text-[#333]">Sair da Conta</span>
                            </button>
                        </div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

const MenuButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center gap-4 px-6 py-4 text-[#333] hover:bg-gray-200 transition-colors"
    >
        <div className="text-[#333]">
            <Icon size={24} strokeWidth={1.8} />
        </div>
        <span className="text-[15px] font-medium text-[#333]">{label}</span>
    </button>
);
