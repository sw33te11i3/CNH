import React, { useState } from 'react';
import { NavigationHeader } from '../components/NavigationHeader';
import { QRCodeSVG } from 'qrcode.react';
import { Share2, Trash2, UserSquare2, Files } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { clsx } from 'clsx';

export function DigitalDriverLicense() {
    const { currentUser } = useUser();
    const data = currentUser?.cnhData;
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showQrMessage, setShowQrMessage] = useState(false);

    const handleQrClick = () => {
        setShowQrMessage(true);
        setTimeout(() => setShowQrMessage(false), 3000);
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollLeft = e.currentTarget.scrollLeft;
        const width = e.currentTarget.offsetWidth;
        const index = Math.round(scrollLeft / width);
        setCurrentSlide(index);
    };

    if (!data) return <div className="p-8 text-center">Carregando dados da CNH...</div>;

    const slides = [
        { id: 'profile', src: data.profileImage, label: 'Perfil' },
        { id: 'front', src: data.cnhFrontImage, label: 'Frente' },
        { id: 'back', src: data.cnhBackImage, label: 'Verso' },
        { id: 'qrcode', src: data.qrCodeImage, label: 'QR Code' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-8">
            <NavigationHeader
                title="HABILITAÇÃO"
                subtitle={`Atualizado em: ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString().slice(0, 5)}`}
                className="pt-5 pb-5 rounded-b-[20px]"
            />

            <div className="pt-0 px-4">

                <p className="text-[#1351b4] text-center text-[13px] font-medium mb-1 mt-1 hover:underline cursor-pointer">
                    Verifique autenticidade do QR Code com o app <span className="font-bold">Vio</span>
                </p>

                {/* Carousel Container */}
                <div className="relative w-full max-w-sm mx-auto aspect-[3/4.5] overflow-hidden">
                    <div
                        className="flex overflow-x-auto snap-x snap-mandatory w-full h-full scrollbar-hide"
                        onScroll={handleScroll}
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {slides.map((slide, _) => (
                            <div key={slide.id} className="min-w-full h-full snap-center flex items-start justify-center relative pb-8">
                                {slide.src ? (
                                    <img
                                        src={slide.src}
                                        alt={slide.label}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-4 text-gray-400 mt-12">
                                        <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                            <span className="text-2xl">?</span>
                                        </div>
                                        <p className="text-sm">Sem imagem de {slide.label}</p>
                                        {slide.id === 'qrcode' && (
                                            <div className="p-4 bg-white rounded-lg shadow-sm">
                                                <QRCodeSVG value={`CNH:${data.cpf}`} size={150} />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Pagination Dots - Overlay on image bottom */}
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 z-10">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    const container = document.querySelector('.snap-x');
                                    if (container) {
                                        container.scrollTo({ left: index * container.clientWidth, behavior: 'smooth' });
                                    }
                                }}
                                className={clsx(
                                    "w-2 h-2 rounded-full transition-all shadow-sm border border-blue-900/30",
                                    currentSlide === index ? "bg-[#1351b4] scale-125" : "bg-white/80 backdrop-blur-sm"
                                )}
                            />
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3 max-w-sm mx-auto pb-8">
                    <button className="w-full bg-white p-3 rounded-xl shadow-[0_4px_6px_2px_rgba(0,0,0,0.15)] text-[#00285f] font-bold text-sm flex items-center gap-3 active:scale-[0.98] transition-all">
                        <UserSquare2 size={24} className="text-[#00285f] ml-2" />
                        Histórico de emissões da CNH
                    </button>

                    <button className="w-full bg-white p-3 rounded-xl shadow-[0_4px_6px_2px_rgba(0,0,0,0.15)] text-[#00285f] font-bold text-sm flex items-center gap-3 active:scale-[0.98] transition-all">
                        <Share2 size={24} className="text-[#00285f] ml-2" />
                        Exportar
                    </button>

                    <button className="w-full bg-white p-3 rounded-xl shadow-[0_4px_6px_2px_rgba(0,0,0,0.15)] text-[#00285f] font-bold text-sm flex items-center gap-3 active:scale-[0.98] transition-all">
                        <Trash2 size={24} className="text-[#00285f] ml-2" />
                        Remover
                    </button>

                    <button
                        onClick={() => {
                            if (data?.cpf) {
                                navigator.clipboard.writeText(`CNH:${data.cpf}`);
                                handleQrClick();
                            }
                        }}
                        className="w-full bg-white p-3 rounded-xl shadow-[0_4px_6px_2px_rgba(0,0,0,0.15)] text-[#00285f] font-bold text-sm flex items-center gap-3 active:scale-[0.98] transition-all"
                    >
                        <Files size={24} className="text-[#00285f] ml-2" />
                        Copiar QR Code
                    </button>
                </div>

                {/* Toast Message */}
                {showQrMessage && (
                    <div className="fixed bottom-4 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5">
                        <Files size={24} />
                        <span className="font-medium text-sm">QR Code copiado!</span>
                    </div>
                )}
            </div>
        </div>
    );
}
