import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
    createdAt: string;
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    token: string;
    avatar?: string;
    bio?: string;
    dateOfBirth?: string;
    gender?: string;
    emailVerified?: boolean;
    phoneVerified?: boolean;
    lastLogin?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        pincode?: string;
    };
    education?: {
        qualification?: string;
        institution?: string;
        year?: string;
    };
    preferences?: {
        examTypes?: string[];
        subjects?: string[];
        language?: string;
        notifications?: {
            email?: boolean;
            sms?: boolean;
            push?: boolean;
        };
    };
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    loginWithCredentials: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, phone: string, password: string) => Promise<void>;
    updateUser: (userData: Partial<User>) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
    }, []);

    const login = (userData: User) => {
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setUser(userData);
    };

    const loginWithCredentials = async (email: string, password: string) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.post(
            'http://localhost:5000/api/users/login',
            { email, password },
            config
        );
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
    };

    const register = async (name: string, email: string, phone: string, password: string) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.post(
            'http://localhost:5000/api/users/register',
            { name, email, phone, password },
            config
        );
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
    };

    const updateUser = (userData: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...userData };
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            setUser(updatedUser);
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            loginWithCredentials,
            register,
            updateUser,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

