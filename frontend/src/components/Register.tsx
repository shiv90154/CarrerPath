import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            await register(name, email, phone, password);
            navigate('/student/dashboard');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC] font-['Inter']">
            <form onSubmit={submitHandler} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm border border-[#E5E7EB]">
                <h1 className="text-2xl font-bold mb-6 text-center font-['Poppins'] text-[#0B1F33]">
                    Create Your Account
                </h1>
                <div className="mb-4">
                    <label className="block text-[#0B1F33] text-sm font-medium mb-2" htmlFor="name">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="shadow appearance-none border border-[#E5E7EB] rounded w-full py-2 px-3 text-[#111827] leading-tight focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-colors duration-200"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-[#0B1F33] text-sm font-medium mb-2" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="shadow appearance-none border border-[#E5E7EB] rounded w-full py-2 px-3 text-[#111827] leading-tight focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-colors duration-200"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-[#0B1F33] text-sm font-medium mb-2" htmlFor="phone">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        className="shadow appearance-none border border-[#E5E7EB] rounded w-full py-2 px-3 text-[#111827] leading-tight focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-colors duration-200"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-[#0B1F33] text-sm font-medium mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="shadow appearance-none border border-[#E5E7EB] rounded w-full py-2 px-3 text-[#111827] leading-tight focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-colors duration-200"
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-[#0B1F33] text-sm font-medium mb-2" htmlFor="confirmPassword">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="shadow appearance-none border border-[#E5E7EB] rounded w-full py-2 px-3 text-[#111827] leading-tight focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-colors duration-200"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-[#1E3A8A] hover:bg-[#0B1F33] text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors duration-200"
                >
                    Create Account
                </button>
                <div className="mt-4 text-center">
                    <p className="text-[#6B7280] text-sm">
                        Already have an account?{' '}
                        <a href="/login" className="text-[#1E3A8A] hover:underline font-medium">
                            Login instead
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Register;