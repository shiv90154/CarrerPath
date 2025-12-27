import React from 'react';
import CourseTemplate from './CourseTemplate';

const UGCNETSETCoursePage: React.FC = () => {
    const courseData = {
        courseName: "UGC NET / SET",
        exams: [
            "UGC National Eligibility Test (NET)",
            "State Eligibility Test (SET)",
            "Junior Research Fellowship (JRF)",
            "Assistant Professor Eligibility",
            "PhD Entrance Preparation",
            "Research Methodology"
        ],
        location: "Shimla",
        duration: "6-8 Months",
        mode: ["Online", "Offline", "Hybrid"],
        language: ["Hindi", "English"],
        price: "₹28,000",
        features: [
            "Subject-Specific Training",
            "Research Methodology Focus",
            "Paper Pattern Analysis",
            "Academic Writing Skills",
            "Teaching Aptitude",
            "Higher Education System"
        ],
        syllabus: [
            "Teaching Aptitude & Pedagogy",
            "Research Aptitude & Methodology",
            "Reading Comprehension",
            "Communication & ICT",
            "Logical Reasoning & Data Interpretation",
            "People & Environment",
            "Higher Education System in India",
            "Subject-Specific Paper (Choose from 81 subjects)"
        ],
        seoTitle: "Best UGC NET SET Coaching in Shimla - Assistant Professor Eligibility | Career Pathway",
        seoDescription: "Top UGC NET SET coaching in Shimla for Assistant Professor eligibility and JRF. Subject-specific training, research methodology focus. Join Career Pathway now!",
        seoKeywords: [
            "UGC NET coaching Shimla",
            "SET coaching Shimla",
            "JRF coaching Shimla",
            "Assistant Professor preparation",
            "PhD entrance coaching",
            "Career Pathway Shimla",
            "best UGC NET coaching",
            "higher education jobs"
        ]
    };

    return <CourseTemplate data={courseData} />;
};

export default UGCNETSETCoursePage;