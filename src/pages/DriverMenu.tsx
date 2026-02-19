import { useNavigate } from 'react-router-dom';
import { CreditCard, UserCheck, Microscope, GraduationCap, ParkingCircle } from 'lucide-react';
import { NavigationHeader } from '../components/NavigationHeader';

export function DriverMenu() {
    const navigate = useNavigate();

    const MenuButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => (
        <button
            onClick={onClick}
            className="bg-white p-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center gap-4 h-36 hover:shadow-lg transition-all active:scale-[0.98]"
        >
            <div className="text-blue-900">
                <Icon size={40} strokeWidth={1.5} />
            </div>
            <span className="text-[11px] font-bold text-center text-blue-900 uppercase leading-tight max-w-[80%]">
                {label}
            </span>
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <NavigationHeader title="CONDUTOR" />

            <div className="p-4 space-y-6">
                {/* Screenshot 17:13 shows meaningful gap between blue header and white card. Header is rounded. */}
                {/* NavigationHeader has rounded-b-[35px] by default now. */}
                {/* So just standard flow. */}
                {/* Info Card - Styled closer to print */}
                <div className="bg-white rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Informações do Condutor</h2>

                    <div className="space-y-4">
                        <div>
                            <span className="text-xs font-bold text-gray-900 block mb-1">Nome</span>
                            <span className="text-gray-500 text-sm tracking-wide">G****** D* C******* A******</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs font-bold text-gray-900 block mb-1">CPF</span>
                                <span className="text-gray-500 text-sm tracking-wide">***.494.269-**</span>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-gray-900 block mb-1">Sexo</span>
                                <span className="text-gray-500 text-sm tracking-wide">MASCULINO</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs font-bold text-gray-900 block mb-1">Categoria</span>
                                <span className="text-gray-500 text-sm tracking-wide">AB</span>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-gray-900 block mb-1">UF de Emissão</span>
                                <span className="text-gray-500 text-sm tracking-wide">SC</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs font-bold text-gray-900 block mb-1">Data de Validade</span>
                                <span className="text-gray-500 text-sm tracking-wide">01/09/2032</span>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-gray-900 block mb-1">Data de Emissão</span>
                                <span className="text-gray-500 text-sm tracking-wide">02/09/2022</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <MenuButton
                        icon={CreditCard}
                        label="HABILITAÇÃO"
                        onClick={() => navigate('/app/cnh')}
                    />
                    <MenuButton icon={UserCheck} label="CADASTRO POSITIVO" />
                    <MenuButton icon={Microscope} label="EXAMES TOXICOLÓGICOS" />
                    <MenuButton icon={GraduationCap} label="CURSOS ESPECIALIZADOS" />
                    <MenuButton icon={ParkingCircle} label="CREDENCIAL DE ESTACIONAMENTO" />
                </div>
            </div>
        </div>
    );
}
