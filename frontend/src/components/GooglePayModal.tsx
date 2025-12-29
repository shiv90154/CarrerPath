import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { buildApiUrl } from '../config/api';

interface GooglePayModalProps {
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

const GooglePayModal: React.FC<GooglePayModalProps> = ({ isOpen, onClose, product, onSuccess }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<'order' | 'payment' | 'upload'>('order');
    const [orderId, setOrderId] = useState<string | null>(null);
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [uploadLoading, setUploadLoading] = useState(false);

    const googlePayNumber = '9876543210'; // Replace with actual Google Pay number
    const upiId = 'merchant@paytm'; // Replace with actual UPI ID

    const handleCreateOrder = async () => {
        if (!user) {
            setError('Please login to make a purchase');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
            };

            const orderData = {
                itemType: product.type,
                itemId: product.id,
                amount: product.price,
            };

            const { data } = await axios.post(
                buildApiUrl('/api/payments/create-order'),
                orderData,
                config
            );

            if (data.success) {
                if (product.price === 0) {
                    // Free content - immediate access
                    alert('Free content access granted!');
                    onSuccess();
                    onClose();
                } else {
                    // Paid content - proceed to payment
                    setOrderId(data.order._id);
                    setStep('payment');
                }
            } else {
                throw new Error(data.message || 'Failed to create order');
            }
        } catch (error: any) {
            setError(error.response?.data?.message || error.message || 'Failed to create order');
        } finally {
            setLoading(false);
        }
    };

    const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file');
                return;
            }
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }
            setScreenshot(file);
            setError(null);
        }
    };

    const handleUploadScreenshot = async () => {
        if (!screenshot || !orderId || !user?.token) {
            setError('Please select a screenshot to upload');
            return;
        }

        setUploadLoading(true);
        setError(null);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data',
                },
            };

            const formData = new FormData();
            formData.append('screenshot', screenshot);

            const { data } = await axios.post(
                buildApiUrl(`/api/payments/upload-screenshot/${orderId}`),
                formData,
                config
            );

            if (data.success) {
                alert('Payment screenshot uploaded successfully! Your order is now pending admin approval. You will receive access once approved.');
                onSuccess();
                onClose();
            } else {
                throw new Error(data.message || 'Failed to upload screenshot');
            }
        } catch (error: any) {
            setError(error.response?.data?.message || error.message || 'Failed to upload screenshot');
        } finally {
            setUploadLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const resetModal = () => {
        setStep('order');
        setOrderId(null);
        setScreenshot(null);
        setError(null);
        setLoading(false);
        setUploadLoading(false);
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {step === 'order' && 'Complete Purchase'}
                        {step === 'payment' && 'Make Payment'}
                        {step === 'upload' && 'Upload Screenshot'}
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={loading || uploadLoading}
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

                {/* Product Details */}
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
                            <p className="text-lg font-bold text-blue-600">
                                {product.price === 0 ? 'FREE' : formatPrice(product.price)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Step 1: Order Creation */}
                {step === 'order' && (
                    <>
                        <div className="mb-6">
                            <h5 className="font-medium text-gray-900 mb-2">Payment Method:</h5>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">G</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-green-800">Google Pay</p>
                                        <p className="text-sm text-green-600">Manual payment with screenshot verification</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h5 className="font-medium text-yellow-800 mb-2">⚠️ Important Instructions:</h5>
                            <ul className="text-sm text-yellow-700 space-y-1">
                                <li>• Make payment via Google Pay to the provided number</li>
                                <li>• Take a screenshot of the successful payment</li>
                                <li>• Upload the screenshot for verification</li>
                                <li>• Access will be granted after admin approval</li>
                                <li>• You will receive email notification once approved</li>
                            </ul>
                        </div>

                        <button
                            onClick={handleCreateOrder}
                            disabled={loading}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Order...' :
                                product.price === 0 ? 'Get Free Access' : 'Proceed to Payment'}
                        </button>
                    </>
                )}

                {/* Step 2: Payment Instructions */}
                {step === 'payment' && (
                    <>
                        <div className="mb-6">
                            <h5 className="font-medium text-gray-900 mb-3">Make Payment via Google Pay:</h5>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <div className="text-center">
                                    <p className="text-sm text-blue-600 mb-2">Send payment to:</p>
                                    <p className="text-xl font-bold text-blue-800">{googlePayNumber}</p>
                                    <p className="text-sm text-blue-600 mt-1">UPI ID: {upiId}</p>
                                    <p className="text-lg font-bold text-green-600 mt-2">
                                        Amount: {formatPrice(product.price)}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <h6 className="font-medium text-gray-800 mb-2">Steps to pay:</h6>
                                <ol className="text-sm text-gray-600 space-y-1">
                                    <li>1. Open Google Pay app</li>
                                    <li>2. Send money to: <strong>{googlePayNumber}</strong></li>
                                    <li>3. Enter amount: <strong>{formatPrice(product.price)}</strong></li>
                                    <li>4. Add note: <strong>{product.title}</strong></li>
                                    <li>5. Complete the payment</li>
                                    <li>6. Take screenshot of success page</li>
                                </ol>
                            </div>
                        </div>

                        <button
                            onClick={() => setStep('upload')}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            I've Made the Payment - Upload Screenshot
                        </button>
                    </>
                )}

                {/* Step 3: Screenshot Upload */}
                {step === 'upload' && (
                    <>
                        <div className="mb-6">
                            <h5 className="font-medium text-gray-900 mb-3">Upload Payment Screenshot:</h5>

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleScreenshotChange}
                                    className="hidden"
                                    id="screenshot-upload"
                                />
                                <label
                                    htmlFor="screenshot-upload"
                                    className="cursor-pointer flex flex-col items-center"
                                >
                                    <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-gray-600">Click to select screenshot</p>
                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                                </label>
                            </div>

                            {screenshot && (
                                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-sm text-green-700">
                                        ✅ Selected: {screenshot.name} ({(screenshot.size / 1024 / 1024).toFixed(2)} MB)
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm text-blue-700">
                                <strong>Note:</strong> After uploading, your order will be pending admin approval.
                                You'll receive email notification once approved and access will be granted immediately.
                            </p>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setStep('payment')}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                disabled={uploadLoading}
                            >
                                Back
                            </button>
                            <button
                                onClick={handleUploadScreenshot}
                                disabled={!screenshot || uploadLoading}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploadLoading ? 'Uploading...' : 'Upload & Submit'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default GooglePayModal;