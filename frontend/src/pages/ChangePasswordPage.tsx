import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ChangePasswordPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validateForm = () => {
        if (!formData.currentPassword) {
            setError('Current password is required');
            return false;
        }
        if (formData.newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            return false;
        }
        if (formData.newPassword === formData.currentPassword) {
            setError('New password must be different from current password');
            return false;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError(null);

        try {
            const config = {
                headers: { Authorization: `Bearer ${user?.token}` }
            };

            await axios.put('https://carrerpath-m48v.onrender.com/api/users/change-password', {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            }, config);

            alert('Password changed successfully!');
            navigate('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const getStrengthLabel = (strength: number) => {
        if (strength < 2) return { label: 'Weak', color: 'text-red-600', bg: 'bg-red-200' };
        if (strength < 4) return { label: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-200' };
        if (strength < 5) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-200' };
        return { label: 'Strong', color: 'text-green-600', bg: 'bg-green-200' };
    };

    const passwordStrength = getPasswordStrength(formData.newPassword);
    const strengthInfo = getStrengthLabel(passwordStrength);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔐</div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Change Password
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Keep your account secure with a strong password
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Current Password */}
                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                                Current Password *
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type={showPasswords.current ? 'text' : 'password'}
                                    required
                                    value={formData.currentPassword}
                                    onChange={handleInputChange}
                                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('current')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPasswords.current ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                New Password *
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showPasswords.new ? 'text' : 'password'}
                                    required
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('new')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPasswords.new ? '🙈' : '👁️'}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {formData.newPassword && (
                                <div className="mt-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-gray-600">Password strength:</span>
                                        <span className={`text-xs font-medium ${strengthInfo.color}`}>
                                            {strengthInfo.label}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${strengthInfo.bg}`}
                                            style={{ width: `${(passwordStrength / 6) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm New Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm New Password *
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Confirm your new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPasswords.confirm ? '🙈' : '👁️'}
                                </button>
                            </div>

                            {/* Password Match Indicator */}
                            {formData.confirmPassword && (
                                <div className="mt-1">
                                    {formData.newPassword === formData.confirmPassword ? (
                                        <p className="text-xs text-green-600">✓ Passwords match</p>
                                    ) : (
                                        <p className="text-xs text-red-600">✗ Passwords do not match</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                            <h4 className="text-sm font-medium text-blue-900 mb-2">Password Requirements:</h4>
                            <ul className="text-xs text-blue-800 space-y-1">
                                <li className={formData.newPassword.length >= 6 ? 'text-green-600' : ''}>
                                    {formData.newPassword.length >= 6 ? '✓' : '•'} At least 6 characters
                                </li>
                                <li className={/[A-Z]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                                    {/[A-Z]/.test(formData.newPassword) ? '✓' : '•'} One uppercase letter
                                </li>
                                <li className={/[a-z]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                                    {/[a-z]/.test(formData.newPassword) ? '✓' : '•'} One lowercase letter
                                </li>
                                <li className={/[0-9]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                                    {/[0-9]/.test(formData.newPassword) ? '✓' : '•'} One number
                                </li>
                                <li className={/[^A-Za-z0-9]/.test(formData.newPassword) ? 'text-green-600' : ''}>
                                    {/[^A-Za-z0-9]/.test(formData.newPassword) ? '✓' : '•'} One special character
                                </li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Changing Password...' : 'Change Password'}
                            </button>
                        </div>

                        {/* Cancel Button */}
                        <div>
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>

                    {/* Security Tips */}
                    <div className="mt-6 bg-gray-50 rounded-md p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">🛡️ Security Tips:</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                            <li>• Use a unique password for your account</li>
                            <li>• Don't share your password with anyone</li>
                            <li>• Consider using a password manager</li>
                            <li>• Change your password regularly</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPage;