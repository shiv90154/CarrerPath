import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Payment {
  _id: string;
  user: { _id: string; name: string; email: string };
  order: string; // Will populate later
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  status: string;
  paidAt: string;
}

const AdminPaymentListPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/'); // Redirect if not admin
      return;
    }

    const fetchPayments = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        // TODO: Implement backend route for admin to get all payments
        const { data } = await axios.get<Payment[]>('http://localhost:5000/api/payments/admin', config);
        setPayments(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch payments');
        setLoading(false);
      }
    };
    fetchPayments();
  }, [user, navigate]);

  if (loading) return <div className="text-center mt-8">Loading payments...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-8">Manage Payments</h1>
      <div className="bg-white shadow-lg rounded-lg p-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment._id}>
                <td className="px-6 py-4 whitespace-nowrap">{payment._id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.user.name} ({payment.user.email})</td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.razorpayOrderId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.amount} {payment.currency}</td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.status}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(payment.paidAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPaymentListPage;

