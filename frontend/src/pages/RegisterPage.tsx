import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    Phone,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    Send,
    RefreshCw
} from 'lucide-react';

interface FormData {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [step, setStep] = useState(1); // 1: Form, 2: OTP Verification
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Full name is required');
            return false;
        }
        if (formData.name.trim().length < 2) {
            setError('Name must be at least 2 characters long');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email address is required');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!formData.phone.trim()) {
            setError('Phone number is required');
            return false;
        }
        if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            setError('Please enter a valid 10-digit phone number');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            setError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await axios.post('https://carrerpath-m48v.onrender.com/api/users/send-otp', {
                email: formData.email,
                name: formData.name
            });

            setOtpSent(true);
            setStep(2);
            setSuccess('Verification code sent to your email! Please check your inbox.');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send verification code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!otp.trim()) {
            setError('Please enter the verification code');
            return;
        }

        if (otp.length !== 6) {
            setError('Verification code must be 6 digits');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data } = await axios.post('https://carrerpath-m48v.onrender.com/api/users/verify-otp', {
                email: formData.email,
                otp: otp,
                phone: formData.phone,
                password: formData.password,
                role: 'student'
            });

            // Login the user
            login(data);
            setSuccess('Registration successful! Welcome to Career Pathway.');

            // Redirect after a short delay
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Verification failed. Please check your code and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setLoading(true);
        setError(null);

        try {
            await axios.post('https://carrerpath-m48v.onrender.com/api/users/resend-otp', {
                email: formData.email
            });

            setSuccess('New verification code sent to your email!');
            setOtp('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to resend verification code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(formData.password);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0B1F33] via-[#1E3A8A] to-[#0B1F33] flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1)_0%,transparent_50%)]"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo/Brand Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#D4AF37] rounded-full mb-4">
                        <User className="w-8 h-8 text-[#0B1F33]" />
                    </div>
                    <h1 className="text-3xl font-bold text-white font-poppins mb-2">
                        Join Career Pathway
                    </h1>
                    <p className="text-[#D4AF37] font-inter">
                        {step === 1 ? 'Create your account to start learning' : 'Verify your email to complete registration'}
                    </p>
                </div>

                {/* Registration Form */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
                    {/* Progress Indicator */}
                    <div className="mb-8">
                        <div className="flex items-center">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-[#1E3A8A] text-white' : 'bg-gray-300 text-gray-600'
                                }`}>
                                {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
                            </div>
                            <div className={`flex-1 h-1 mx-2 transition-all duration-300 ${step >= 2 ? 'bg-[#1E3A8A]' : 'bg-gray-300'
                                }`}></div>
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-[#1E3A8A] text-white' : 'bg-gray-300 text-gray-600'
                                }`}>
                                {step >= 2 ? <Mail className="w-5 h-5" /> : '2'}
                            </div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-600 font-inter">
                            <span>Personal Details</span>
                            <span>Email Verification</span>
                        </div>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            {success}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            {error}
                        </div>
                    )}

                    {/* Step 1: Registration Form */}
                    {step === 1 && (
                        <form onSubmit={handleSendOTP} className="space-y-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#0B1F33] font-inter">
                                    Full Name *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all duration-200 font-inter"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#0B1F33] font-inter">
                                    Email Address *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all duration-200 font-inter"
                                        placeholder="Enter your email address"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#0B1F33] font-inter">
                                    Phone Number *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all duration-200 font-inter"
                                        placeholder="Enter your 10-digit phone number"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#0B1F33] font-inter">
                                    Password *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all duration-200 font-inter"
                                        placeholder="Create a strong password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                                {/* Password Strength Indicator */}
                                {formData.password && (
                                    <div className="mt-2">
                                        <div className="flex gap-1 mb-1">
                                            {[1, 2, 3, 4, 5].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1 flex-1 rounded ${passwordStrength >= level
                                                            ? passwordStrength <= 2
                                                                ? 'bg-red-500'
                                                                : passwordStrength <= 3
                                                                    ? 'bg-yellow-500'
                                                                    : 'bg-green-500'
                                                            : 'bg-gray-200'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-600">
                                            Password strength: {
                                                passwordStrength <= 2 ? 'Weak' :
                                                    passwordStrength <= 3 ? 'Medium' : 'Strong'
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#0B1F33] font-inter">
                                    Confirm Password *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all duration-200 font-inter"
                                        placeholder="Confirm your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                    <p className="text-xs text-red-600 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        Passwords do not match
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#0B1F33] text-white font-semibold py-3 px-4 rounded-lg hover:from-[#0B1F33] hover:to-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 transition-all duration-200 font-inter disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Sending Code...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <Send className="w-5 h-5" />
                                        Send Verification Code
                                    </div>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#D4AF37]/10 rounded-full mb-4">
                                    <Mail className="w-8 h-8 text-[#D4AF37]" />
                                </div>
                                <h3 className="text-xl font-semibold text-[#0B1F33] mb-2 font-poppins">
                                    Check Your Email
                                </h3>
                                <p className="text-sm text-gray-600 mb-6 font-inter">
                                    We've sent a 6-digit verification code to<br />
                                    <strong className="text-[#1E3A8A]">{formData.email}</strong>
                                </p>
                            </div>

                            {/* OTP Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#0B1F33] text-center font-inter">
                                    Enter Verification Code
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all duration-200 text-center text-2xl font-mono tracking-widest font-bold"
                                    placeholder="000000"
                                    maxLength={6}
                                    required
                                />
                                <p className="text-xs text-gray-500 text-center font-inter">
                                    Code expires in 5 minutes
                                </p>
                            </div>

                            {/* Verify Button */}
                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#0B1F33] text-white font-semibold py-3 px-4 rounded-lg hover:from-[#0B1F33] hover:to-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 transition-all duration-200 font-inter disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Verifying...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        Verify & Create Account
                                    </div>
                                )}
                            </button>

                            {/* Resend and Back Options */}
                            <div className="text-center space-y-3">
                                <p className="text-sm text-gray-600 font-inter">
                                    Didn't receive the code?{' '}
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        disabled={loading}
                                        className="font-medium text-[#1E3A8A] hover:text-[#D4AF37] transition-colors duration-200 disabled:opacity-50 inline-flex items-center gap-1"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Resend Code
                                    </button>
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 inline-flex items-center gap-1 font-inter"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Registration
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Login Link */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 font-inter">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="font-medium text-[#1E3A8A] hover:text-[#D4AF37] transition-colors duration-200"
                                >
                                    Sign In Here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-white/70 font-inter">
                        Join thousands of students advancing their careers
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;