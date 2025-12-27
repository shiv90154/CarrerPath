import React from 'react';
import CourseTemplate from './CourseTemplate';

const AlliedServicesCoursePage: React.FC = () => {
    const courseData = {
        courseName: "Allied Services",
        exams: [
            "Indian Foreign Service (IFS)",
            "Indian Police Service (IPS)",
            "Indian Revenue Service (IRS)",
            "Indian Audit & Accounts Service",
            "Indian Postal Service",
            "Central Armed Police Forces"
        ],
        location: "Shimla",
        duration: "12-15 Months",
        mode: ["Online", "Offline", "Hybrid"],
        language: ["Hindi", "English"],
        price: "₹65,000",
        features: [
            "Service-Specific Training",
            "Specialized Subject Coverage",
            "Professional Skill Development",
            "Service Rules & Regulations",
            "Practical Training Modules",
            "Career Guidance Sessions"
        ],
        syllabus: [
            "General Studies for Allied Services",
            "Service-Specific Subjects",
            "Professional Knowledge Areas",
            "Administrative Law & Procedures",
            "Public Administration Concepts",
            "Ethics in Public Service",
            "Communication & Leadership Skills",
            "Interview & Group Discussion"
        ],
        seoTitle: "Best Allied Services Coaching in Shimla - IFS IPS IRS Preparation | Career Pathway",
        seoDescription: "Premier Allied Services coaching in Shimla for IFS, IPS, IRS and other central services. Expert faculty, comprehensive curriculum, proven track record. Join Career Pathway!",
        seoKeywords: [
            "Allied Services coaching Shimla",
            "IFS coaching Shimla",
            "IPS coaching Shimla",
            "IRS coaching Shimla",
            "central services preparation",
            "Career Pathway Shimla",
            "best allied services coaching",
            "government services exam"
        ]
    };

    return <CourseTemplate data={courseData} />;
};

export default AlliedServicesCoursePage;