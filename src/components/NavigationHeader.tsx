import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface NavigationHeaderProps {
    title: string;
    subtitle?: string;
    onBack?: () => void;
    className?: string; // Allow overrides
}

export function NavigationHeader({ title, subtitle, onBack, className = "" }: NavigationHeaderProps) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    return (
        // Default has rounded-b-[35px], pt-10.
        // If stacked, we might want to reduce pt or remove rounded-b from the element above it.
        // Actually, this element carries the rounded bottom. The element ABOVE (AppHeader) should lose its rounded bottom.
        // And this element should have 0 top padding if stacked immediately below? Or just standard padding to separate content?
        // In the print, "CONDUTOR" is close to top.

        // In the print, "CONDUTOR" is close to top.

        <div className={`bg-[#00285f] text-white pt-5 pb-6 px-6 flex items-center ${className?.includes('rounded') ? '' : 'rounded-b-[20px]'} shadow-lg relative z-20 ${className}`}>
            <button
                onClick={handleBack}
                className="mr-5 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors active:scale-95 backdrop-blur-sm"
            >
                <ChevronLeft size={24} strokeWidth={3} />
            </button>
            <div>
                <h1 className="text-lg font-bold uppercase tracking-wide leading-none">{title}</h1>
                {subtitle && (
                    <p className="text-[11px] text-blue-100 mt-1 font-light opacity-90">{subtitle}</p>
                )}
            </div>
        </div>
    );
}
