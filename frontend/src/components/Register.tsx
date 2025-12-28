import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';

interface FormData {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

interface OTPData {
    email: string;
    otp: string;
    phone: string;
    password: string;
}

const Register: React.FC = () => {
    const [step, setStep] = useState<'form' | 'otp'>('form');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const navigate = useNavigate();

    // Form data
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    // OTP data
    const [otpData, setOtpData] = useState<OTPData>({
        email: '',
        otp: '',
        phone: '',
        password: ''
    });

    // Timer for OTP resend
    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (otpTimer > 0) {
            interval = setInterval(() => {
                setOtpTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [otpTimer]);

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            setError('Name is required');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!formData.phone.trim()) {
            setError('Phone number is required');
            return false;
        }
        if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            setError('Please enter a valid 10-digit phone number');
            return false;
        }
        if (!formData.password) {
            setError('Password is required');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('/api/users/send-otp', {
                email: formData.email,
                name: formData.name
            });

            setSuccess('OTP sent to your email! Please check your inbox.');
            setOtpData({
                email: formData.email,
                otp: '',
                phone: formData.phone,
                password: formData.password
            });
            setStep('otp');
            setOtpTimer(300); // 5 minutes
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOTPSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!otpData.otp.trim()) {
            setError('Please enter the OTP');
            return;
        }

        if (otpData.otp.length !== 6) {
            setError('OTP must be 6 digits');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('/api/users/verify-otp', {
                email: otpData.email,
                otp: otpData.otp,
                phone: otpData.phone,
                password: otpData.password,
                role: 'student'
            });

            setSuccess('Registration successful! Redirecting to login...');

            // Store user data if needed
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data));
            }

            // Redirect after a short delay
            setTimeout(() => {
                navigate('/login', {
                    state: {
                        message: 'Registration successful! Please login with your credentials.',
                        email: otpData.email
                    }
                });
            }, 2000);

        } catch (error: any) {
            setError(error.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (otpTimer > 0) return;

        setLoading(true);
        setError(null);

        try {
            await axios.post('/api/users/resend-otp', {
                email: otpData.email
            });

            setSuccess('OTP resent to your email!');
            setOtpTimer(300); // 5 minutes
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to resend OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

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
                        Career Pathway
                    </h1>
                    <p className="text-[#D4AF37] font-inter">
                        {step === 'form' ? 'Create your account to get started' : 'Verify your email address'}
                    </p>
                </div>

                {/* Registration Form */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
                    {/* Back Button for OTP Step */}
                    {step === 'otp' && (
                        <button
                            onClick={() => setStep('form')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to form
                        </button>
                    )}

                    {/* Success/Error Messages */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 mb-6">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg flex items-center gap-2 mb-6">
                            <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            <span>{success}</span>
                        </div>
                    )}

                    {/* Step 1: Registration Form */}
                    {step === 'form' && (
                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#0B1F33] font-inter">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all duration-200 font-inter"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#0B1F33] font-inter">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all duration-200 font-inter"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#0B1F33] font-inter">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all duration-200 font-inter"
                                        placeholder="Enter your phone number"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#0B1F33] font-inter">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all duration-200 font-inter"
                                        placeholder="Create a password"
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
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#0B1F33] font-inter">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                                        Sending OTP...
                                    </div>
                                ) : (
                                    'Send Verification Code'
                                )}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === 'otp' && (
                        <form onSubmit={handleOTPSubmit} className="space-y-6">
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                    <Mail className="w-8 h-8 text-blue-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">Check Your Email</h2>
                                <p className="text-gray-600 text-sm">
                                    We've sent a 6-digit verification code to<br />
                                    <span className="font-medium text-gray-900">{otpData.email}</span>
                                </p>
                            </div>

                            {/* OTP Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#0B1F33] font-inter text-center">
                                    Enter Verification Code
                                </label>
                                <input
                                    type="text"
                                    value={otpData.otp}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                        setOtpData({ ...otpData, otp: value });
                                    }}
                                    className="w-full text-center text-2xl font-mono py-4 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all duration-200 tracking-widest"
                                    placeholder="000000"
                                    maxLength={6}
                                    required
                                />
                            </div>

                            {/* Timer */}
                            {otpTimer > 0 && (
                                <div className="text-center text-sm text-gray-600">
                                    Code expires in: <span className="font-mono font-medium">{formatTime(otpTimer)}</span>
                                </div>
                            )}

                            {/* Verify Button */}
                            <button
                                type="submit"
                                disabled={loading || otpData.otp.length !== 6}
                                className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#0B1F33] text-white font-semibold py-3 px-4 rounded-lg hover:from-[#0B1F33] hover:to-[#1E3A8A] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 transition-all duration-200 font-inter disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Verifying...
                                    </div>
                                ) : (
                                    'Verify & Create Account'
                                )}
                            </button>

                            {/* Resend OTP */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Didn't receive the code?{' '}
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        disabled={otpTimer > 0 || loading}
                                        className="font-medium text-[#1E3A8A] hover:text-[#D4AF37] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {otpTimer > 0 ? `Resend in ${formatTime(otpTimer)}` : 'Resend Code'}
                                    </button>
                                </p>
                            </div>
                        </form>
                    )}

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 font-inter">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-medium text-[#1E3A8A] hover:text-[#D4AF37] transition-colors duration-200"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-white/70 font-inter">
                        By creating an account, you agree to our Terms of Service
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;