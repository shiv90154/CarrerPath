import React from 'react';
import CourseTemplate from './CourseTemplate';

const PatwariPoliceCoursePage: React.FC = () => {
    const courseData = {
        courseName: "Patwari / Police Constable",
        exams: [
            "HP Patwari Recruitment",
            "HP Police Constable",
            "Village Level Worker",
            "Forest Guard",
            "HP Police Sub Inspector",
            "Revenue Department Jobs"
        ],
        location: "Shimla",
        duration: "4-6 Months",
        mode: ["Online", "Offline", "Hybrid"],
        language: ["Hindi", "English"],
        price: "₹18,000",
        features: [
            "Physical Fitness Training",
            "Local Laws & Procedures",
            "HP-Specific Knowledge",
            "Practical Field Training",
            "Interview Preparation",
            "Document Verification"
        ],
        syllabus: [
            "General Knowledge - HP Focus",
            "Mathematics & Reasoning",
            "Hindi & English Language",
            "HP History & Culture",
            "Current Affairs - State & National",
            "Basic Computer Knowledge",
            "Physical Standards & Fitness",
            "Interview & Personality Test"
        ],
        seoTitle: "Best Patwari Police Constable Coaching in Shimla - HP Government Jobs | Career Pathway",
        seoDescription: "Top Patwari and Police Constable coaching in Shimla for HP government jobs. Physical fitness training, local knowledge focus. Join Career Pathway now!",
        seoKeywords: [
            "Patwari coaching Shimla",
            "Police Constable coaching Shimla",
            "HP Patwari exam preparation",
            "HP Police recruitment",
            "Village Level Worker coaching",
            "Career Pathway Shimla",
            "best Patwari coaching",
            "HP government jobs"
        ]
    };

    return <CourseTemplate data={courseData} />;
};

export default PatwariPoliceCoursePage;