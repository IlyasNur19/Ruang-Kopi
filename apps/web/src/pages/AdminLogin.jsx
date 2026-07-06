import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Coffee, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || '/admin';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email) {
            setError('Email is required');
            return;
        }
        if (!formData.password) {
            setError('Password is required');
            return;
        }

        setIsLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            const from = location.state?.from?.pathname || '/admin';
            navigate(from, { replace: true });
        } else {
            setError(result.error || 'Invalid email or password');
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex">
            {}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80')`,
                    }}
                />

                {}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

                {}
                <div className="relative z-10 flex flex-col justify-end p-12 text-white">
                    <span className="text-xs tracking-[0.3em] uppercase text-white/80 mb-4">
                        Premium Coffee
                    </span>
                    <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight">
                        Crafting Stories,
                        <br />
                        One Cup at a Time.
                    </h1>
                </div>
            </div>

            {}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#FAF9F7]">
                <div className="w-full max-w-md">
                    {}
                    <div className="flex items-center gap-3 mb-12">
                        <Coffee className="w-8 h-8 text-[#3E2723]" />
                        <span className="font-heading font-bold text-xl text-[#3E2723]">
                            RuangKopi
                        </span>
                    </div>

                    {}
                    <div className="mb-8">
                        <h2 className="font-heading text-3xl font-bold text-[#3E2723] mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-[#8D6E63]">
                            Please enter your details to access the dashboard.
                        </p>
                    </div>

                    {}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-[#5D4037] mb-2"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="w-5 h-5 text-[#A1887F]" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="admin@ruangkopi.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#D7CCC8] rounded-lg text-[#3E2723] placeholder:text-[#BCAAA4] focus:outline-none focus:ring-2 focus:ring-[#8D6E63] focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-[#5D4037] mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-[#A1887F]" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3.5 bg-white border border-[#D7CCC8] rounded-lg text-[#3E2723] placeholder:text-[#BCAAA4] focus:outline-none focus:ring-2 focus:ring-[#8D6E63] focus:border-transparent transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#A1887F] hover:text-[#5D4037] transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="text-sm text-[#8D6E63] hover:text-[#5D4037] transition-colors"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        {}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#3E2723] text-white font-medium rounded-lg hover:bg-[#2D1B18] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3E2723] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {}
                    <div className="mt-12 text-center">
                        <p className="text-sm text-[#A1887F]">
                            © 2023 RuangKopi. All rights reserved. Protected by reCAPTCHA.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
