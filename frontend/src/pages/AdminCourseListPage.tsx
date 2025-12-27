import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  instructor: { name: string };
}

const AdminCourseListPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/'); // Redirect if not admin
      return;
    }

    const fetchCourses = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get<Course[]>('https://carrerpath-m48v.onrender.com/api/courses/admin', config);
        setCourses(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch courses');
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user, navigate]);

  const deleteCourseHandler = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course and all its associated videos?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        };
        await axios.delete(`https://carrerpath-m48v.onrender.com/api/courses/admin/${id}`, config);
        setCourses(courses.filter((course) => course._id !== id));
      } catch (err) {
        console.error(err);
        alert('Failed to delete course');
      }
    }
  };

  if (loading) return <div className="text-center mt-8">Loading courses...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-8">Manage Courses</h1>
      <Link to="/admin/courses/new" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">Create New Course</Link>
      <div className="bg-white shadow-lg rounded-lg p-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course._id}>
                <td className="px-6 py-4 whitespace-nowrap">{course._id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{course.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">₹{course.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">{course.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">{course.instructor.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/admin/courses/${course._id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                  <button
                    onClick={() => deleteCourseHandler(course._id)}
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

export default AdminCourseListPage;

