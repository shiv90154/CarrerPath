import React from 'react';
import { Link } from 'react-router-dom';
import {
    GraduationCap,
    Shield,
    Users,
    FileText,
    Calculator,
    Banknote,
    Target,
    BookOpen,
    School,
    UserCheck,
    MapPin,
    Laptop,
    ArrowRight,
    Star
} from 'lucide-react';

interface CourseCard {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    link: string;
    exams: string[];
    duration: string;
    price: string;
    popular?: boolean;
}

const CourseLandingSection: React.FC = () => {
    const courses: CourseCard[] = [
        {
            title: "IAS Coaching",
            subtitle: "UPSC Civil Services",
            icon: <GraduationCap className="w-8 h-8" />,
            link: "/courses/ias",
            exams: ["UPSC Prelims", "UPSC Mains", "Interview"],
            duration: "12-18 Months",
            price: "₹75,000",
            popular: true
        },
        {
            title: "HAS / HPAS",
            subtitle: "HP Administrative Service",
            icon: <Shield className="w-8 h-8" />,
            link: "/courses/has-hpas",
            exams: ["HAS Prelims", "HAS Mains", "Interview"],
            duration: "10-12 Months",
            price: "₹45,000",
            popular: true
        },
        {
            title: "Allied Services",
            subtitle: "IFS, IPS, IRS & More",
            icon: <Users className="w-8 h-8" />,
            link: "/courses/allied-services",
            exams: ["IFS", "IPS", "IRS", "Central Services"],
            duration: "12-15 Months",
            price: "₹65,000"
        },
        {
            title: "Naib Tehsildar",
            subtitle: "HP Revenue Department",
            icon: <FileText className="w-8 h-8" />,
            link: "/courses/naib-tehsildar",
            exams: ["Revenue Exam", "Land Records", "Court Procedures"],
            duration: "6-8 Months",
            price: "₹25,000"
        },
        {
            title: "SSC Exams",
            subtitle: "CGL, CHSL, GD, MTS",
            icon: <Calculator className="w-8 h-8" />,
            link: "/courses/ssc",
            exams: ["SSC CGL", "SSC CHSL", "SSC GD", "SSC MTS"],
            duration: "8-10 Months",
            price: "₹35,000"
        },
        {
            title: "Banking",
            subtitle: "PO / Clerk Preparation",
            icon: <Banknote className="w-8 h-8" />,
            link: "/courses/banking",
            exams: ["IBPS PO", "IBPS Clerk", "SBI PO", "SBI Clerk"],
            duration: "6-9 Months",
            price: "₹30,000"
        },
        {
            title: "CDS",
            subtitle: "Combined Defence Services",
            icon: <Target className="w-8 h-8" />,
            link: "/courses/cds",
            exams: ["IMA", "INA", "AFA", "OTA"],
            duration: "8-10 Months",
            price: "₹40,000"
        },
        {
            title: "UGC NET / SET",
            subtitle: "Assistant Professor Eligibility",
            icon: <BookOpen className="w-8 h-8" />,
            link: "/courses/ugc-net-set",
            exams: ["UGC NET", "SET", "JRF", "PhD Entrance"],
            duration: "6-8 Months",
            price: "₹28,000"
        },
        {
            title: "TET / CTET",
            subtitle: "Teacher Eligibility Test",
            icon: <School className="w-8 h-8" />,
            link: "/courses/tet-ctet",
            exams: ["CTET", "HP-TET", "Primary Teacher"],
            duration: "4-6 Months",
            price: "₹20,000"
        },
        {
            title: "TGT / PGT / JBT",
            subtitle: "Teacher Recruitment",
            icon: <UserCheck className="w-8 h-8" />,
            link: "/courses/tgt-pgt-jbt",
            exams: ["TGT", "PGT", "JBT", "KVS", "NVS"],
            duration: "6-8 Months",
            price: "₹32,000"
        },
        {
            title: "Patwari / Police",
            subtitle: "HP Government Jobs",
            icon: <MapPin className="w-8 h-8" />,
            link: "/courses/patwari-police",
            exams: ["HP Patwari", "Police Constable", "Forest Guard"],
            duration: "4-6 Months",
            price: "₹18,000"
        },
        {
            title: "JOA IT / State",
            subtitle: "Computer Operator & Clerk",
            icon: <Laptop className="w-8 h-8" />,
            link: "/courses/joa-it-state",
            exams: ["JOA IT", "Data Entry", "Computer Operator"],
            duration: "3-5 Months",
            price: "₹15,000"
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        <Star className="w-4 h-4" />
                        Premium Course Collection
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold font-['Poppins'] text-slate-900 mb-6">
                        Explore Our <span className="text-yellow-600">Specialized Courses</span>
                    </h2>
                    <p className="text-xl text-slate-600 font-['Inter'] max-w-3xl mx-auto leading-relaxed">
                        Comprehensive coaching programs designed for every government exam.
                        Choose your path to success with expert guidance and proven results.
                    </p>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {courses.map((course, index) => (
                        <Link
                            key={index}
                            to={course.link}
                            className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200 hover:border-yellow-300"
                        >
                            {/* Popular Badge */}
                            {course.popular && (
                                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-slate-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                    🔥 Popular
                                </div>
                            )}

                            {/* Icon */}
                            <div className="bg-gradient-to-br from-blue-800 to-slate-800 text-white w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                {course.icon}
                            </div>

                            {/* Content */}
                            <div className="mb-4">
                                <h3 className="text-xl font-bold font-['Poppins'] text-slate-900 mb-2 group-hover:text-blue-800 transition-colors">
                                    {course.title}
                                </h3>
                                <p className="text-slate-600 font-['Inter'] text-sm mb-3">
                                    {course.subtitle}
                                </p>

                                {/* Exams */}
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {course.exams.slice(0, 2).map((exam, examIndex) => (
                                        <span
                                            key={examIndex}
                                            className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium"
                                        >
                                            {exam}
                                        </span>
                                    ))}
                                    {course.exams.length > 2 && (
                                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                                            +{course.exams.length - 2} more
                                        </span>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="space-y-2 text-sm text-slate-600 font-['Inter']">
                                    <div className="flex items-center justify-between">
                                        <span>Duration:</span>
                                        <span className="font-semibold">{course.duration}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Starting at:</span>
                                        <span className="font-bold text-yellow-600 text-lg">{course.price}</span>
                                    </div>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <span className="text-blue-800 font-semibold text-sm group-hover:text-yellow-600 transition-colors">
                                    View Details
                                </span>
                                <ArrowRight className="w-4 h-4 text-blue-800 group-hover:text-yellow-600 group-hover:translate-x-1 transition-all duration-300" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-16">
                    <div className="bg-gradient-to-r from-blue-800 via-slate-800 to-blue-800 rounded-2xl p-8 text-white">
                        <h3 className="text-2xl md:text-3xl font-bold font-['Poppins'] mb-4">
                            Can't Find Your Course?
                        </h3>
                        <p className="text-blue-100 font-['Inter'] mb-6 max-w-2xl mx-auto">
                            We offer personalized coaching for various other government exams.
                            Contact us to discuss your specific requirements.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/contact"
                                className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-8 py-3 rounded-lg font-bold transition-colors duration-300 flex items-center justify-center gap-2"
                            >
                                <Users className="w-5 h-5" />
                                Contact Us
                            </Link>
                            <a
                                href="tel:+919876543210"
                                className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-slate-900 px-8 py-3 rounded-lg font-bold transition-colors duration-300 flex items-center justify-center gap-2"
                            >
                                <Target className="w-5 h-5" />
                                Call Now
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CourseLandingSection;