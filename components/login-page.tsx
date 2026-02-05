'use client';

import { useState } from 'react';
import { useAuth } from './providers/auth-context';
import { Lock, User, ArrowRight } from 'lucide-react';

export function LoginPage() {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network delay for effect
        await new Promise(resolve => setTimeout(resolve, 800));

        const success = login(username, password);
        if (!success) {
            setError('Invalid username or password');
            setIsLoading(false);
        }
        // If success, state update in context will trigger re-render of layout
    };

    return (
        <div className="fixed inset-0 bg-[#0a0612] flex items-center justify-center overflow-hidden z-[100]">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />

            <div className="w-full max-w-md p-8 relative">
                <div className="bg-[#1a1025]/80 backdrop-blur-xl border border-primary/20 rounded-2xl p-8 shadow-2xl shadow-primary/10 animate-fade-in">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30 animate-float">
                            <span className="text-3xl font-bold text-white">A</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-muted-foreground">Sign in to AXIS HRM System</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-[#130d1f] border border-gray-700/50 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-600"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-accent transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#130d1f] border border-gray-700/50 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-gray-600"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-destructive/20 border border-destructive/50 text-destructive text-sm p-3 rounded-lg text-center animate-shake">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-xs text-gray-500">
                        <p>Protected by Enterprise Grade Security</p>
                        <p>© 2026 AXIS Systems Inc.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
