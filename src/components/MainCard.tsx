import { motion } from 'framer-motion';

interface MainCardProps {
    title: string;
    subtitle: React.ReactNode;
    bgColor: string;
    imagePath: string; // Changed from icon to imagePath
    delay: number;
    textColor?: string;
    onClick?: () => void;
}

export const MainCard = ({
    title, subtitle, bgColor, imagePath, textColor = "text-white", onClick
}: MainCardProps) => (
    <motion.div
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        className={`${bgColor} rounded-xl p-5 ${textColor} flex justify-between items-center shadow-[0_4px_10px_rgba(0,0,0,0.35)] relative overflow-hidden h-[105px] transition-all duration-300 cursor-pointer hover:shadow-[0_6px_15px_rgba(0,0,0,0.4)]`}
    >
        <div className="z-10 flex flex-col justify-center h-full max-w-[55%] relative">
            <h3 className="font-bold text-[17px] mb-0.5 tracking-wide uppercase">{title}</h3>
            <div className="text-[13px] font-normal opacity-95 leading-tight">{subtitle}</div>
        </div>

        {/* Image Assets (Road + Icon combined) */}
        {/* Positioned absolute to the right, covering the background curve effect */}
        <div className="absolute right-0 top-0 h-full w-[60%] opacity-100">
            <img
                src={imagePath}
                alt={title}
                className="w-full h-full object-cover object-right pointer-events-none"
            />
        </div>

        {/* Subtle overlay curve for depth if needed, but the image likely has the road */}
    </motion.div>
);
