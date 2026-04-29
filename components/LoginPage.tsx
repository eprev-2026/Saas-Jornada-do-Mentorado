import React, { useState } from 'react';
import Logo from './Logo';
import { EyeIcon, EyeOffIcon } from './Icons';

interface LoginPageProps {
    onLogin: (login: string, password: string) => boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network delay
        setTimeout(() => {
            const success = onLogin(login, password);
            if (!success) {
                setError('Credenciais inválidas. Por favor, verifique seu email e CPF.');
            }
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md mx-auto">
                <div className="mb-8 flex justify-center">
                    <Logo />
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl p-8">
                    <h1 className="text-2xl font-bold text-center text-white mb-2">Área do Mentorado</h1>
                    <p className="text-center text-gray-400 mb-8">Acesse sua jornada de transformação.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="login" className="block text-sm font-medium text-gray-300 mb-2">
                                Email de Acesso
                            </label>
                            <input
                                id="login"
                                type="email"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                required
                                className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-200 placeholder-gray-500 transition-colors"
                                placeholder="seu.email@exemplo.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                CPF (somente números)
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full p-3 pr-10 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-200 placeholder-gray-500 transition-colors"
                                    placeholder="Digite seu CPF (apenas números)"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                                    aria-label={showPassword ? "Ocultar CPF" : "Mostrar CPF"}
                                >
                                    {showPassword ? (
                                        <EyeOffIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm text-red-400 text-center">{error}</p>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-md transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    'Entrar na Jornada'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;