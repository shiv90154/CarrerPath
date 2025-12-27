import React from 'react';
import CourseTemplate from './CourseTemplate';

const CDSCoursePage: React.FC = () => {
    const courseData = {
        courseName: "CDS",
        exams: [
            "Combined Defence Services (CDS)",
            "Indian Military Academy (IMA)",
            "Indian Naval Academy (INA)",
            "Air Force Academy (AFA)",
            "Officers Training Academy (OTA)",
            "Short Service Commission"
        ],
        location: "Shimla",
        duration: "8-10 Months",
        mode: ["Online", "Offline", "Hybrid"],
        language: ["Hindi", "English"],
        price: "₹40,000",
        features: [
            "Defence-Specific Curriculum",
            "Physical Fitness Guidance",
            "Service Selection Board (SSB)",
            "Personality Development",
            "Leadership Training",
            "Military Knowledge"
        ],
        syllabus: [
            "Mathematics for Defence Services",
            "General Knowledge - Defence Focus",
            "English Language & Grammar",
            "Current Affairs - National Security",
            "Elementary Mathematics",
            "Physics & Chemistry Basics",
            "SSB Interview Preparation",
            "Physical & Medical Standards"
        ],
        seoTitle: "Best CDS Coaching in Shimla - Combined Defence Services Preparation | Career Pathway",
        seoDescription: "Top CDS coaching institute in Shimla for Combined Defence Services exam. Defence-focused training, SSB preparation, physical fitness guidance. Join Career Pathway!",
        seoKeywords: [
            "CDS coaching Shimla",
            "Combined Defence Services coaching",
            "IMA coaching Shimla",
            "INA coaching Shimla",
            "AFA coaching Shimla",
            "Career Pathway Shimla",
            "best CDS coaching",
            "defence services preparation"
        ]
    };

    return <CourseTemplate data={courseData} />;
};

export default CDSCoursePage;