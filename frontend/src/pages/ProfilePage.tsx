import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchProfile();
    }, [user, navigate]);

    const fetchProfile = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user?.token}` }
            };
            const { data } = await axios.get('https://carrerpath-m48v.onrender.com/api/users/profile', config);
            setProfileData(data);
            setLoading(false);
        } catch (err: any) {
            console.error(err);
            setError('Failed to fetch profile data');
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Not provided';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
                    <Link
                        to="/login"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                {profileData?.avatar ? (
                                    <img
                                        src={profileData.avatar}
                                        alt={profileData.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                ) : (
                                    profileData?.name?.charAt(0)?.toUpperCase() || 'U'
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {profileData?.name || 'User Profile'}
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    {profileData?.role === 'admin' ? 'Administrator' : 'Student'} • Member since {formatDate(profileData?.createdAt)}
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <Link
                                to="/profile/edit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Edit Profile
                            </Link>
                            <Link
                                to="/change-password"
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Change Password
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Profile Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                    <span className="mr-2">👤</span>
                                    Personal Information
                                </h2>
                                <Link
                                    to="/profile/edit"
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    Edit →
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                                    <div className="text-gray-900 mt-1">{profileData?.name || 'Not provided'}</div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                                    <div className="text-gray-900 mt-1 flex items-center">
                                        {profileData?.email || 'Not provided'}
                                        {profileData?.emailVerified && (
                                            <span className="ml-2 text-green-600 text-sm">✓ Verified</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                                    <div className="text-gray-900 mt-1 flex items-center">
                                        {profileData?.phone || 'Not provided'}
                                        {profileData?.phoneVerified && (
                                            <span className="ml-2 text-green-600 text-sm">✓ Verified</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                                    <div className="text-gray-900 mt-1">{formatDate(profileData?.dateOfBirth)}</div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Gender</label>
                                    <div className="text-gray-900 mt-1">{profileData?.gender || 'Not specified'}</div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Last Login</label>
                                    <div className="text-gray-900 mt-1">{formatDate(profileData?.lastLogin)}</div>
                                </div>
                            </div>
                            {profileData?.bio && (
                                <div className="mt-6 pt-6 border-t">
                                    <label className="text-sm font-medium text-gray-500">About Me</label>
                                    <p className="text-gray-900 mt-1">{profileData.bio}</p>
                                </div>
                            )}
                        </div>

                        {/* Address Information */}
                        {profileData?.address && (profileData.address.street || profileData.address.city) && (
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <span className="mr-2">🏠</span>
                                        Address Information
                                    </h2>
                                    <Link
                                        to="/profile/edit"
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                    >
                                        Edit →
                                    </Link>
                                </div>
                                <div className="space-y-3">
                                    {profileData.address.street && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Street Address</label>
                                            <div className="text-gray-900 mt-1">{profileData.address.street}</div>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {profileData.address.city && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">City</label>
                                                <div className="text-gray-900 mt-1">{profileData.address.city}</div>
                                            </div>
                                        )}
                                        {profileData.address.state && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">State</label>
                                                <div className="text-gray-900 mt-1">{profileData.address.state}</div>
                                            </div>
                                        )}
                                        {profileData.address.pincode && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">PIN Code</label>
                                                <div className="text-gray-900 mt-1">{profileData.address.pincode}</div>
                                            </div>
                                        )}
                                        {profileData.address.country && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Country</label>
                                                <div className="text-gray-900 mt-1">{profileData.address.country}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Education Information */}
                        {profileData?.education && profileData.education.qualification && (
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                        <span className="mr-2">🎓</span>
                                        Education
                                    </h2>
                                    <Link
                                        to="/profile/edit"
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                    >
                                        Edit →
                                    </Link>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Highest Qualification</label>
                                        <div className="text-gray-900 mt-1 font-medium">{profileData.education.qualification}</div>
                                    </div>
                                    {profileData.education.institution && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Institution</label>
                                            <div className="text-gray-900 mt-1">{profileData.education.institution}</div>
                                        </div>
                                    )}
                                    {profileData.education.year && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Year of Completion</label>
                                            <div className="text-gray-900 mt-1">{profileData.education.year}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link
                                    to="/dashboard"
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block"
                                >
                                    Go to Dashboard
                                </Link>
                                <Link
                                    to="/profile/edit"
                                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-center block"
                                >
                                    Edit Profile
                                </Link>
                                <Link
                                    to="/change-password"
                                    className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors text-center block"
                                >
                                    Change Password
                                </Link>
                            </div>
                        </div>

                        {/* Preferences */}
                        {profileData?.preferences && (
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                        <span className="mr-2">⚙️</span>
                                        Preferences
                                    </h3>
                                    <Link
                                        to="/profile/edit"
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                    >
                                        Edit →
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {profileData.preferences.language && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Language</label>
                                            <div className="text-gray-900 mt-1">{profileData.preferences.language}</div>
                                        </div>
                                    )}
                                    {profileData.preferences.examTypes && profileData.preferences.examTypes.length > 0 && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Exam Types</label>
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {profileData.preferences.examTypes.map((exam: string, index: number) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                                                    >
                                                        {exam}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {profileData.preferences.subjects && profileData.preferences.subjects.length > 0 && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Subjects</label>
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {profileData.preferences.subjects.map((subject: string, index: number) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                                                    >
                                                        {subject}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Account Status */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Email Verification</span>
                                    <span className={`text-sm font-medium ${profileData?.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
                                        {profileData?.emailVerified ? '✓ Verified' : '✗ Not Verified'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Phone Verification</span>
                                    <span className={`text-sm font-medium ${profileData?.phoneVerified ? 'text-green-600' : 'text-red-600'}`}>
                                        {profileData?.phoneVerified ? '✓ Verified' : '✗ Not Verified'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Account Type</span>
                                    <span className="text-sm font-medium text-blue-600 capitalize">
                                        {profileData?.role || 'Student'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;