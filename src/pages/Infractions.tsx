import { Car, ChevronRight, UserSquare2 } from 'lucide-react';
import { NavigationHeader } from '../components/NavigationHeader';

export function Infractions() {
    const OptionButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => (
        <button
            onClick={onClick}
            className="w-full bg-white px-6 py-5 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 transition-colors active:bg-gray-100 first:border-t-0"
        >
            <div className="flex items-center gap-4">
                <div className="text-blue-600">
                    <Icon size={24} />
                </div>
                <span className="text-gray-700 font-medium text-[15px]">{label}</span>
            </div>
            <ChevronRight size={20} className="text-blue-400" strokeWidth={2.5} />
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <NavigationHeader title="INFRAÇÕES" />

            <div className="mt-8"> {/* Simple margin-top as seen in screenshot */}
                <OptionButton
                    icon={UserSquare2}
                    label="Por Infrator"
                />
                <OptionButton
                    icon={Car}
                    label="Por Veículo"
                />
            </div>
        </div>
    );
}
