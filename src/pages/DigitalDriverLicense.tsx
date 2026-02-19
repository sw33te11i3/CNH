import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share, Trash2, Info, UserSquare2 } from 'lucide-react';
import { NavigationHeader } from '../components/NavigationHeader';

export function DigitalDriverLicense() {
    const [isFlipped, setIsFlipped] = useState(false);
    const [showQrMessage, setShowQrMessage] = useState(false);

    const handleQrClick = () => {
        setShowQrMessage(true);
        setTimeout(() => setShowQrMessage(false), 3000);
    };

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            <NavigationHeader
                title="HABILITAÇÃO"
                subtitle="Atualizado em: 19/02/2026 - 16:40:12"
                className="pt-10 rounded-b-[35px]"
            />

            <div className="p-4">
                <div className="bg-blue-50 text-blue-900 text-sm p-3 rounded-md mb-4 text-center font-medium">
                    Verifique autenticidade do QR Code com o app <span className="underline font-bold">Vio</span>
                </div>

                {/* Card Container */}
                <div className="perspective-1000 w-full aspect-[1/1.4] max-w-md mx-auto relative cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                    <motion.div
                        className="w-full h-full relative preserve-3d transition-all duration-500"
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                    >
                        {/* Front Side */}
                        <div className="absolute inset-0 backface-hidden bg-green-50 shadow-xl rounded-lg overflow-hidden border border-green-100">
                            <div className="relative h-full flex flex-col">
                                {/* Header Stripe */}
                                <div className="h-16 bg-gradient-to-r from-green-100 to-green-50 flex justify-between items-center px-4 relative">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400 opacity-20 rounded-bl-full"></div>
                                    <span className="text-[10px] font-bold uppercase tracking-tighter w-1/2 leading-tight z-10">
                                        VÁLIDA EM TODO O TERRITÓRIO NACIONAL
                                    </span>
                                    <div className="w-12 h-12 bg-yellow-500 rounded-full opacity-20 z-10"></div> {/* Map placeholder */}
                                </div>

                                {/* CNH Number */}
                                <div className="px-6 py-1">
                                    <h2 className="text-red-600 font-bold text-xl tracking-widest font-mono">2406153128</h2>
                                </div>

                                {/* Photo and Data */}
                                <div className="px-4 flex gap-2 flex-1">
                                    <div className="w-28 h-36 bg-gray-300 rounded overflow-hidden flex-shrink-0 relative">
                                        {/* User Photo Placeholder */}
                                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                                            <UserSquare2 size={40} className="text-gray-400" />
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col gap-1 text-[10px] leading-none">
                                        <div className="border-b border-black pb-1">
                                            <span className="block font-bold scale-75 origin-top-left opacity-70">NOME</span>
                                            <strong className="text-sm block truncate">GABRIEL DE CARVALHO ALMEIDA</strong>
                                        </div>

                                        <div className="grid grid-cols-2 gap-1">
                                            <div className="border-b border-black pb-1">
                                                <span className="block font-bold scale-75 origin-top-left opacity-70">DOC. IDENTIDADE</span>
                                                <strong className="block">590368722 SSP SP</strong>
                                            </div>
                                            <div className="border-b border-black pb-1">
                                                <span className="block font-bold scale-75 origin-top-left opacity-70">CPF</span>
                                                <strong className="block">065.494.269-28</strong>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-1 mt-1">
                                            <div className="border-b border-black pb-1">
                                                <span className="block font-bold scale-75 origin-top-left opacity-70">DATA NASCIMENTO</span>
                                                <strong className="block">19/03/1989</strong>
                                            </div>
                                            <div className="border-b border-black pb-1">
                                                {/* Use red for validity to match screenshot */}
                                                <span className="block font-bold scale-75 origin-top-left opacity-70">VALIDADE</span>
                                                <strong className="block text-red-600">01/09/2032</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Stripe */}
                                <div className="h-12 bg-green-900 mt-auto flex items-center justify-between px-4">
                                    <span className="text-white text-[8px] font-bold w-full text-center tracking-widest opacity-80">
                                        MINISTÉRIO DA INFRAESTRUTURA - DENATRAN
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Back Side (QR Code for now) */}
                        <div className="absolute inset-0 backface-hidden bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200 rotate-y-180 flex flex-col items-center justify-center p-8 text-center"
                            style={{ transform: 'rotateY(180deg)' }}
                        >
                            <h3 className="font-bold text-lg mb-4">Código de Segurança</h3>
                            <div className="w-48 h-48 bg-gray-900 p-2 rounded-lg mb-4 cursor-pointer active:scale-95 transition-transform" onClick={(e) => { e.stopPropagation(); handleQrClick(); }}>
                                <div className="w-full h-full bg-white flex items-center justify-center">
                                    {/* Fake QR Code Pattern */}
                                    <div className="grid grid-cols-4 gap-1 w-full h-full p-2">
                                        {[...Array(16)].map((_, i) => (
                                            <div key={i} className={`bg-black ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500">Toque no QR Code para copiar</p>
                        </div>
                    </motion.div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 space-y-3">
                    <button className="w-full bg-white p-4 rounded-xl shadow-sm text-blue-900 font-medium flex items-center gap-3 active:bg-blue-50 transition-colors">
                        <div className="bg-blue-100 p-2 rounded-lg"><UserSquare2 size={20} /></div>
                        Histórico de emissões da CNH
                    </button>

                    <button className="w-full bg-white p-4 rounded-xl shadow-sm text-blue-900 font-medium flex items-center gap-3 active:bg-blue-50 transition-colors">
                        <div className="bg-blue-100 p-2 rounded-lg"><Share size={20} /></div> {/* Using Share for Export */}
                        Exportar
                    </button>

                    <button className="w-full bg-white p-4 rounded-xl shadow-sm text-red-600 font-medium flex items-center gap-3 active:bg-red-50 transition-colors">
                        <div className="bg-red-100 p-2 rounded-lg"><Trash2 size={20} /></div>
                        Remover
                    </button>
                </div>

                {/* QR Code Toast Message */}
                {showQrMessage && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className="fixed bottom-4 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 z-50"
                    >
                        <Info size={24} />
                        <span className="font-medium text-sm">QR Code copiado para área de transferência</span>
                    </motion.div>
                )}

            </div>
        </div>
    );
}
