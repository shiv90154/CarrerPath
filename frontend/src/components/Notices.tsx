import React, { useEffect, useRef, useState } from "react";
import { Bell, ExternalLink, Calendar, Eye, AlertCircle } from "lucide-react";
import axios from 'axios';

interface Notice {
  _id: string;
  title: string;
  description: string;
  content?: string;
  badge: "new" | "live" | "urgent" | "important" | "admission" | "exam" | "result";
  link?: string;
  category: string;
  priority: number;
  targetAudience: string;
  publishDate: string;
  expiryDate?: string;
  views: number;
  formattedPublishDate: string;
}

const Notices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/notices/published?limit=15');

      if (data.success) {
        setNotices(data.data);
      }
      setError(null);
    } catch (err: any) {
      console.error('Error fetching notices:', err);
      setError('Failed to load notices');
      // Fallback to empty array to prevent UI breaking
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee || notices.length === 0) return;

    let animationId: number;
    let position = 0;

    const animate = () => {
      position -= 0.5; // speed
      marquee.style.transform = `translateX(${position}px)`;

      if (Math.abs(position) > marquee.scrollWidth / 2) {
        position = 0;
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    marquee.addEventListener("mouseenter", () => cancelAnimationFrame(animationId));
    marquee.addEventListener("mouseleave", () => requestAnimationFrame(animate));

    return () => cancelAnimationFrame(animationId);
  }, [notices]);

  const getBadgeColor = (badge: Notice["badge"]) => {
    switch (badge) {
      case "new": return "bg-green-600";
      case "urgent": return "bg-red-600";
      case "important": return "bg-orange-600";
      case "live": return "bg-blue-600";
      case "admission": return "bg-purple-600";
      case "exam": return "bg-indigo-600";
      case "result": return "bg-yellow-600";
      default: return "bg-gray-600";
    }
  };

  const getBadgeIcon = (badge: Notice["badge"]) => {
    switch (badge) {
      case "urgent": return <AlertCircle className="w-3 h-3" />;
      case "live": return <div className="w-2 h-2 bg-white rounded-full animate-pulse" />;
      default: return null;
    }
  };

  const handleNoticeClick = async (notice: Notice) => {
    // Increment view count
    try {
      await axios.get(`http://localhost:5000/api/notices/${notice._id}`);
    } catch (err) {
      console.error('Error incrementing view count:', err);
    }

    // Navigate to link if provided
    if (notice.link) {
      if (notice.link.startsWith('http')) {
        window.open(notice.link, '_blank');
      } else {
        window.location.href = notice.link;
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  };

  if (loading) {
    return (
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-5 h-5 text-yellow-500" />
            <h2 className="text-base font-bold text-gray-800">Loading Notices...</h2>
          </div>
          <div className="animate-pulse bg-gray-200 h-16 rounded-lg"></div>
        </div>
      </section>
    );
  }

  if (error || notices.length === 0) {
    return (
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-5 h-5 text-yellow-500" />
            <h2 className="text-base font-bold text-gray-800">
              {error ? 'Notice Board' : 'No Active Notices'}
            </h2>
          </div>
          <div className="text-sm text-gray-600 py-4">
            {error ? 'Unable to load notices at the moment.' : 'No notices available currently.'}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 overflow-hidden relative">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-yellow-500" />
            <h2 className="text-base font-bold text-gray-800">
              Latest Announcements
            </h2>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
              {notices.length} Active
            </span>
          </div>

          <button
            onClick={fetchNotices}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Refresh
          </button>
        </div>

        {/* MARQUEE */}
        <div className="relative overflow-hidden">
          <div
            ref={marqueeRef}
            className="flex gap-6 whitespace-nowrap will-change-transform"
          >
            {[...notices, ...notices].map((notice, index) => (
              <div
                key={`${notice._id}-${index}`}
                onClick={() => handleNoticeClick(notice)}
                className="flex items-center gap-3 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 hover:shadow-md transition-all cursor-pointer group min-w-max"
              >
                <span
                  className={`text-xs font-bold text-white px-2 py-1 rounded-full flex items-center gap-1 ${getBadgeColor(notice.badge)}`}
                >
                  {getBadgeIcon(notice.badge)}
                  {notice.badge.toUpperCase()}
                </span>

                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-800 transition-colors">
                    {notice.title}
                  </span>
                  <span className="text-xs text-gray-600">
                    {notice.description}
                  </span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(notice.publishDate)}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {notice.views}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded capitalize">
                      {notice.category}
                    </span>
                  </div>
                </div>

                {notice.link && (
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PRIORITY INDICATOR */}
        {notices.some(n => n.priority === 3) && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              High Priority
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Notices;
