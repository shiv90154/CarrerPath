import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

interface CourseData {
  title: string;
  description: string;
  fullDescription: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  level?: string;
  duration: string;
  language?: string;
  tags?: string;
  requirements?: string;
  whatYouWillLearn?: string;
}

const AdminCourseEditPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // For editing existing course

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [duration, setDuration] = useState('');
  const [language, setLanguage] = useState('English');
  const [tags, setTags] = useState('');
  const [requirements, setRequirements] = useState('');
  const [whatYouWillLearn, setWhatYouWillLearn] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    if (id) {
      const fetchCourse = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.get<CourseData>(`https://carrerpath-m48v.onrender.com/api/courses/admin/${id}`, config);
          setTitle(data.title);
          setDescription(data.description);
          setFullDescription(data.fullDescription || '');
          setPrice(data.price);
          setOriginalPrice(data.originalPrice || data.price);
          setImage(data.image);
          setCategory(data.category);
          setLevel(data.level || 'Beginner');
          setDuration(data.duration || '');
          setLanguage(data.language || 'English');
          setTags(Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''));
          setRequirements(Array.isArray(data.requirements) ? data.requirements.join(', ') : (data.requirements || ''));
          setWhatYouWillLearn(Array.isArray(data.whatYouWillLearn) ? data.whatYouWillLearn.join(', ') : (data.whatYouWillLearn || ''));

          setLoading(false);
        } catch (err) {
          console.error(err);
          setError('Failed to fetch course details');
          setLoading(false);
        }
      };
      fetchCourse();
    } else {
      setLoading(false);
    }
  }, [id, user, navigate]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      const courseData: CourseData = {
        title,
        description,
        fullDescription,
        price,
        originalPrice,
        image,
        category,
        level,
        duration,
        language,
        tags,
        requirements,
        whatYouWillLearn
      };
      let response;

      if (id) {
        // Update course
        response = await axios.put(`https://carrerpath-m48v.onrender.com/api/courses/admin/${id}`, courseData, config);
        alert('Course updated successfully');
      } else {
        // Create new course
        response = await axios.post('https://carrerpath-m48v.onrender.com/api/courses', courseData, config);
        alert('Course created successfully');
      }
      navigate('/admin/courses');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save course');
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-8">{id ? 'Edit Course' : 'Create New Course'}</h1>

      {/* Course Form */}
      <div className="bg-white shadow-lg rounded-lg mb-8">
        <div className="p-6">
          <form onSubmit={submitHandler}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Course Title</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Short Description</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows={3} required placeholder="Brief description for course cards"></textarea>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullDescription">Full Description</label>
                <textarea id="fullDescription" value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows={8} required placeholder="Detailed course description"></textarea>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Price (₹)</label>
                <input type="number" id="price" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required min="0" />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="originalPrice">Original Price (₹)</label>
                <input type="number" id="originalPrice" value={originalPrice} onChange={(e) => setOriginalPrice(Number(e.target.value))} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" min="0" placeholder="Leave empty if same as price" />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">Category</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required>
                  <option value="">Select Category</option>
                  <option value="UPSC">UPSC</option>
                  <option value="SSC">SSC</option>
                  <option value="Banking">Banking</option>
                  <option value="Railway">Railway</option>
                  <option value="State PSC">State PSC</option>
                  <option value="Teaching">Teaching</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="level">Level</label>
                <select id="level" value={level} onChange={(e) => setLevel(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">Duration</label>
                <input type="text" id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required placeholder="e.g., 10 hours, 3 months, 50 videos" />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="language">Language</label>
                <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Both">Both (English & Hindi)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">Image URL</label>
                <input type="text" id="image" value={image} onChange={(e) => setImage(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">Tags (comma separated)</label>
                <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="e.g., UPSC, Current Affairs, History" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="requirements">Requirements (comma separated)</label>
                <textarea id="requirements" value={requirements} onChange={(e) => setRequirements(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows={3} placeholder="e.g., Basic knowledge of Indian History, Internet connection"></textarea>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="whatYouWillLearn">What You Will Learn (comma separated)</label>
                <textarea id="whatYouWillLearn" value={whatYouWillLearn} onChange={(e) => setWhatYouWillLearn(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows={4} placeholder="e.g., Complete UPSC syllabus, Current affairs analysis, Mock test strategies"></textarea>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-4">
              <button type="button" onClick={() => navigate('/admin/courses')} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Cancel
              </button>
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                {id ? 'Update Course' : 'Create Course'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Note about video management */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Video Management
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Courses no longer contain videos directly. Videos are managed separately through the dedicated Video Management system.
                This course will serve as educational content without video functionality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseEditPage;