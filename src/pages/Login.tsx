import { useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';

export function Login() {
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/app/dashboard');
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center p-8">
            <div className="mt-12 mb-12">
                <h1 className="text-5xl font-black tracking-tighter text-blue-600 flex items-center gap-1">
                    CNH
                    <div className="relative h-10 w-8">
                        <div className="absolute inset-y-0 left-0 w-full bg-yellow-400 transform skew-x-[-20deg]"></div>
                        <div className="absolute inset-y-0 left-0 w-1/2 bg-blue-600 rounded-r-full transform"></div>
                    </div>
                </h1>
                <div className="bg-green-600 text-white font-black text-sm px-2 py-0.5 text-center -mt-1 w-full">
                    DO BRASIL
                </div>
            </div>

            <div className="w-full max-w-sm space-y-6">
                <h2 className="text-xl font-medium text-gray-700 text-center mb-8">
                    Identifique-se no gov.br com seu número de CPF
                </h2>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <User size={16} /> CPF
                        </label>
                        <input
                            type="text"
                            placeholder="Digite seu CPF"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Lock size={16} /> Senha
                        </label>
                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-full hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md mt-6"
                    >
                        Entrar
                    </button>
                </form>

                <div className="text-center space-y-4 mt-8">
                    <button className="text-blue-600 text-sm font-medium hover:underline">
                        Esqueci minha senha
                    </button>
                </div>
            </div>

            <div className="mt-auto pt-8 pb-4">
                <div className="flex items-center gap-2 justify-center opacity-60 grayscale">
                    <span className="font-bold text-gray-500">gov.br</span>
                </div>
            </div>
        </div>
    );
}
