
import React, { useState } from 'react';
import { BackendService } from '../services/mockBackend';
import { User } from '../types';
import { StethoscopeIcon, UserCircleIcon } from './IconComponents';

interface LoginPageProps {
    onLogin: (user: User) => void;
    onSwitchToSignup: () => void;
}

type LoginTab = 'patient' | 'doctor';

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSwitchToSignup }) => {
    const [activeTab, setActiveTab] = useState<LoginTab>('patient');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const user = await BackendService.login(email, password);
            
            if (user) {
                // Check if user is trying to login to correct portal
                if (
                    (activeTab === 'patient' && user.role !== 'Patient') ||
                    (activeTab === 'doctor' && user.role !== 'Doctor')
                ) {
                    setError(`This account does not belong to the ${activeTab} portal.`);
                    setIsLoading(false);
                    return;
                }
                onLogin(user);
            } else {
                setError("Invalid email or password.");
            }
        } catch (e) {
            setError("An error occurred. Please try again.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const switchTab = (tab: LoginTab) => {
        setActiveTab(tab);
        setError('');
        setEmail('');
        setPassword('');
    };

    // Helper to autofill demo credentials
    const fillDemo = (demoEmail: string) => {
        setEmail(demoEmail);
        setPassword('password123');
        setError('');
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="bg-teal-600 p-8 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-teal-500 rounded-full shadow-inner">
                            <StethoscopeIcon className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Healthcare Portal</h2>
                    <p className="text-teal-100 mt-1">Manage your health and appointments</p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button 
                        className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === 'patient' ? 'text-teal-600 border-b-2 border-teal-600 bg-gray-50' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => switchTab('patient')}
                    >
                        Patient Login
                    </button>
                    <button 
                        className={`flex-1 py-4 text-sm font-semibold transition-colors ${activeTab === 'doctor' ? 'text-teal-600 border-b-2 border-teal-600 bg-gray-50' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => switchTab('doctor')}
                    >
                        Doctor Login
                    </button>
                </div>

                {/* Login Form */}
                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
                                {error}
                            </div>
                        )}
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow text-black bg-white"
                                placeholder={activeTab === 'patient' ? "patient@example.com" : "doctor@clinic.com"}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow text-black bg-white"
                                placeholder="••••••••"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg shadow-md transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                `Sign In as ${activeTab === 'patient' ? 'Patient' : 'Doctor'}`
                            )}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{' '}
                            <button 
                                onClick={onSwitchToSignup} 
                                className="text-teal-600 font-semibold hover:text-teal-700 hover:underline focus:outline-none"
                            >
                                Sign Up
                            </button>
                        </p>
                    </div>

                    {/* Demo Credentials Hint */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Demo Credentials</p>
                        <div className="space-y-2 h-32 overflow-y-auto pr-1 custom-scrollbar">
                            {activeTab === 'patient' ? (
                                <button onClick={() => fillDemo('alex@patient.com')} className="w-full text-left p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all flex items-center justify-between group">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Alex Johnson</p>
                                        <p className="text-xs text-gray-500">alex@patient.com</p>
                                    </div>
                                    <span className="text-xs text-teal-600 font-medium opacity-0 group-hover:opacity-100">Use</span>
                                </button>
                            ) : (
                                <>
                                    <button onClick={() => fillDemo('pradeep@clinic.com')} className="w-full text-left p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all flex items-center justify-between group">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Dr. Pradeep Raghuvanshi</p>
                                            <p className="text-xs text-gray-500">pradeep@clinic.com</p>
                                        </div>
                                        <span className="text-xs text-teal-600 font-medium opacity-0 group-hover:opacity-100">Use</span>
                                    </button>
                                    <button onClick={() => fillDemo('lokesh@clinic.com')} className="w-full text-left p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all flex items-center justify-between group">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Dr. Lokesh</p>
                                            <p className="text-xs text-gray-500">lokesh@clinic.com</p>
                                        </div>
                                        <span className="text-xs text-teal-600 font-medium opacity-0 group-hover:opacity-100">Use</span>
                                    </button>
                                    <button onClick={() => fillDemo('anmol@clinic.com')} className="w-full text-left p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all flex items-center justify-between group">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Dr. Anmol Alhawat</p>
                                            <p className="text-xs text-gray-500">anmol@clinic.com</p>
                                        </div>
                                        <span className="text-xs text-teal-600 font-medium opacity-0 group-hover:opacity-100">Use</span>
                                    </button>
                                    <button onClick={() => fillDemo('carter@clinic.com')} className="w-full text-left p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all flex items-center justify-between group">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Dr. Emily Carter</p>
                                            <p className="text-xs text-gray-500">carter@clinic.com</p>
                                        </div>
                                        <span className="text-xs text-teal-600 font-medium opacity-0 group-hover:opacity-100">Use</span>
                                    </button>
                                </>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 mt-3 text-center">Password for all accounts: <span className="font-mono text-gray-600">password123</span></p>
                    </div>
                </div>
            </div>
            
            <p className="mt-6 text-gray-500 text-sm">
                &copy; 2024 AI Healthcare Manager. Secure & Private.
            </p>
        </div>
    );
};

export default LoginPage;
