
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignIn: React.FC = () => {
    const navigate = useNavigate();
    const { login, loginWithGoogle, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if already authenticated
    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await login(formData.email, formData.password);
            navigate('/');
        } catch (error: any) {
            setErrors({ submit: error.message || 'Failed to sign in. Please check your credentials.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            await loginWithGoogle();
            // Google OAuth redirects the whole window, so setIsLoading(false) 
            // will only happen if the redirect fails or is cancelled before leaving.
        } catch (error: any) {
            setErrors({ submit: error.message || 'Failed to sign in with Google. Please try again.' });
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-16 px-6 flex items-center justify-center">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current animate-pulse">
                            <path d="M50 15L15 50L50 85L85 50L50 15ZM50 25L75 50L50 75L25 50L50 25Z" />
                            <circle cx="50" cy="50" r="8" className="animate-ping opacity-50" />
                            <circle cx="50" cy="50" r="4" />
                        </svg>
                    </div>
                    <h1 className="font-cinzel text-3xl tracking-[0.3em] font-bold mb-2">WELCOME BACK</h1>
                    <p className="text-zinc-500 text-sm tracking-wider">Enter the shadows once more</p>
                </div>

                {/* Error Message */}
                {errors.submit && (
                    <div className="mb-6 bg-red-900/20 border border-red-500/30 p-4 backdrop-blur-sm">
                        <p className="text-red-400 text-xs text-center">{errors.submit}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-xs uppercase tracking-[0.2em] text-zinc-400 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full bg-black/30 border ${errors.email ? 'border-red-500' : 'border-white/10'
                                } px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-white/50 transition-colors`}
                            placeholder="Enter your email"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-xs uppercase tracking-[0.2em] text-zinc-400 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full bg-black/30 border ${errors.password ? 'border-red-500' : 'border-white/10'
                                } px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-white/50 transition-colors`}
                            placeholder="Enter your password"
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-black py-4 text-sm uppercase tracking-[0.3em] font-bold hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing In...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </button>

                    {/* Sign Up Link */}
                    <div className="text-center pt-4">
                        <p className="text-zinc-500 text-sm">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-white hover:underline font-medium">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#050505] px-4 text-zinc-600 tracking-wider">Or continue with</span>
                    </div>
                </div>

                {/* Google Sign In */}
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-3 bg-black/30 border border-white/10 px-6 py-3 hover:border-white/30 transition-colors group w-full max-w-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span className="text-xs uppercase tracking-wider text-zinc-400 group-hover:text-white transition-colors">Continue with Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
