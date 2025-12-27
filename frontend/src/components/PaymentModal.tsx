import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { buildApiUrl, API_ENDPOINTS } from '../config/api';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: {
        id: string;
        title: string;
        price: number;
        type: 'course' | 'testSeries' | 'ebook' | 'studyMaterial';
        image?: string;
    };
    onSuccess: () => void;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, product, onSuccess }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePayment = async () => {
        if (!user) {
            setError('Please login to make a purchase');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            console.log('Starting payment process for:', product);

            // Check if Razorpay is loaded
            if (!window.Razorpay) {
                throw new Error('Razorpay SDK not loaded. Please refresh the page and try again.');
            }

            // Create Razorpay order
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
            };

            const orderData = {
                amount: product.price,
                [`${product.type === 'studyMaterial' ? 'materialId' : product.type + 'Id'}`]: product.id,
            };

            console.log('Creating order with data:', orderData);

            const { data } = await axios.post(
                buildApiUrl(API_ENDPOINTS.PAYMENT_ORDERS),
                orderData,
                config
            );

            console.log('Order created successfully:', data);

            // Get Razorpay key from environment or use test key
            const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_id';

            if (!razorpayKey || razorpayKey === 'rzp_test_your_key_id') {
                throw new Error('Razorpay key not configured. Please contact administrator.');
            }

            // Initialize Razorpay
            const options = {
                key: razorpayKey,
                amount: data.amount,
                currency: data.currency,
                name: 'EduTech Institute',
                description: data.description,
                order_id: data.razorpayOrderId,
                prefill: {
                    name: data.name,
                    email: data.email,
                    contact: data.phone,
                },
                theme: {
                    color: '#2563eb',
                },
                handler: async (response: any) => {
                    try {
                        console.log('Payment successful, verifying:', response);

                        // Verify payment
                        const verifyData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        };

                        await axios.post(
                            buildApiUrl(API_ENDPOINTS.PAYMENT_VERIFY),
                            verifyData,
                            config
                        );

                        console.log('Payment verified successfully');
                        alert('Payment successful! You now have access to the content.');
                        onSuccess();
                        onClose();
                    } catch (error: any) {
                        console.error('Payment verification failed:', error);
                        setError('Payment verification failed. Please contact support.');
                    }
                },
                modal: {
                    ondismiss: () => {
                        console.log('Payment modal dismissed');
                        setLoading(false);
                    },
                },
            };

            console.log('Opening Razorpay with options:', options);
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error: any) {
            console.error('Payment initiation failed:', error);
            setError(error.response?.data?.message || error.message || 'Payment initiation failed');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Complete Purchase</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={loading}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <div className="mb-6">
                    <div className="flex items-center space-x-4">
                        {product.image && (
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                        )}
                        <div>
                            <h4 className="font-medium text-gray-900">{product.title}</h4>
                            <p className="text-sm text-gray-600 capitalize">
                                {product.type === 'testSeries' ? 'Test Series' :
                                    product.type === 'studyMaterial' ? 'Study Material' :
                                        product.type}
                            </p>
                            <p className="text-lg font-bold text-blue-600">{formatPrice(product.price)}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h5 className="font-medium text-gray-900 mb-2">What you'll get:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                        {product.type === 'course' && (
                            <>
                                <li>• Lifetime access to all course videos</li>
                                <li>• Downloadable resources</li>
                                <li>• Certificate of completion</li>
                                <li>• Mobile and desktop access</li>
                            </>
                        )}
                        {product.type === 'testSeries' && (
                            <>
                                <li>• Access to all practice tests</li>
                                <li>• Detailed performance analytics</li>
                                <li>• Solution explanations</li>
                                <li>• Progress tracking</li>
                            </>
                        )}
                        {product.type === 'ebook' && (
                            <>
                                <li>• Digital book access</li>
                                <li>• Offline reading capability</li>
                                <li>• Search and bookmark features</li>
                                <li>• Mobile and desktop access</li>
                            </>
                        )}
                        {product.type === 'studyMaterial' && (
                            <>
                                <li>• Previous year question papers</li>
                                <li>• Detailed solutions and explanations</li>
                                <li>• High-quality PDF format</li>
                                <li>• Lifetime access and downloads</li>
                            </>
                        )}
                    </ul>
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : `Pay ${formatPrice(product.price)}`}
                    </button>
                </div>

                <p className="text-xs text-gray-500 mt-4 text-center">
                    Secure payment powered by Razorpay. Your payment information is encrypted and secure.
                </p>

                {/* Debug Info (remove in production) */}
                {import.meta.env.DEV && (
                    <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
                        <p><strong>Debug Info:</strong></p>
                        <p>Razorpay Key: {import.meta.env.VITE_RAZORPAY_KEY_ID || 'Not set'}</p>
                        <p>Razorpay Loaded: {window.Razorpay ? 'Yes' : 'No'}</p>
                        <p>User: {user?.name}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;