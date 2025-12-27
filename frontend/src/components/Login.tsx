import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { loginWithCredentials, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        }
    }, [user, navigate]);

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await loginWithCredentials(email, password);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC] font-[Inter]">
            <div className="w-full max-w-sm">
                <form
                    onSubmit={submitHandler}
                    className="bg-white p-8 rounded-lg shadow-sm border border-[#E5E7EB]"
                >
                    <h1 className="text-2xl font-semibold mb-8 text-center text-[#0B1F33] font-[Poppins]">
                        Institute Login
                    </h1>

                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="mb-6">
                        <label
                            className="block text-sm font-medium mb-2 text-[#0B1F33] font-[Inter]"
                            htmlFor="email"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-3 border border-[#E5E7EB] rounded-md 
                                     text-gray-900 placeholder:text-gray-400
                                     focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent
                                     transition-colors duration-200 font-[Inter]"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-8">
                        <label
                            className="block text-sm font-medium mb-2 text-[#0B1F33] font-[Inter]"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-3 border border-[#E5E7EB] rounded-md 
                                     text-gray-900 placeholder:text-gray-400
                                     focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent
                                     transition-colors duration-200 font-[Inter]"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-[#1E3A8A] text-white font-medium rounded-md
                                 hover:bg-[#0B1F33] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:ring-offset-2
                                 transition-colors duration-200 font-[Inter] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>

                
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 font-[Inter]">
                        Secure login for students & staff
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;