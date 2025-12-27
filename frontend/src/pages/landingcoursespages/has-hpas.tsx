import React from 'react';
import CourseTemplate from './CourseTemplate';

const HASHPASCoursePage: React.FC = () => {
    const courseData = {
        courseName: "HAS / HPAS",
        exams: [
            "Himachal Pradesh Administrative Service",
            "HAS Prelims",
            "HAS Mains",
            "HAS Interview",
            "HPAS Combined Competitive Exam",
            "HP State Services"
        ],
        location: "Shimla",
        duration: "10-12 Months",
        mode: ["Online", "Offline", "Hybrid"],
        language: ["Hindi", "English"],
        price: "₹45,000",
        features: [
            "HP State-Specific Syllabus",
            "Local Current Affairs Focus",
            "HP History & Culture",
            "State Government Schemes",
            "Regional Language Support",
            "Local Faculty Expertise"
        ],
        syllabus: [
            "General Studies - HP History, Geography, Culture",
            "Indian Polity & HP Government Structure",
            "Economics & HP State Economy",
            "General Science & Technology",
            "Current Affairs - National & HP State",
            "Hindi Language & Literature",
            "English Language & Comprehension",
            "Interview & Personality Development"
        ],
        seoTitle: "Best HAS HPAS Coaching in Shimla - Himachal Pradesh Administrative Service | Career Pathway",
        seoDescription: "Top HAS HPAS coaching in Shimla for Himachal Pradesh Administrative Service exam. Expert local faculty, HP-focused curriculum, proven success rate. Join Career Pathway now!",
        seoKeywords: [
            "HAS coaching Shimla",
            "HPAS coaching Shimla",
            "Himachal Pradesh Administrative Service",
            "HP state services coaching",
            "HAS preparation Shimla",
            "Career Pathway Shimla",
            "best HAS coaching",
            "HP government jobs"
        ]
    };

    return <CourseTemplate data={courseData} />;
};

export default HASHPASCoursePage;