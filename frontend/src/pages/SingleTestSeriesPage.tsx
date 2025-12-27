import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Test {
  _id: string;
  title: string;
  description: string;
  isFree: boolean;
}

interface TestSeries {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  instructor: { name: string };
  tests: Test[];
}

const SingleTestSeriesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [testSeries, setTestSeries] = useState<TestSeries | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPurchased, setHasPurchased] = useState<boolean>(false);

  useEffect(() => {
    const fetchTestSeries = async () => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: user ? `Bearer ${user.token}` : '',
          },
        };
        const { data } = await axios.get<TestSeries>(`http://localhost:5000/api/testseries/${id}`, config);
        setTestSeries(data);
        setLoading(false);

        // TODO: Implement actual purchase check logic
        // For now, assume not purchased if not logged in or if price is > 0
        if (user && data.price > 0) {
          // In a real app, you would check the user's purchases here
          // For demonstration, let's assume user has purchased if they are logged in and it's a paid course
          setHasPurchased(false);
        } else if (user && data.price === 0) {
          setHasPurchased(true);
        }

      } catch (err) {
        setError('Failed to fetch test series');
        setLoading(false);
      }
    };
    fetchTestSeries();
  }, [id, user]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePurchase = async () => {
    if (!user || !testSeries) {
      alert('Please log in to purchase this test series.');
      return;
    }

    if (testSeries.price === 0) {
      alert('This test series is free and does not require purchase.');
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    try {
      const orderConfig = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data: { razorpayOrderId, amount, currency, name, email, phone, description } } = await axios.post(
        'http://localhost:5000/api/payments/orders',
        { amount: testSeries.price, testSeriesId: testSeries._id },
        orderConfig
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Use environment variable
        amount: amount,
        currency: currency,
        name: 'Institute Name', // Replace with your institute name
        description: description,
        order_id: razorpayOrderId,
        handler: async (response: any) => {
          try {
            const verifyConfig = {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
              },
            };
            await axios.post(
              'http://localhost:5000/api/payments/verify',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              verifyConfig
            );
            alert('Payment successful! You now have full access.');
            setHasPurchased(true);
          } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Payment verification failed.');
          }
        },
        prefill: {
          name,
          email,
          contact: phone,
        },
        notes: {
          address: 'Razorpay Corporate Office',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Error initiating payment.');
    }
  };

  if (loading) return <div className="text-center mt-8">Loading test series...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  if (!testSeries) return <div className="text-center mt-8">Test Series not found.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-8">{testSeries.title}</h1>
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <img src={testSeries.image} alt={testSeries.title} className="w-full h-64 object-cover mb-6 rounded-md" />
        <p className="text-lg mb-4">{testSeries.description}</p>
        <p className="text-xl font-semibold mb-4">Price: ₹{testSeries.price}</p>
        <p className="text-md text-gray-600 mb-6">Instructor: {testSeries.instructor.name}</p>

        {!hasPurchased && testSeries.price > 0 && user && (
          <button
            onClick={handlePurchase}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-6"
          >
            Buy Now for ₹{testSeries.price}
          </button>
        )}

        <h2 className="text-3xl font-bold mb-4">Tests in this Series</h2>
        {testSeries.tests.length === 0 ? (
          <p>No tests available in this series.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {testSeries.tests.map((test) => (
              <div key={test._id} className="border p-4 rounded-md shadow-sm">
                <h3 className="text-xl font-semibold mb-2">{test.title} {test.isFree && '(Free Sample)'}</h3>
                <p className="text-gray-600 mb-4">{test.description}</p>
                {(test.isFree || hasPurchased) ? (
                  <Link to={`/test/${test._id}`} className="text-indigo-600 hover:text-indigo-900">Start Test</Link>
                ) : (
                  <p className="text-yellow-500">Purchase the test series to unlock this test.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleTestSeriesPage;

