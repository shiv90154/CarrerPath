import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface ProfileData {
    name: string;
    phone: string;
    bio: string;
    dateOfBirth: string;
    gender: string;
    avatar: string;
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
    };
    education: {
        qualification: string;
        institution: string;
        year: string;
    };
    preferences: {
        examTypes: string[];
        subjects: string[];
        language: string;
        notifications: {
            email: boolean;
            sms: boolean;
            push: boolean;
        };
    };
}

const ProfileEditPage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState<ProfileData>({
        name: '',
        phone: '',
        bio: '',
        dateOfBirth: '',
        gender: '',
        avatar: '',
        address: {
            street: '',
            city: '',
            state: '',
            country: 'India',
            pincode: '',
        },
        education: {
            qualification: '',
            institution: '',
            year: '',
        },
        preferences: {
            examTypes: [],
            subjects: [],
            language: 'English',
            notifications: {
                email: true,
                sms: false,
                push: true,
            },
        },
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('personal');

    const examTypes = ['UPSC', 'SSC', 'Banking', 'Railway', 'State PSC', 'Teaching', 'Other'];
    const subjects = ['History', 'Geography', 'Polity', 'Economics', 'Science', 'Mathematics', 'English', 'Current Affairs'];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user?.token}` }
            };
            const { data } = await axios.get('http://localhost:5000/api/users/profile', config);

            setProfileData({
                name: data.name || '',
                phone: data.phone || '',
                bio: data.bio || '',
                dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
                gender: data.gender || '',
                avatar: data.avatar || '',
                address: {
                    street: data.address?.street || '',
                    city: data.address?.city || '',
                    state: data.address?.state || '',
                    country: data.address?.country || 'India',
                    pincode: data.address?.pincode || '',
                },
                education: {
                    qualification: data.education?.qualification || '',
                    institution: data.education?.institution || '',
                    year: data.education?.year || '',
                },
                preferences: {
                    examTypes: data.preferences?.examTypes || [],
                    subjects: data.preferences?.subjects || [],
                    language: data.preferences?.language || 'English',
                    notifications: {
                        email: data.preferences?.notifications?.email !== false,
                        sms: data.preferences?.notifications?.sms || false,
                        push: data.preferences?.notifications?.push !== false,
                    },
                },
            });
            setLoading(false);
        } catch (err: any) {
            console.error(err);
            setError('Failed to fetch profile data');
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setProfileData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent as keyof ProfileData],
                    [child]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
                }
            }));
        } else {
            setProfileData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
            }));
        }
    };

    const handleArrayChange = (field: 'examTypes' | 'subjects', value: string, checked: boolean) => {
        setProfileData(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [field]: checked
                    ? [...prev.preferences[field], value]
                    : prev.preferences[field].filter(item => item !== value)
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const config = {
                headers: { Authorization: `Bearer ${user?.token}` }
            };

            const { data } = await axios.put('http://localhost:5000/api/users/profile', profileData, config);

            // Update user context
            updateUser(data);

            alert('Profile updated successfully!');
            navigate('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

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

    const tabs = [
        { id: 'personal', name: 'Personal Info', icon: '👤' },
        { id: 'address', name: 'Address', icon: '🏠' },
        { id: 'education', name: 'Education', icon: '🎓' },
        { id: 'preferences', name: 'Preferences', icon: '⚙️' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
                                <p className="text-gray-600 mt-1">Update your personal information and preferences</p>
                            </div>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                            >
                                ← Back to Dashboard
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
                            {error}
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-sm">
                        {/* Tabs */}
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8 px-6">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <span className="mr-2">{tab.icon}</span>
                                        {tab.name}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            {/* Personal Info Tab */}
                            {activeTab === 'personal' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={profileData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={profileData.phone}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Date of Birth
                                            </label>
                                            <input
                                                type="date"
                                                name="dateOfBirth"
                                                value={profileData.dateOfBirth}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Gender
                                            </label>
                                            <select
                                                name="gender"
                                                value={profileData.gender}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Bio
                                        </label>
                                        <textarea
                                            name="bio"
                                            value={profileData.bio}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Avatar URL
                                        </label>
                                        <input
                                            type="url"
                                            name="avatar"
                                            value={profileData.avatar}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="https://example.com/avatar.jpg"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Address Tab */}
                            {activeTab === 'address' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Street Address
                                        </label>
                                        <input
                                            type="text"
                                            name="address.street"
                                            value={profileData.address.street}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                name="address.city"
                                                value={profileData.address.city}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                State
                                            </label>
                                            <input
                                                type="text"
                                                name="address.state"
                                                value={profileData.address.state}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Country
                                            </label>
                                            <input
                                                type="text"
                                                name="address.country"
                                                value={profileData.address.country}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                PIN Code
                                            </label>
                                            <input
                                                type="text"
                                                name="address.pincode"
                                                value={profileData.address.pincode}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Education Tab */}
                            {activeTab === 'education' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Highest Qualification
                                        </label>
                                        <input
                                            type="text"
                                            name="education.qualification"
                                            value={profileData.education.qualification}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., Bachelor's in Engineering"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Institution
                                        </label>
                                        <input
                                            type="text"
                                            name="education.institution"
                                            value={profileData.education.institution}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., Delhi University"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Year of Completion
                                        </label>
                                        <input
                                            type="text"
                                            name="education.year"
                                            value={profileData.education.year}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., 2020"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Preferences Tab */}
                            {activeTab === 'preferences' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Preferred Language
                                        </label>
                                        <select
                                            name="preferences.language"
                                            value={profileData.preferences.language}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="English">English</option>
                                            <option value="Hindi">Hindi</option>
                                            <option value="Both">Both (English & Hindi)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Exam Types (Select all that apply)
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {examTypes.map(exam => (
                                                <label key={exam} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={profileData.preferences.examTypes.includes(exam)}
                                                        onChange={(e) => handleArrayChange('examTypes', exam, e.target.checked)}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700">{exam}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Subjects of Interest
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {subjects.map(subject => (
                                                <label key={subject} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={profileData.preferences.subjects.includes(subject)}
                                                        onChange={(e) => handleArrayChange('subjects', subject, e.target.checked)}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-700">{subject}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Notification Preferences
                                        </label>
                                        <div className="space-y-3">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="preferences.notifications.email"
                                                    checked={profileData.preferences.notifications.email}
                                                    onChange={handleInputChange}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">Email notifications</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="preferences.notifications.sms"
                                                    checked={profileData.preferences.notifications.sms}
                                                    onChange={handleInputChange}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">SMS notifications</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    name="preferences.notifications.push"
                                                    checked={profileData.preferences.notifications.push}
                                                    onChange={handleInputChange}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">Push notifications</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex justify-end pt-6 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileEditPage;