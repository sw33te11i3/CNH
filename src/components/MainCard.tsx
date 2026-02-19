import { motion } from 'framer-motion';

interface MainCardProps {
    title: string;
    subtitle: React.ReactNode;
    bgColor: string;
    imagePath: string; // Changed from icon to imagePath
    delay: number;
    onClick?: () => void;
}

export const MainCard = ({
    title, subtitle, bgColor, imagePath, delay, onClick
}: MainCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        onClick={onClick}
        className={`${bgColor} rounded-xl p-5 text-white flex justify-between items-center shadow-lg relative overflow-hidden h-32 active:scale-[0.98] transition-all cursor-pointer`}
    >
        <div className="z-10 flex flex-col justify-center h-full max-w-[55%] relative">
            <h3 className="font-bold text-lg mb-1 tracking-wide uppercase">{title}</h3>
            <div className="text-sm font-light opacity-95 leading-tight">{subtitle}</div>
        </div>

        {/* Image Assets (Road + Icon combined) */}
        {/* Positioned absolute to the right, covering the background curve effect */}
        <div className="absolute right-0 top-0 h-full w-[50%] opacity-90">
            <img
                src={imagePath}
                alt={title}
                className="w-full h-full object-contain object-right p-2"
            />
        </div>

        {/* Subtle overlay curve for depth if needed, but the image likely has the road */}
    </motion.div>
);
