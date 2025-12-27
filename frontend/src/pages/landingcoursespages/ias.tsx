import React from 'react';
import CourseTemplate from './CourseTemplate';

const IASCoursePage: React.FC = () => {
    const courseData = {
        courseName: "IAS",
        exams: [
            "UPSC Civil Services",
            "IAS Prelims",
            "IAS Mains",
            "IAS Interview",
            "State PCS",
            "Administrative Services"
        ],
        location: "Shimla",
        duration: "12-18 Months",
        mode: ["Online", "Offline", "Hybrid"],
        language: ["Hindi", "English"],
        price: "₹75,000",
        features: [
            "Comprehensive UPSC Syllabus Coverage",
            "Daily Current Affairs Updates",
            "Answer Writing Practice",
            "Mock Interview Sessions",
            "Personality Development",
            "One-on-One Mentorship"
        ],
        syllabus: [
            "General Studies Paper I - History, Geography, Polity",
            "General Studies Paper II - Governance, Constitution, Social Justice",
            "General Studies Paper III - Technology, Economy, Environment",
            "General Studies Paper IV - Ethics, Integrity, Aptitude",
            "Optional Subject (Choose from 48 subjects)",
            "Essay Writing Techniques",
            "CSAT - Comprehension & Logical Reasoning",
            "Interview & Personality Test Preparation"
        ],
        seoTitle: "Best IAS Coaching in Shimla - UPSC Civil Services Preparation | Career Pathway",
        seoDescription: "Top IAS coaching institute in Shimla offering comprehensive UPSC Civil Services preparation. Expert faculty, proven results, mock tests & interview guidance. Join Career Pathway today!",
        seoKeywords: [
            "IAS coaching Shimla",
            "UPSC preparation Shimla",
            "Civil Services coaching",
            "IAS institute Shimla",
            "UPSC coaching center",
            "Career Pathway Shimla",
            "best IAS coaching",
            "government job preparation"
        ]
    };

    return <CourseTemplate data={courseData} />;
};

export default IASCoursePage;