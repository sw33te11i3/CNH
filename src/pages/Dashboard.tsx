import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';

// Import images directly if using Vite to ensure they are bundled, 
// OR reference them from public folder if moved there. 
// Given the folder is in root `Icones_dashboard`, we'll need to move them to `public/icones` or import them relatively.
// Moving them to public is safer for dynamic paths, but imports work too.
// Let's assume we'll move them to public/assets/dashboard_icons or just import relative to this file if possible.
// IMPORTANT: The user said "na pasta icones...". If it's outside src, Vite won't import it easily unless configured or in public.
// I will move them to public folder first in a separate step or just reference via absolute URI if local dev? No, browser needs web URL.
// Best approach: Move files to `public/images` via run_command (or simulate it). 
// Since I can't easily move files with `move`, I will read/write or just assume I can import if I add them to src/assets.
// Wait, I can't move files easily. I will assume they are in `public` or I will use `src/assets`.
// I'll try to use the absolute path approach isn't good for web.
// I will attempt to read them and write them to `public/icons` to be safe and clean.

import { MainCard } from '../components/MainCard';

// Temporary placeholders until I move files. 
// Actually I will invoke a move command next. For now, let's write the component assuming they are in `/icons/`.

export function Dashboard() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col h-full bg-gray-100 pb-20">
            {/* Dashboard Header - REPLACED with component, rounded-b added via component or wrapper */}
            <AppHeader className="rounded-b-[40px] shadow-lg mb-6" />

            <div className="flex-1 px-4 space-y-4 overflow-y-auto">
                <MainCard
                    title="CONDUTOR"
                    subtitle={<>Gerencie sua<br />habilitação</>}
                    bgColor="bg-[#00a859]" // Green
                    imagePath="/icones/icones_condutor.png"
                    delay={0.1}
                    onClick={() => navigate('/app/condutor')}
                />

                <MainCard
                    title="VEÍCULOS"
                    subtitle={<>Acesso ao <strong>CRLV-e</strong>,<br />venda digital</>}
                    bgColor="bg-[#fdb913]" // Yellow
                    imagePath="/icones/icones_veiculos.png"
                    delay={0.2}
                />

                <MainCard
                    title="INFRAÇÕES"
                    subtitle={<>Visualize e pague infrações<br />com até <strong>40% de desconto</strong></>}
                    bgColor="bg-[#2a4b9b]" // Blue
                    imagePath="/icones/icones_infracoes.png"
                    delay={0.3}
                    onClick={() => navigate('/app/infracoes')}
                />

                <MainCard
                    title="EDUCAÇÃO"
                    subtitle={<>Conheça nossa<br /><strong>plataforma de cursos</strong></>}
                    bgColor="bg-[#66afe9]" // Light Blue
                    imagePath="/icones/icones_educacao.png"
                    delay={0.4}
                />

                {/* Gov Footer Logos */}
                <div className="mt-8 pb-8 flex justify-between items-center opacity-80 grayscale scale-90">
                    <div className="flex items-center gap-1">
                        <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                        <span className="font-bold text-gray-600 text-xs">Serpro</span>
                    </div>
                    <div className="text-[10px] text-center font-bold text-gray-500 leading-tight">
                        MINISTÉRIO DOS<br />TRANSPORTES
                    </div>
                    <div className="font-black text-sm text-gray-600">
                        GOVERNO FEDERAL
                    </div>
                </div>

            </div>
        </div>
    );
}
