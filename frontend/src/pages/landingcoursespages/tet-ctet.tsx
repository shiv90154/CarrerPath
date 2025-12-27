import React from 'react';
import CourseTemplate from './CourseTemplate';

const TETCTETCoursePage: React.FC = () => {
    const courseData = {
        courseName: "TET / CTET",
        exams: [
            "Central Teacher Eligibility Test (CTET)",
            "Himachal Pradesh TET (HP-TET)",
            "State Teacher Eligibility Test",
            "Primary Teacher Recruitment",
            "Upper Primary Teacher Exam",
            "Teaching Job Preparation"
        ],
        location: "Shimla",
        duration: "4-6 Months",
        mode: ["Online", "Offline", "Hybrid"],
        language: ["Hindi", "English"],
        price: "₹20,000",
        features: [
            "Child Development Focus",
            "Teaching Methodology",
            "Subject Knowledge",
            "Classroom Management",
            "Educational Psychology",
            "Practical Teaching Skills"
        ],
        syllabus: [
            "Child Development & Pedagogy",
            "Language I (Hindi/English)",
            "Language II (English/Hindi)",
            "Mathematics & Pedagogy",
            "Environmental Studies",
            "Science & Social Studies",
            "Teaching Methodology",
            "Educational Psychology"
        ],
        seoTitle: "Best TET CTET Coaching in Shimla - Teacher Eligibility Test Preparation | Career Pathway",
        seoDescription: "Top TET CTET coaching in Shimla for teacher eligibility tests. Child development focus, teaching methodology, practical skills. Join Career Pathway for teaching success!",
        seoKeywords: [
            "TET coaching Shimla",
            "CTET coaching Shimla",
            "HP TET coaching Shimla",
            "teacher eligibility test",
            "teaching job preparation",
            "Career Pathway Shimla",
            "best TET coaching",
            "primary teacher exam"
        ]
    };

    return <CourseTemplate data={courseData} />;
};

export default TETCTETCoursePage;