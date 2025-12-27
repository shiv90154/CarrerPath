import React from 'react';
import CourseTemplate from './CourseTemplate';

const JOAITStateCoursePage: React.FC = () => {
    const courseData = {
        courseName: "JOA IT / State Exams",
        exams: [
            "Junior Office Assistant (JOA) IT",
            "HP State Exams",
            "Clerk Grade III",
            "Data Entry Operator",
            "Computer Operator",
            "Office Assistant"
        ],
        location: "Shimla",
        duration: "3-5 Months",
        mode: ["Online", "Offline", "Hybrid"],
        language: ["Hindi", "English"],
        price: "₹15,000",
        features: [
            "Computer Skills Training",
            "Typing Speed Development",
            "MS Office Proficiency",
            "Data Entry Practice",
            "Government Procedures",
            "Office Management"
        ],
        syllabus: [
            "Computer Fundamentals",
            "MS Office (Word, Excel, PowerPoint)",
            "Internet & Email Usage",
            "Data Entry & Typing Skills",
            "General Knowledge - HP Focus",
            "Mathematics & Reasoning",
            "Hindi & English Typing",
            "Office Procedures & Management"
        ],
        seoTitle: "Best JOA IT State Exams Coaching in Shimla - Computer Operator Preparation | Career Pathway",
        seoDescription: "Top JOA IT and State Exams coaching in Shimla for computer operator and clerk positions. Computer skills training, typing speed development. Join Career Pathway!",
        seoKeywords: [
            "JOA IT coaching Shimla",
            "State exams coaching Shimla",
            "Computer Operator coaching",
            "Data Entry Operator preparation",
            "Clerk Grade III coaching",
            "Career Pathway Shimla",
            "best JOA IT coaching",
            "HP state government jobs"
        ]
    };

    return <CourseTemplate data={courseData} />;
};

export default JOAITStateCoursePage;