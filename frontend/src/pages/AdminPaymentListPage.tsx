import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl, API_ENDPOINTS } from '../config/api';

interface Order {
  _id: string;
  user: { _id: string; name: string; email: string; phone?: string };
  itemType: string;
  itemId: { _id: string; title: string; price: number };
  amount: number;
  paymentMethod: string;
  screenshotUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
  rejectionReason?: string;
}

const AdminPaymentListPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchOrders();
  }, [user, navigate, activeTab]);

  const fetchOrders = async () => {
    if (!user?.token) {
      setError('Authentication required');
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      if (activeTab === 'pending') {
        const { data } = await axios.get(
          buildApiUrl(API_ENDPOINTS.ADMIN_PENDING_PAYMENTS),
          config
        );
        setPendingOrders(data.orders || []);
      } else {
        const { data } = await axios.get(
          buildApiUrl(API_ENDPOINTS.ADMIN_ALL_PAYMENTS),
          config
        );
        setOrders(data.orders || []);
      }

      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch orders');
      setLoading(false);
    }
  };

  const handleApprove = async (orderId: string) => {
    if (!confirm('Are you sure you want to approve this payment?')) return;
    if (!user?.token) return;

    setActionLoading(orderId);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.put(
        buildApiUrl(API_ENDPOINTS.ADMIN_APPROVE_PAYMENT(orderId)),
        {},
        config
      );

      alert('Payment approved successfully!');
      fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to approve payment');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (orderId: string) => {
    const reason = prompt('Enter rejection reason (optional):');
    if (reason === null) return; // User cancelled
    if (!user?.token) return;

    setActionLoading(orderId);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      };

      await axios.put(
        buildApiUrl(API_ENDPOINTS.ADMIN_REJECT_PAYMENT(orderId)),
        { reason },
        config
      );

      alert('Payment rejected successfully!');
      fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reject payment');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const currentOrders = activeTab === 'pending' ? pendingOrders : orders;

  if (loading) return <div className="text-center mt-8">Loading orders...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-8">Payment Management</h1>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'pending'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Pending Approvals ({pendingOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              All Orders
            </button>
          </nav>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {currentOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {activeTab === 'pending' ? 'No pending payments' : 'No orders found'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Screenshot
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {activeTab === 'pending' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">#{order._id.slice(-8)}</div>
                        <div className="text-gray-500">{formatDate(order.createdAt)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{order.user.name}</div>
                        <div className="text-gray-500">{order.user.email}</div>
                        {order.user.phone && (
                          <div className="text-gray-500">{order.user.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{order.itemId.title}</div>
                        <div className="text-gray-500 capitalize">{order.itemType}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(order.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.screenshotUrl ? (
                        <button
                          onClick={() => setSelectedImage(order.screenshotUrl!)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View Screenshot
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">No screenshot</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                      {order.status === 'rejected' && order.rejectionReason && (
                        <div className="text-xs text-red-600 mt-1">
                          {order.rejectionReason}
                        </div>
                      )}
                    </td>
                    {activeTab === 'pending' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(order._id)}
                            disabled={actionLoading === order._id}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                          >
                            {actionLoading === order._id ? 'Processing...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(order._id)}
                            disabled={actionLoading === order._id}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Screenshot Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Payment Screenshot</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <img
              src={selectedImage}
              alt="Payment Screenshot"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentListPage;

