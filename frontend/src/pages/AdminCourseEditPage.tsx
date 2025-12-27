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

interface VideoData {
  title: string;
  description: string;
  isFree: boolean;
  videoFile: File | null;
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
  const [videos, setVideos] = useState<VideoData[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);

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
          const { data } = await axios.get<CourseData & { videos: any[] }>(`http://localhost:5000/api/courses/admin/${id}`, config);
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
          setTags(data.tags ? data.tags.join(', ') : '');
          setRequirements(data.requirements ? data.requirements.join(', ') : '');
          setWhatYouWillLearn(data.whatYouWillLearn ? data.whatYouWillLearn.join(', ') : '');
          setVideos(data.videos.map(video => ({ ...video, videoFile: null })));
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
        response = await axios.put(`http://localhost:5000/api/courses/admin/${id}`, courseData, config);
        alert('Course updated successfully');
      } else {
        // Create new course
        response = await axios.post('http://localhost:5000/api/courses', courseData, config);
        alert('Course created successfully');
      }
      navigate('/admin/courses');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to save course');
    }
  };

  const handleVideoUpload = async (courseId: string, videoData: VideoData) => {
    if (!user || !videoData.videoFile) return;

    setUploadingVideo(true);
    const formData = new FormData();
    formData.append('title', videoData.title);
    formData.append('description', videoData.description);
    formData.append('isFree', String(videoData.isFree));
    formData.append('video', videoData.videoFile);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.post(`http://localhost:5000/api/courses/admin/${courseId}/videos`, formData, config);
      alert('Video uploaded successfully');
      // TODO: Refresh course videos after upload
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to upload video');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleAddVideoField = () => {
    setVideos([...videos, { title: '', description: '', isFree: false, videoFile: null }]);
  };

  const handleVideoChange = (index: number, field: keyof VideoData, value: string | boolean | File | null) => {
    const newVideos = [...videos];
    // @ts-ignore
    newVideos[index][field] = value;
    setVideos(newVideos);
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-8">{id ? 'Edit Course' : 'Create New Course'}</h1>
      <form onSubmit={submitHandler} className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Short Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows={3} required placeholder="Brief description for course cards"></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullDescription">Full Description</label>
          <textarea id="fullDescription" value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows={8} required placeholder="Detailed course description"></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Price (₹)</label>
          <input type="number" id="price" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required min="0" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="originalPrice">Original Price (₹) - Optional</label>
          <input type="number" id="originalPrice" value={originalPrice} onChange={(e) => setOriginalPrice(Number(e.target.value))} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" min="0" placeholder="Leave empty if same as price" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">Image URL</label>
          <input type="text" id="image" value={image} onChange={(e) => setImage(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required />
        </div>
        <div className="mb-4">
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
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="level">Level</label>
          <select id="level" value={level} onChange={(e) => setLevel(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">Duration</label>
          <input type="text" id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required placeholder="e.g., 10 hours, 3 months, 50 videos" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="language">Language</label>
          <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Both">Both (English & Hindi)</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">Tags (comma separated)</label>
          <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="e.g., UPSC, Current Affairs, History" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="requirements">Requirements (comma separated)</label>
          <textarea id="requirements" value={requirements} onChange={(e) => setRequirements(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows={3} placeholder="e.g., Basic knowledge of Indian History, Internet connection"></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="whatYouWillLearn">What You Will Learn (comma separated)</label>
          <textarea id="whatYouWillLearn" value={whatYouWillLearn} onChange={(e) => setWhatYouWillLearn(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows={4} placeholder="e.g., Complete UPSC syllabus, Current affairs analysis, Mock test strategies"></textarea>
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2" disabled={uploadingVideo}>
          {id ? 'Update Course' : 'Create Course'}
        </button>
        <button type="button" onClick={() => navigate('/admin/courses')} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Cancel
        </button>
      </form>

      {id && (
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Manage Videos</h2>
          {videos.map((video, index) => (
            <div key={index} className="border p-4 rounded-md mb-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Video Title</label>
                <input type="text" value={video.title} onChange={(e) => handleVideoChange(index, 'title', e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Video Description</label>
                <textarea value={video.description} onChange={(e) => handleVideoChange(index, 'description', e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" rows={3}></textarea>
              </div>
              <div className="mb-4">
                <label className="inline-flex items-center">
                  <input type="checkbox" checked={video.isFree} onChange={(e) => handleVideoChange(index, 'isFree', e.target.checked)} className="form-checkbox" />
                  <span className="ml-2 text-gray-700">Is Free Sample?</span>
                </label>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Upload Video File</label>
                <input type="file" onChange={(e) => handleVideoChange(index, 'videoFile', e.target.files ? e.target.files[0] : null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
              <button type="button" onClick={() => handleVideoUpload(id, video)} className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled={uploadingVideo}>
                {uploadingVideo ? 'Uploading...' : 'Upload Video'}
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddVideoField} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4">
            Add New Video Field
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminCourseEditPage;

