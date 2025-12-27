import React from 'react';
import { Helmet } from 'react-helmet';
import {
    CheckCircle,
    Clock,
    Users,
    BookOpen,
    Award,
    Target,
    Star,
    Phone,
    MessageCircle,
    ChevronDown,
    Play,
    Download,
    Globe,
    Calendar
} from 'lucide-react';

interface CourseData {
    courseName: string;
    exams: string[];
    location: string;
    duration: string;
    mode: string[];
    language: string[];
    price: string;
    features: string[];
    syllabus: string[];
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string[];
}

interface CourseTemplateProps {
    data: CourseData;
}

const CourseTemplate: React.FC<CourseTemplateProps> = ({ data }) => {
    const [openSyllabus, setOpenSyllabus] = React.useState<number | null>(null);

    const toggleSyllabus = (index: number) => {
        setOpenSyllabus(openSyllabus === index ? null : index);
    };

    return (
        <>
            <Helmet>
                <title>{data.seoTitle}</title>
                <meta name="description" content={data.seoDescription} />
                <meta name="keywords" content={data.seoKeywords.join(', ')} />
                <meta property="og:title" content={data.seoTitle} />
                <meta property="og:description" content={data.seoDescription} />
                <meta property="og:type" content="website" />
                <link rel="canonical" href={window.location.href} />
            </Helmet>

            <div className="min-h-screen bg-slate-50">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-4xl md:text-6xl font-bold font-['Poppins'] mb-6 leading-tight">
                                {data.courseName} Coaching in {data.location} – Career Pathway
                            </h1>
                            <p className="text-xl md:text-2xl text-blue-100 mb-8 font-['Inter']">
                                Transform your career with expert guidance and proven results
                            </p>
                            <div className="flex flex-wrap gap-3 justify-center mb-10">
                                {data.exams.slice(0, 4).map((exam, index) => (
                                    <span
                                        key={index}
                                        className="bg-yellow-500 text-slate-900 px-4 py-2 rounded-full font-semibold text-sm"
                                    >
                                        {exam}
                                    </span>
                                ))}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-8 py-4 rounded-lg font-bold text-lg transition-colors duration-300 flex items-center justify-center gap-2">
                                    <Target className="w-5 h-5" />
                                    Enroll Now
                                </button>
                                <button className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-slate-900 px-8 py-4 rounded-lg font-bold text-lg transition-colors duration-300 flex items-center justify-center gap-2">
                                    <Play className="w-5 h-5" />
                                    Free Demo
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Course Overview */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] text-slate-800 mb-8 text-center">
                                Course Overview
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-slate-50 p-8 rounded-xl">
                                    <h3 className="text-xl font-bold font-['Poppins'] text-slate-800 mb-4 flex items-center gap-2">
                                        <Users className="w-6 h-6 text-blue-800" />
                                        Who Should Join
                                    </h3>
                                    <ul className="space-y-3 text-slate-600 font-['Inter']">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            Graduates seeking government jobs
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            Working professionals planning career change
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            Students preparing for competitive exams
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-slate-50 p-8 rounded-xl">
                                    <h3 className="text-xl font-bold font-['Poppins'] text-slate-800 mb-4 flex items-center gap-2">
                                        <Award className="w-6 h-6 text-yellow-600" />
                                        Outcome After Completion
                                    </h3>
                                    <ul className="space-y-3 text-slate-600 font-['Inter']">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            Complete exam preparation
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            Confidence to crack any exam
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            Guaranteed job placement support
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Exams Covered */}
                <section className="py-16 bg-slate-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] text-slate-800 mb-12 text-center">
                                Exams Covered
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {data.exams.map((exam, index) => (
                                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                        <span className="font-semibold text-slate-800 font-['Inter'] text-sm">{exam}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Course Features */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] text-slate-800 mb-12 text-center">
                                Course Features
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {data.features.map((feature, index) => {
                                    const icons = [BookOpen, Users, Clock, Award, Target, Star];
                                    const Icon = icons[index % icons.length];
                                    return (
                                        <div key={index} className="bg-gradient-to-br from-blue-50 to-slate-50 p-6 rounded-xl border border-blue-100 hover:shadow-lg transition-shadow duration-300">
                                            <div className="bg-blue-800 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="text-lg font-bold font-['Poppins'] text-slate-800 mb-2">
                                                {feature}
                                            </h3>
                                            <p className="text-slate-600 font-['Inter'] text-sm">
                                                Premium quality content designed for your success
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Syllabus Breakdown */}
                <section className="py-16 bg-slate-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] text-slate-800 mb-12 text-center">
                                Syllabus & Structure
                            </h2>
                            <div className="space-y-4">
                                {data.syllabus.map((topic, index) => (
                                    <div key={index} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                                        <button
                                            onClick={() => toggleSyllabus(index)}
                                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
                                        >
                                            <span className="font-semibold text-slate-800 font-['Inter']">{topic}</span>
                                            <ChevronDown
                                                className={`w-5 h-5 text-slate-600 transition-transform duration-200 ${openSyllabus === index ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </button>
                                        {openSyllabus === index && (
                                            <div className="px-6 pb-4 text-slate-600 font-['Inter']">
                                                <p>Comprehensive coverage of {topic.toLowerCase()} with practical examples, mock tests, and expert guidance.</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Course Structure */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] text-slate-800 mb-12 text-center">
                                Course Structure
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="text-center p-6 bg-slate-50 rounded-xl">
                                    <Clock className="w-8 h-8 text-blue-800 mx-auto mb-3" />
                                    <h3 className="font-bold font-['Poppins'] text-slate-800 mb-2">Duration</h3>
                                    <p className="text-slate-600 font-['Inter']">{data.duration}</p>
                                </div>
                                <div className="text-center p-6 bg-slate-50 rounded-xl">
                                    <Globe className="w-8 h-8 text-blue-800 mx-auto mb-3" />
                                    <h3 className="font-bold font-['Poppins'] text-slate-800 mb-2">Mode</h3>
                                    <p className="text-slate-600 font-['Inter']">{data.mode.join(' / ')}</p>
                                </div>
                                <div className="text-center p-6 bg-slate-50 rounded-xl">
                                    <MessageCircle className="w-8 h-8 text-blue-800 mx-auto mb-3" />
                                    <h3 className="font-bold font-['Poppins'] text-slate-800 mb-2">Language</h3>
                                    <p className="text-slate-600 font-['Inter']">{data.language.join(' / ')}</p>
                                </div>
                                <div className="text-center p-6 bg-slate-50 rounded-xl">
                                    <Download className="w-8 h-8 text-blue-800 mx-auto mb-3" />
                                    <h3 className="font-bold font-['Poppins'] text-slate-800 mb-2">Material</h3>
                                    <p className="text-slate-600 font-['Inter']">Digital + Print</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Fees & Demo CTA */}
                <section className="py-16 bg-gradient-to-r from-yellow-500 to-yellow-400">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] text-slate-900 mb-6">
                                Fees & Free Demo
                            </h2>
                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 mb-8">
                                <div className="text-5xl font-bold font-['Poppins'] text-slate-900 mb-2">
                                    {data.price}
                                </div>
                                <p className="text-slate-800 font-['Inter'] text-lg mb-6">
                                    Complete course with lifetime support
                                </p>
                                <div className="bg-slate-900 text-white px-6 py-3 rounded-full inline-block font-bold text-lg mb-6">
                                    🎁 FREE DEMO CLASS AVAILABLE
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors duration-300 flex items-center justify-center gap-2">
                                    <Play className="w-5 h-5" />
                                    Book Free Demo
                                </button>
                                <button className="border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors duration-300 flex items-center justify-center gap-2">
                                    <Target className="w-5 h-5" />
                                    Enroll Now
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Career Pathway */}
                <section className="py-16 bg-slate-900 text-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold font-['Poppins'] mb-12 text-center">
                                Why Choose Career Pathway
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <div className="text-center">
                                    <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Award className="w-8 h-8 text-slate-900" />
                                    </div>
                                    <h3 className="text-xl font-bold font-['Poppins'] mb-3">15+ Years Experience</h3>
                                    <p className="text-blue-100 font-['Inter']">Proven track record in competitive exam coaching</p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Star className="w-8 h-8 text-slate-900" />
                                    </div>
                                    <h3 className="text-xl font-bold font-['Poppins'] mb-3">5000+ Success Stories</h3>
                                    <p className="text-blue-100 font-['Inter']">Students placed in top government positions</p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Users className="w-8 h-8 text-slate-900" />
                                    </div>
                                    <h3 className="text-xl font-bold font-['Poppins'] mb-3">Expert Faculty</h3>
                                    <p className="text-blue-100 font-['Inter']">IAS/IPS officers and subject matter experts</p>
                                </div>
                                <div className="text-center">
                                    <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Target className="w-8 h-8 text-slate-900" />
                                    </div>
                                    <h3 className="text-xl font-bold font-['Poppins'] mb-3">Complete Test Series</h3>
                                    <p className="text-blue-100 font-['Inter']">Regular mock tests and performance analysis</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final Call to Action */}
                <section className="py-16 bg-gradient-to-br from-blue-800 via-slate-800 to-blue-900 text-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl md:text-5xl font-bold font-['Poppins'] mb-6">
                                Your Success Journey Starts Here
                            </h2>
                            <p className="text-xl text-blue-100 font-['Inter'] mb-8">
                                Don't let another opportunity slip away. Join thousands of successful candidates who trusted Career Pathway for their government job preparation.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                                <a
                                    href="tel:+919876543210"
                                    className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 px-8 py-4 rounded-lg font-bold text-lg transition-colors duration-300 flex items-center justify-center gap-2"
                                >
                                    <Phone className="w-5 h-5" />
                                    Call Now: +91 98765 43210
                                </a>
                                <a
                                    href="https://wa.me/919876543210"
                                    className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors duration-300 flex items-center justify-center gap-2"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    WhatsApp Now
                                </a>
                            </div>
                            <p className="text-blue-200 font-['Inter']">
                                Limited seats available. Secure your spot today!
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default CourseTemplate;