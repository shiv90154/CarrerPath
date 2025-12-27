import React from 'react';
import CourseTemplate from './CourseTemplate';

const TGTPGTJBTCoursePage: React.FC = () => {
    const courseData = {
        courseName: "TGT / PGT / JBT",
        exams: [
            "Trained Graduate Teacher (TGT)",
            "Post Graduate Teacher (PGT)",
            "Junior Basic Teacher (JBT)",
            "HP Education Department Exam",
            "KVS Teacher Recruitment",
            "NVS Teacher Selection"
        ],
        location: "Shimla",
        duration: "6-8 Months",
        mode: ["Online", "Offline", "Hybrid"],
        language: ["Hindi", "English"],
        price: "₹32,000",
        features: [
            "Subject Mastery Training",
            "Teaching Skills Development",
            "Curriculum Understanding",
            "Classroom Techniques",
            "Educational Technology",
            "Assessment Methods"
        ],
        syllabus: [
            "Subject-Specific Knowledge",
            "Teaching Methodology & Pedagogy",
            "Educational Psychology",
            "School Management & Administration",
            "Child Development",
            "Educational Technology",
            "Assessment & Evaluation",
            "Professional Development"
        ],
        seoTitle: "Best TGT PGT JBT Coaching in Shimla - Teacher Recruitment Preparation | Career Pathway",
        seoDescription: "Premier TGT PGT JBT coaching in Shimla for teacher recruitment exams. Subject mastery, teaching skills, professional development. Join Career Pathway today!",
        seoKeywords: [
            "TGT coaching Shimla",
            "PGT coaching Shimla",
            "JBT coaching Shimla",
            "teacher recruitment exam",
            "HP education department",
            "Career Pathway Shimla",
            "best teacher coaching",
            "government teacher jobs"
        ]
    };

    return <CourseTemplate data={courseData} />;
};

export default TGTPGTJBTCoursePage;