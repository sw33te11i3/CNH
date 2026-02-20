import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export function Splash() {
    const navigate = useNavigate();
    const { currentUser, loading } = useUser();
    const [minTimeElapsed, setMinTimeElapsed] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMinTimeElapsed(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (minTimeElapsed && !loading) {
            if (currentUser) {
                navigate('/app/dashboard');
            } else {
                navigate('/login');
            }
        }
    }, [minTimeElapsed, loading, currentUser, navigate]);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 overflow-hidden">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="flex items-center justify-center"
            >
                <div className="flex items-center">
                    <h1 className="text-7xl font-black tracking-tighter text-blue-600">CNH</h1>
                    <div className="relative h-20 w-16 -ml-2 z-[-1]">
                        <div className="absolute inset-y-0 left-0 w-full bg-yellow-400 transform skew-x-[-20deg]"></div>
                        <div className="absolute inset-y-0 left-0 w-1/2 bg-blue-600 rounded-r-full transform"></div>
                    </div>
                </div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-green-600 text-white font-black text-2xl px-4 py-1 mt-[-10px] relative z-10 w-full max-w-[280px] text-center"
            >
                DO BRASIL
            </motion.div>

            {/* Indicação sutil de carregamento se o Supabase demorar */}
            {!minTimeElapsed || loading ? (
                <div className="absolute bottom-12 flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            ) : null}
        </div>
    );
}
