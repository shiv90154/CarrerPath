import React from 'react';
import CourseTemplate from './CourseTemplate';

const SSCCoursePage: React.FC = () => {
    const courseData = {
        courseName: "SSC (CGL, CHSL, GD, MTS)",
        exams: [
            "SSC Combined Graduate Level (CGL)",
            "SSC Combined Higher Secondary Level (CHSL)",
            "SSC General Duty (GD) Constable",
            "SSC Multi Tasking Staff (MTS)",
            "SSC Stenographer",
            "SSC Junior Engineer (JE)"
        ],
        location: "Shimla",
        duration: "8-10 Months",
        mode: ["Online", "Offline", "Hybrid"],
        language: ["Hindi", "English"],
        price: "₹35,000",
        features: [
            "Tier-wise Preparation Strategy",
            "Speed & Accuracy Training",
            "Computer-Based Test Practice",
            "Descriptive Paper Guidance",
            "Time Management Techniques",
            "Regular Mock Tests"
        ],
        syllabus: [
            "Quantitative Aptitude & Mathematics",
            "General Intelligence & Reasoning",
            "General Awareness & Current Affairs",
            "English Language & Comprehension",
            "Computer Knowledge (for CHSL)",
            "Descriptive Paper (Essay & Letter)",
            "Typing Skills (for Stenographer)",
            "Physical Standards (for GD)"
        ],
        seoTitle: "Best SSC Coaching in Shimla - CGL CHSL GD MTS Preparation | Career Pathway",
        seoDescription: "Top SSC coaching institute in Shimla for CGL, CHSL, GD, MTS exams. Expert faculty, tier-wise preparation, computer-based test practice. Join Career Pathway now!",
        seoKeywords: [
            "SSC coaching Shimla",
            "SSC CGL coaching Shimla",
            "SSC CHSL coaching Shimla",
            "SSC GD coaching Shimla",
            "SSC MTS coaching Shimla",
            "Career Pathway Shimla",
            "best SSC coaching",
            "central government jobs"
        ]
    };

    return <CourseTemplate data={courseData} />;
};

export default SSCCoursePage;