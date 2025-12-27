import React from 'react';
import CourseTemplate from './CourseTemplate';

const BankingCoursePage: React.FC = () => {
    const courseData = {
        courseName: "Banking (PO / Clerk)",
        exams: [
            "IBPS PO (Probationary Officer)",
            "IBPS Clerk",
            "SBI PO",
            "SBI Clerk",
            "RBI Grade B Officer",
            "NABARD Grade A & B"
        ],
        location: "Shimla",
        duration: "6-9 Months",
        mode: ["Online", "Offline", "Hybrid"],
        language: ["Hindi", "English"],
        price: "₹30,000",
        features: [
            "Banking Awareness Focus",
            "Financial Knowledge",
            "Computer Aptitude",
            "Interview Preparation",
            "Group Discussion Training",
            "Current Banking Trends"
        ],
        syllabus: [
            "Quantitative Aptitude for Banking",
            "Reasoning Ability & Puzzles",
            "English Language for Banking",
            "General Awareness - Banking Focus",
            "Computer Knowledge & Aptitude",
            "Financial Awareness",
            "Banking Regulations & Policies",
            "Interview & Group Discussion"
        ],
        seoTitle: "Best Banking Coaching in Shimla - IBPS PO Clerk SBI Preparation | Career Pathway",
        seoDescription: "Premier Banking coaching in Shimla for IBPS PO, Clerk, SBI exams. Banking-focused curriculum, expert faculty, interview training. Join Career Pathway for banking success!",
        seoKeywords: [
            "Banking coaching Shimla",
            "IBPS PO coaching Shimla",
            "IBPS Clerk coaching Shimla",
            "SBI PO coaching Shimla",
            "SBI Clerk coaching Shimla",
            "Career Pathway Shimla",
            "best banking coaching",
            "bank job preparation"
        ]
    };

    return <CourseTemplate data={courseData} />;
};

export default BankingCoursePage;