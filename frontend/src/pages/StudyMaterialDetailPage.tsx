import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';
import {
  FileText, Calendar, Download, Globe, BookOpen, User,
  CheckCircle, Lock, Tag, Award, Clock, ArrowLeft
} from 'lucide-react';

interface StudyMaterial {
  _id: string;
  title: string;
  description: string;
  year: string;
  examType: string;
  subject: string;
  type: 'Free' | 'Paid';
  price: number;
  fileUrl: string;
  coverImage: string;
  pages: number;
  language: string;
  downloads: number;
  author: { name: string };
  createdAt: string;
  access: 'full' | 'locked';
  message?: string;
}

const StudyMaterialDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [material, setMaterial] = useState<StudyMaterial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [relatedMaterials, setRelatedMaterials] = useState<StudyMaterial[]>([]);

  useEffect(() => {
    fetchMaterial();
    fetchRelatedMaterials();
  }, [id]);

  const fetchMaterial = async () => {
    try {
      setLoading(true);
      const config = user?.token ? {
        headers: { Authorization: `Bearer ${user.token}` }
      } : {};

      const { data } = await axios.get(
        `https://carrerpath-m48v.onrender.com/api/studymaterials/${id}`,
        config
      );

      setMaterial(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch material');
      setLoading(false);
    }
  };

  const fetchRelatedMaterials = async () => {
    try {
      const { data } = await axios.get(
        `https://carrerpath-m48v.onrender.com/api/studymaterials?examType=${material?.examType}&limit=3`
      );
      setRelatedMaterials(data.materials.filter((m: StudyMaterial) => m._id !== id).slice(0, 3));
    } catch (err) {
      console.error('Failed to fetch related materials:', err);
    }
  };

  const handleDownload = () => {
    if (!material || material.access !== 'full') return;

    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = material.fileUrl;
    link.download = `${material.title.replace(/\s+/g, '_')}_${material.year}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePurchase = () => {
    if (!user) {
      navigate('/login', { state: { from: `/study-materials/${id}` } });
      return;
    }
    setShowPaymentModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error: {error || 'Material not found'}</div>
          <button
            onClick={() => navigate('/study-materials')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Study Materials
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => navigate('/study-materials')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Study Materials
        </button>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Material Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${material.type === 'Free'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800'
                        }`}
                    >
                      {material.type}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {material.examType}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      {material.year}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {material.title}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    {material.subject} • {material.pages} pages
                  </p>
                </div>

                {material.type === 'Paid' && (
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">₹{material.price}</div>
                    <div className="text-sm text-gray-500">One-time payment</div>
                  </div>
                )}
              </div>

              {/* Cover Image */}
              <div className="mb-6">
                <img
                  src={material.coverImage || '/images/default-paper-cover.jpg'}
                  alt={material.title}
                  className="w-full max-w-md h-auto rounded-lg shadow"
                />
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {material.description ||
                    `This is the ${material.year} ${material.examType} question paper for ${material.subject}. 
                    The paper includes all sections and questions as per the official exam pattern.`}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-900">Subject</span>
                  </div>
                  <p className="text-gray-700">{material.subject}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-900">Year</span>
                  </div>
                  <p className="text-gray-700">{material.year}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-900">Language</span>
                  </div>
                  <p className="text-gray-700">{material.language}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-900">Pages</span>
                  </div>
                  <p className="text-gray-700">{material.pages}</p>
                </div>
              </div>

              {/* Author Info */}
              <div className="bg-blue-50 p-4 rounded-lg mb-8">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-700">Author</p>
                    <p className="font-medium text-gray-900">{material.author.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Materials */}
            {relatedMaterials.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Papers</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedMaterials.map((related) => (
                    <div
                      key={related._id}
                      className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/study-materials/${related._id}`)}
                    >
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                        {related.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{related.year}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${related.type === 'Free'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                            }`}
                        >
                          {related.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Actions */}
          <div>
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Download</h2>

                {/* Access Status */}
                <div className={`mb-6 p-4 rounded-lg ${material.access === 'full'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-amber-50 border border-amber-200'
                  }`}>
                  <div className="flex items-center gap-3 mb-2">
                    {material.access === 'full' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Lock className="w-5 h-5 text-amber-600" />
                    )}
                    <span className="font-medium">
                      {material.access === 'full' ? 'Access Granted' : 'Access Required'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {material.access === 'full'
                      ? 'You can download this paper now'
                      : material.message || 'Purchase required to download'}
                  </p>
                </div>

                {/* Action Button */}
                {material.access === 'full' ? (
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>
                ) : (
                  <button
                    onClick={handlePurchase}
                    disabled={purchasing}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {purchasing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Tag className="w-5 h-5" />
                        Purchase for ₹{material.price}
                      </>
                    )}
                  </button>
                )}

                {/* Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      {material.downloads} downloads
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Added {formatDate(material.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4">What you get</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Original question paper</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">High-quality PDF format</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Lifetime access</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Mobile compatible</span>
                  </li>
                  {material.type === 'Paid' && (
                    <>
                      <li className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <span className="text-gray-700">Detailed solutions</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <span className="text-gray-700">Answer key</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && material && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          product={{
            id: material._id,
            title: material.title,
            price: material.price,
            type: 'studyMaterial',
            image: material.coverImage,
          }}
          onSuccess={() => {
            fetchMaterial();
            setShowPaymentModal(false);
          }}
        />
      )}
    </div>
  );
};

export default StudyMaterialDetailPage;