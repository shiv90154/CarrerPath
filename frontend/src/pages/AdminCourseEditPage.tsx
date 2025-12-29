import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import VideoUploadModal from '../components/VideoUploadModal';
import YouTubeVideoModal from '../components/YouTubeVideoModal';

interface VideoData {
  _id?: string;
  title: string;
  description: string;
  isFree: boolean;
  videoFile: File | null;
  videoUrl?: string;
  duration?: string;
}

interface SubcategoryData {
  subcategoryName: string;
  subcategoryDescription: string;
  videos: VideoData[];
}

interface CategoryData {
  categoryName: string;
  categoryDescription: string;
  subcategories: SubcategoryData[];
  videos: VideoData[]; // Direct videos without subcategories
}

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
  content?: CategoryData[]; // Hierarchical content structure
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
  const [content, setContent] = useState<CategoryData[]>([]);
  const [videos, setVideos] = useState<VideoData[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'content'>('basic');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);
  const [videoModalContext, setVideoModalContext] = useState<{
    categoryIndex?: number;
    subcategoryIndex?: number;
  }>({});

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
          const { data } = await axios.get<CourseData & { videos: any[], content: CategoryData[] }>(`https://carrerpath-m48v.onrender.com/api/courses/admin/${id}`, config);
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
          setContent(data.content || []);
          setVideos(data.videos.map(video => ({ ...video, videoFile: null })));

          // If course has no content structure but has videos, suggest creating categories
          if ((!data.content || data.content.length === 0) && data.videos && data.videos.length > 0) {
            // Course has videos but no category structure - consider adding categories for better organization
          }

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
        whatYouWillLearn,
        content
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

  const openVideoModal = (categoryIndex?: number, subcategoryIndex?: number) => {
    // Validate categoryIndex before opening modal
    if (categoryIndex !== undefined) {
      if (!content || content.length === 0) {
        alert('Please add at least one category before uploading videos. Click "Add Category" to create a category first.');
        return;
      }

      if (categoryIndex < 0 || categoryIndex >= content.length || !content[categoryIndex]) {
        alert(`Invalid category index: ${categoryIndex}. Please refresh the page and try again.`);
        return;
      }

      if (subcategoryIndex !== undefined) {
        const category = content[categoryIndex];
        if (!category.subcategories || subcategoryIndex < 0 || subcategoryIndex >= category.subcategories.length || !category.subcategories[subcategoryIndex]) {
          alert(`Invalid subcategory index: ${subcategoryIndex}. Please refresh the page and try again.`);
          return;
        }
      }
    } else {
      // For legacy video uploads (no category structure)
      if (content && content.length > 0) {
        alert('This course uses the new category structure. Please upload videos to a specific category instead.');
        return;
      }
    }

    setVideoModalContext({ categoryIndex, subcategoryIndex });
    setShowVideoModal(true);
  };

  const handleVideoUploadSuccess = (video: any) => {
    // Refresh course data to show new video
    if (id) {
      window.location.reload();
    }
  };

  // Hierarchical Content Management Functions
  const addCategory = () => {
    setContent([...content, {
      categoryName: '',
      categoryDescription: '',
      subcategories: [],
      videos: []
    }]);
  };

  const updateCategory = (categoryIndex: number, field: keyof CategoryData, value: string) => {
    const newContent = [...content];
    // @ts-ignore
    newContent[categoryIndex][field] = value;
    setContent(newContent);
  };

  const removeCategory = (categoryIndex: number) => {
    const newContent = content.filter((_, index) => index !== categoryIndex);
    setContent(newContent);
  };

  const addSubcategory = (categoryIndex: number) => {
    const newContent = [...content];
    newContent[categoryIndex].subcategories.push({
      subcategoryName: '',
      subcategoryDescription: '',
      videos: []
    });
    setContent(newContent);
  };

  const updateSubcategory = (categoryIndex: number, subcategoryIndex: number, field: keyof SubcategoryData, value: string) => {
    const newContent = [...content];
    // @ts-ignore
    newContent[categoryIndex].subcategories[subcategoryIndex][field] = value;
    setContent(newContent);
  };

  const removeSubcategory = (categoryIndex: number, subcategoryIndex: number) => {
    const newContent = [...content];
    newContent[categoryIndex].subcategories = newContent[categoryIndex].subcategories.filter((_, index) => index !== subcategoryIndex);
    setContent(newContent);
  };

  const addVideoToCategory = (categoryIndex: number) => {
    const newContent = [...content];
    newContent[categoryIndex].videos.push({
      title: '',
      description: '',
      isFree: false,
      videoFile: null
    });
    setContent(newContent);
  };

  const addVideoToSubcategory = (categoryIndex: number, subcategoryIndex: number) => {
    const newContent = [...content];
    newContent[categoryIndex].subcategories[subcategoryIndex].videos.push({
      title: '',
      description: '',
      isFree: false,
      videoFile: null
    });
    setContent(newContent);
  };

  const updateCategoryVideo = (categoryIndex: number, videoIndex: number, field: keyof VideoData, value: string | boolean | File | null) => {
    const newContent = [...content];
    // @ts-ignore
    newContent[categoryIndex].videos[videoIndex][field] = value;
    setContent(newContent);
  };

  const updateSubcategoryVideo = (categoryIndex: number, subcategoryIndex: number, videoIndex: number, field: keyof VideoData, value: string | boolean | File | null) => {
    const newContent = [...content];
    // @ts-ignore
    newContent[categoryIndex].subcategories[subcategoryIndex].videos[videoIndex][field] = value;
    setContent(newContent);
  };

  const removeCategoryVideo = (categoryIndex: number, videoIndex: number) => {
    const newContent = [...content];
    newContent[categoryIndex].videos = newContent[categoryIndex].videos.filter((_, index) => index !== videoIndex);
    setContent(newContent);
  };

  const removeSubcategoryVideo = (categoryIndex: number, subcategoryIndex: number, videoIndex: number) => {
    const newContent = [...content];
    newContent[categoryIndex].subcategories[subcategoryIndex].videos =
      newContent[categoryIndex].subcategories[subcategoryIndex].videos.filter((_, index) => index !== videoIndex);
    setContent(newContent);
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center my-8">{id ? 'Edit Course' : 'Create New Course'}</h1>

      {/* Tab Navigation */}
      <div className="bg-white shadow-lg rounded-lg mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('basic')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'basic'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Basic Information
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'content'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Course Content Structure
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'basic' && (
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
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled={uploadingVideo}>
                  {id ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'content' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Course Content Structure</h2>
                <button
                  onClick={addCategory}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  + Add Category
                </button>
              </div>

              {content.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <div className="mb-4">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg mb-2">No categories added yet</p>
                  <p className="text-gray-400 text-sm mb-6">Categories help organize your course content and are required for video uploads.</p>
                  <div className="space-x-4">
                    <button
                      onClick={addCategory}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                    >
                      Create First Category
                    </button>
                    <button
                      onClick={() => {
                        // Create a default "General" category
                        setContent([{
                          categoryName: 'General',
                          categoryDescription: 'General course content',
                          subcategories: [],
                          videos: []
                        }]);
                      }}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                    >
                      Create Default Category
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {content.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="border border-gray-300 rounded-lg overflow-hidden">
                      {/* Category Header */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-800 flex items-center">
                            <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                              {categoryIndex + 1}
                            </span>
                            Category {categoryIndex + 1}
                          </h3>
                          <button
                            onClick={() => removeCategory(categoryIndex)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                          >
                            Remove Category
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Category Name</label>
                            <input
                              type="text"
                              value={category.categoryName}
                              onChange={(e) => updateCategory(categoryIndex, 'categoryName', e.target.value)}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="e.g., General Studies, Himachal GK"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Category Description</label>
                            <input
                              type="text"
                              value={category.categoryDescription}
                              onChange={(e) => updateCategory(categoryIndex, 'categoryDescription', e.target.value)}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="Brief description of this category"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Category Content */}
                      <div className="p-4">
                        {/* Subcategories Section */}
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-md font-semibold text-gray-700">Subcategories</h4>
                            <button
                              onClick={() => addSubcategory(categoryIndex)}
                              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded text-sm"
                            >
                              + Add Subcategory
                            </button>
                          </div>

                          {category.subcategories.map((subcategory, subcategoryIndex) => (
                            <div key={subcategoryIndex} className="border border-gray-200 rounded-lg p-4 mb-4 ml-4">
                              <div className="flex justify-between items-center mb-3">
                                <h5 className="font-medium text-gray-600 flex items-center">
                                  <span className="text-purple-600 mr-2">👉</span>
                                  Subcategory {subcategoryIndex + 1}
                                </h5>
                                <button
                                  onClick={() => removeSubcategory(categoryIndex, subcategoryIndex)}
                                  className="bg-red-400 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-xs"
                                >
                                  Remove
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                <div>
                                  <label className="block text-gray-600 text-sm font-bold mb-1">Subcategory Name</label>
                                  <input
                                    type="text"
                                    value={subcategory.subcategoryName}
                                    onChange={(e) => updateSubcategory(categoryIndex, subcategoryIndex, 'subcategoryName', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="e.g., History, Geography"
                                  />
                                </div>
                                <div>
                                  <label className="block text-gray-600 text-sm font-bold mb-1">Subcategory Description</label>
                                  <input
                                    type="text"
                                    value={subcategory.subcategoryDescription}
                                    onChange={(e) => updateSubcategory(categoryIndex, subcategoryIndex, 'subcategoryDescription', e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Brief description"
                                  />
                                </div>
                              </div>

                              {/* Videos in Subcategory */}
                              <div className="ml-4">
                                <div className="flex justify-between items-center mb-2">
                                  <h6 className="text-sm font-medium text-gray-600">Videos in this Subcategory</h6>
                                  <div className="flex space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setVideoModalContext({ categoryIndex, subcategoryIndex });
                                        setShowYouTubeModal(true);
                                      }}
                                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                                    >
                                      + YouTube Video
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => openVideoModal(categoryIndex, subcategoryIndex)}
                                      className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-1 px-2 rounded text-xs"
                                    >
                                      + Upload File
                                    </button>
                                  </div>
                                </div>

                                {subcategory.videos.map((video, videoIndex) => (
                                  <div key={videoIndex} className="border border-gray-100 rounded p-3 mb-2 bg-gray-50">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="text-xs font-medium text-gray-500">Video {videoIndex + 1}</span>
                                      <button
                                        onClick={() => removeSubcategoryVideo(categoryIndex, subcategoryIndex, videoIndex)}
                                        className="bg-red-300 hover:bg-red-500 text-white font-bold py-1 px-2 rounded text-xs"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                                      <input
                                        type="text"
                                        value={video.title}
                                        onChange={(e) => updateSubcategoryVideo(categoryIndex, subcategoryIndex, videoIndex, 'title', e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Video title"
                                      />
                                      <input
                                        type="text"
                                        value={video.description}
                                        onChange={(e) => updateSubcategoryVideo(categoryIndex, subcategoryIndex, videoIndex, 'description', e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                        placeholder="Video description"
                                      />
                                    </div>
                                    <div className="flex items-center space-x-4">
                                      <label className="inline-flex items-center">
                                        <input
                                          type="checkbox"
                                          checked={video.isFree}
                                          onChange={(e) => updateSubcategoryVideo(categoryIndex, subcategoryIndex, videoIndex, 'isFree', e.target.checked)}
                                          className="form-checkbox h-4 w-4 text-blue-600"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Free Sample</span>
                                      </label>
                                      <input
                                        type="file"
                                        onChange={(e) => updateSubcategoryVideo(categoryIndex, subcategoryIndex, videoIndex, 'videoFile', e.target.files ? e.target.files[0] : null)}
                                        className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Direct Videos in Category */}
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-md font-semibold text-gray-700">Direct Videos (No Subcategory)</h4>
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setVideoModalContext({ categoryIndex });
                                  setShowYouTubeModal(true);
                                }}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                              >
                                + YouTube Video
                              </button>
                              <button
                                type="button"
                                onClick={() => openVideoModal(categoryIndex)}
                                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-1 px-3 rounded text-sm"
                              >
                                + Upload File
                              </button>
                            </div>
                          </div>
                        </div>

                        {category.videos.map((video, videoIndex) => (
                          <div key={videoIndex} className="border border-gray-200 rounded p-3 mb-3 bg-orange-50">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-600">Direct Video {videoIndex + 1}</span>
                              <button
                                onClick={() => removeCategoryVideo(categoryIndex, videoIndex)}
                                className="bg-red-400 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-xs"
                              >
                                Remove
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                              <input
                                type="text"
                                value={video.title}
                                onChange={(e) => updateCategoryVideo(categoryIndex, videoIndex, 'title', e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Video title"
                              />
                              <input
                                type="text"
                                value={video.description}
                                onChange={(e) => updateCategoryVideo(categoryIndex, videoIndex, 'description', e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Video description"
                              />
                            </div>
                            <div className="flex items-center space-x-4">
                              <label className="inline-flex items-center">
                                <input
                                  type="checkbox"
                                  checked={video.isFree}
                                  onChange={(e) => updateCategoryVideo(categoryIndex, videoIndex, 'isFree', e.target.checked)}
                                  className="form-checkbox h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2 text-sm text-gray-700">Free Sample</span>
                              </label>
                              <input
                                type="file"
                                onChange={(e) => updateCategoryVideo(categoryIndex, videoIndex, 'videoFile', e.target.files ? e.target.files[0] : null)}
                                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end mt-6 space-x-4">
                <button type="button" onClick={() => navigate('/admin/courses')} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Cancel
                </button>
                <button onClick={submitHandler} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" disabled={uploadingVideo}>
                  {id ? 'Update Course Structure' : 'Save Course Structure'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Upload Modal */}
      <VideoUploadModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        courseId={id || ''}
        categoryIndex={videoModalContext.categoryIndex}
        subcategoryIndex={videoModalContext.subcategoryIndex}
        onUploadSuccess={handleVideoUploadSuccess}
      />

      <YouTubeVideoModal
        isOpen={showYouTubeModal}
        onClose={() => setShowYouTubeModal(false)}
        courseId={id || ''}
        categoryIndex={videoModalContext.categoryIndex}
        subcategoryIndex={videoModalContext.subcategoryIndex}
        onUploadSuccess={handleVideoUploadSuccess}
      />
    </div>
  );
};

export default AdminCourseEditPage;

