import { useNavigate } from 'react-router-dom';
import { IdCard, UserCheck, Microscope, Scroll, ParkingCircle } from 'lucide-react';
import { NavigationHeader } from '../components/NavigationHeader';
import { useUser } from '../contexts/UserContext';

export function DriverMenu() {
    const navigate = useNavigate();
    const { currentUser } = useUser();
    const data = currentUser?.cnhData;

    // Função para mascarar o nome (G****** D* C******* A******)
    const maskName = (fullName: string) => {
        if (!fullName) return '';
        return fullName.split(' ').map(part => {
            if (part.length <= 1) return part;
            return part[0] + '*'.repeat(part.length - 1);
        }).join(' ');
    };

    const MenuButton = ({
        icon: Icon,
        label,
        onClick,
        allowWrap = false
    }: {
        icon: any,
        label: string,
        onClick?: () => void,
        allowWrap?: boolean
    }) => (
        <button
            onClick={onClick}
            className="bg-white p-4 rounded-xl shadow-[0_4px_6px_2px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center gap-4 h-36 hover:shadow-lg transition-all active:scale-[0.98]"
        >
            <div className="text-[#00285f]">
                <Icon size={40} strokeWidth={1.5} />
            </div>
            <span className={`text-[10px] font-bold text-center text-[#00285f] uppercase leading-tight ${allowWrap ? 'max-w-[90%]' : 'whitespace-nowrap'}`}>
                {label}
            </span>
        </button>
    );

    if (!data) return <div>Carregando...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <NavigationHeader title="CONDUTOR" />

            <div className="p-4 space-y-6">
                {/* Info Card - Styled closer to print */}
                <div className="bg-white rounded-xl p-6">
                    <h2 className="text-lg font-bold text-[#00285f] mb-4 border-b border-gray-100 pb-3">Informações do Condutor</h2>

                    <div className="space-y-4">
                        <div>
                            <span className="text-xs font-bold text-[#00285f] block mb-1">Nome</span>
                            <span className="text-gray-500 text-sm tracking-wide break-words">{maskName(data.name)}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs font-bold text-[#00285f] block mb-1">CPF</span>
                                <span className="text-gray-500 text-sm tracking-wide">{data.cpf}</span>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-[#00285f] block mb-1">Sexo</span>
                                <span className="text-gray-500 text-sm tracking-wide">{data.sex}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs font-bold text-[#00285f] block mb-1">Categoria</span>
                                <span className="text-gray-500 text-sm tracking-wide">{data.category}</span>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-[#00285f] block mb-1">UF de Emissão</span>
                                <span className="text-gray-500 text-sm tracking-wide">{data.issuePlace}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs font-bold text-[#00285f] block mb-1">Data de Validade</span>
                                <span className="text-gray-500 text-sm tracking-wide">{data.validityDate}</span>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-[#00285f] block mb-1">Data de Emissão</span>
                                <span className="text-gray-500 text-sm tracking-wide">{data.issueDate}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <MenuButton
                        icon={IdCard}
                        label="HABILITAÇÃO"
                        onClick={() => navigate('/app/cnh')}
                    />
                    <MenuButton icon={UserCheck} label="CADASTRO POSITIVO" />
                    <MenuButton icon={Microscope} label="EXAMES TOXICOLÓGICOS" />
                    <MenuButton icon={Scroll} label="CURSOS ESPECIALIZADOS" />
                    <MenuButton
                        icon={ParkingCircle}
                        label="CREDENCIAL DE ESTACIONAMENTO"
                        allowWrap={true}
                    />
                </div>
            </div>
        </div>
    );
}

