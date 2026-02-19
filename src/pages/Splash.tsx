import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Splash() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/login');
        }, 2500);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="flex items-center justify-center"
            >
                {/* Simple CSS Logo Construction until asset is provided/generated */}
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
        </div>
    );
}
