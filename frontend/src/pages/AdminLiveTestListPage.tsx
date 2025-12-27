import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

interface LiveTest {
  _id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
  instructor: { name: string };
}

const AdminLiveTestListPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [liveTests, setLiveTests] = useState<LiveTest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/'); // Redirect if not admin
      return;
    }

    const fetchLiveTests = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        // TODO: Implement backend route for admin to get all live tests
        const { data } = await axios.get<LiveTest[]>('https://carrerpath-m48v.onrender.com/api/livetests/admin', config);
        setLiveTests(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch live tests');
        setLoading(false);
      }
    };
    fetchLiveTests();
  }, [user, navigate]);

  const deleteLiveTestHandler = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this live test?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        };
        // TODO: Implement backend route for admin to delete live test
        await axios.delete(`https://carrerpath-m48v.onrender.com/api/livetests/admin/${id}`, config);
        setLiveTests(liveTests.filter((test) => test._id !== id));
      } catch (err) {
        console.error(err);
        alert('Failed to delete live test');
      }
    }
  };

  if (loading) return <div className="text-center mt-8">Loading live tests...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-8">Manage Live Tests</h1>
      <Link to="/admin/livetests/new" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">Create New Live Test</Link>
      <div className="bg-white shadow-lg rounded-lg p-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {liveTests.map((test) => (
              <tr key={test._id}>
                <td className="px-6 py-4 whitespace-nowrap">{test._id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{test.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(test.startTime).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(test.endTime).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{test.duration} mins</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/admin/livetests/${test._id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                  <button
                    onClick={() => deleteLiveTestHandler(test._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLiveTestListPage;

