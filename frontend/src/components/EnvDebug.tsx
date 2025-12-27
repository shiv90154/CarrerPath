import React from 'react';

const EnvDebug: React.FC = () => {
    return (
        <div className="fixed top-4 right-4 bg-black text-white p-4 rounded-lg text-xs z-50 max-w-md">
            <h3 className="font-bold mb-2">Environment Debug</h3>
            <div className="space-y-1">
                <div>
                    <strong>VITE_API_URL:</strong> {import.meta.env.VITE_API_URL || 'UNDEFINED'}
                </div>
                <div>
                    <strong>VITE_RAZORPAY_KEY_ID:</strong> {import.meta.env.VITE_RAZORPAY_KEY_ID || 'UNDEFINED'}
                </div>
                <div>
                    <strong>NODE_ENV:</strong> {import.meta.env.NODE_ENV || 'UNDEFINED'}
                </div>
                <div>
                    <strong>MODE:</strong> {import.meta.env.MODE || 'UNDEFINED'}
                </div>
                <div>
                    <strong>DEV:</strong> {import.meta.env.DEV ? 'true' : 'false'}
                </div>
                <div>
                    <strong>PROD:</strong> {import.meta.env.PROD ? 'true' : 'false'}
                </div>
            </div>
        </div>
    );
};

export default EnvDebug;