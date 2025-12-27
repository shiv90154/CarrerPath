import React from 'react';
import CourseTemplate from './CourseTemplate';

const NaibTehsildarCoursePage: React.FC = () => {
    const courseData = {
        courseName: "Naib Tehsildar",
        exams: [
            "HP Naib Tehsildar Exam",
            "Revenue Department Exam",
            "Land Records Officer",
            "Tehsildar Recruitment",
            "Revenue Inspector",
            "Patwari Promotion Exam"
        ],
        location: "Shimla",
        duration: "6-8 Months",
        mode: ["Online", "Offline", "Hybrid"],
        language: ["Hindi", "English"],
        price: "₹25,000",
        features: [
            "Revenue Laws & Procedures",
            "Land Records Management",
            "HP Revenue Manual",
            "Court Procedures",
            "Administrative Skills",
            "Practical Case Studies"
        ],
        syllabus: [
            "HP Land Revenue Act & Rules",
            "Revenue Manual & Procedures",
            "Land Records & Documentation",
            "Survey & Settlement",
            "Court Procedures & Evidence Act",
            "General Knowledge - HP Focus",
            "Mathematics & Reasoning",
            "Hindi & English Language"
        ],
        seoTitle: "Best Naib Tehsildar Coaching in Shimla - HP Revenue Department Exam | Career Pathway",
        seoDescription: "Top Naib Tehsildar coaching in Shimla for HP Revenue Department exam. Expert faculty, revenue law focus, practical training. Join Career Pathway for guaranteed success!",
        seoKeywords: [
            "Naib Tehsildar coaching Shimla",
            "HP Revenue Department exam",
            "Tehsildar coaching Shimla",
            "Revenue Inspector coaching",
            "Land Records Officer preparation",
            "Career Pathway Shimla",
            "best Naib Tehsildar coaching",
            "HP government jobs"
        ]
    };

    return <CourseTemplate data={courseData} />;
};

export default NaibTehsildarCoursePage;