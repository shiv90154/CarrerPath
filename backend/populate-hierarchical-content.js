const mongoose = require('mongoose');
const Course = require('./models/Course');
const Video = require('./models/Video');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function populateHierarchicalContent() {
    try {
        console.log('Starting hierarchical content population...');

        // Example: Create a Patwari course with hierarchical structure
        const patwariCourse = await Course.findOne({ title: /patwari/i });

        if (!patwariCourse) {
            console.log('Creating sample Patwari course...');

            // Create sample videos first
            const videos = await Video.insertMany([
                {
                    title: 'Ancient History - Indus Valley Civilization',
                    description: 'Comprehensive coverage of Indus Valley Civilization',
                    videoUrl: 'https://example.com/video1.mp4',
                    duration: '45 min',
                    isFree: true,
                    order: 1
                },
                {
                    title: 'Medieval History - Mughal Empire',
                    description: 'Detailed study of Mughal Empire',
                    videoUrl: 'https://example.com/video2.mp4',
                    duration: '50 min',
                    isFree: false,
                    order: 2
                },
                {
                    title: 'Physical Geography - Mountains and Plateaus',
                    description: 'Study of Indian physical features',
                    videoUrl: 'https://example.com/video3.mp4',
                    duration: '40 min',
                    isFree: false,
                    order: 3
                },
                {
                    title: 'Himachal Geography - Rivers and Valleys',
                    description: 'Himachal Pradesh geographical features',
                    videoUrl: 'https://example.com/video4.mp4',
                    duration: '35 min',
                    isFree: true,
                    order: 4
                },
                {
                    title: 'English Grammar - Tenses',
                    description: 'Complete guide to English tenses',
                    videoUrl: 'https://example.com/video5.mp4',
                    duration: '30 min',
                    isFree: false,
                    order: 5
                },
                {
                    title: 'Basic Mathematics - Algebra',
                    description: 'Fundamental concepts of algebra',
                    videoUrl: 'https://example.com/video6.mp4',
                    duration: '55 min',
                    isFree: false,
                    order: 6
                }
            ]);

            // Create course with hierarchical content structure
            const newCourse = new Course({
                title: 'Patwari Exam Complete Course',
                description: 'Complete preparation course for Patwari examination',
                fullDescription: 'Comprehensive course covering all subjects required for Patwari exam preparation including General Studies, Himachal GK, English, Mathematics, and more.',
                price: 2999,
                originalPrice: 4999,
                image: '/images/patwari-course.jpg',
                category: 'State PSC',
                level: 'Intermediate',
                duration: '6 months',
                language: 'Hindi',
                instructor: new mongoose.Types.ObjectId(), // Replace with actual instructor ID

                // Hierarchical content structure
                content: [
                    {
                        categoryName: 'General Studies',
                        categoryDescription: 'Comprehensive coverage of Indian History, Geography, Polity, Economy and General Science',
                        subcategories: [
                            {
                                subcategoryName: 'History',
                                subcategoryDescription: 'Ancient, Medieval and Modern Indian History',
                                videos: [videos[0]._id, videos[1]._id] // Ancient and Medieval history videos
                            },
                            {
                                subcategoryName: 'Geography',
                                subcategoryDescription: 'Physical and Human Geography of India',
                                videos: [videos[2]._id] // Physical Geography video
                            },
                            {
                                subcategoryName: 'Indian Polity',
                                subcategoryDescription: 'Constitution, Government structure and Political system',
                                videos: [] // Add polity video IDs here
                            },
                            {
                                subcategoryName: 'Indian Economy',
                                subcategoryDescription: 'Economic concepts and current economic scenario',
                                videos: [] // Add economy video IDs here
                            },
                            {
                                subcategoryName: 'General Science',
                                subcategoryDescription: 'Physics, Chemistry, Biology basics',
                                videos: [] // Add science video IDs here
                            }
                        ],
                        videos: [] // No direct videos in this category
                    },
                    {
                        categoryName: 'Himachal GK',
                        categoryDescription: 'Complete knowledge of Himachal Pradesh',
                        subcategories: [
                            {
                                subcategoryName: 'Geography',
                                subcategoryDescription: 'Physical features, climate, rivers of HP',
                                videos: [videos[3]._id] // Himachal Geography video
                            },
                            {
                                subcategoryName: 'History',
                                subcategoryDescription: 'Historical background of Himachal Pradesh',
                                videos: [] // Add HP history video IDs here
                            },
                            {
                                subcategoryName: 'Polity',
                                subcategoryDescription: 'Government structure and administration of HP',
                                videos: [] // Add HP polity video IDs here
                            },
                            {
                                subcategoryName: 'Culture',
                                subcategoryDescription: 'Art, culture, festivals of Himachal Pradesh',
                                videos: [] // Add culture video IDs here
                            },
                            {
                                subcategoryName: 'Miscellaneous',
                                subcategoryDescription: 'Important facts and current affairs of HP',
                                videos: [] // Add miscellaneous video IDs here
                            }
                        ],
                        videos: [] // No direct videos in this category
                    },
                    {
                        categoryName: 'English',
                        categoryDescription: 'English language skills for competitive exams',
                        subcategories: [], // No subcategories for English
                        videos: [videos[4]._id] // Direct videos in English category
                    },
                    {
                        categoryName: 'Hindi',
                        categoryDescription: 'Hindi language and literature',
                        subcategories: [], // No subcategories for Hindi
                        videos: [] // Add Hindi video IDs here
                    },
                    {
                        categoryName: 'Current Affairs',
                        categoryDescription: 'Latest current affairs and general awareness',
                        subcategories: [], // No subcategories for Current Affairs
                        videos: [] // Add current affairs video IDs here
                    },
                    {
                        categoryName: 'Mathematics',
                        categoryDescription: 'Mathematical concepts and problem solving',
                        subcategories: [], // No subcategories for Mathematics
                        videos: [videos[5]._id] // Direct videos in Mathematics category
                    },
                    {
                        categoryName: 'Reasoning',
                        categoryDescription: 'Logical and analytical reasoning',
                        subcategories: [], // No subcategories for Reasoning
                        videos: [] // Add reasoning video IDs here
                    },
                    {
                        categoryName: 'Computer',
                        categoryDescription: 'Basic computer knowledge and applications',
                        subcategories: [], // No subcategories for Computer
                        videos: [] // Add computer video IDs here
                    }
                ],

                // Legacy videos array for backward compatibility
                videos: videos.map(v => v._id),
                totalVideos: videos.length,
                totalDuration: '4 hours 35 minutes'
            });

            await newCourse.save();
            console.log('✅ Sample Patwari course created with hierarchical structure!');
        } else {
            console.log('Patwari course already exists. Updating with hierarchical structure...');

            // Update existing course with hierarchical content
            // You can modify this section based on your existing data
            console.log('⚠️  Please manually update existing course with hierarchical content structure');
        }

        console.log('✅ Hierarchical content population completed!');

    } catch (error) {
        console.error('❌ Error populating hierarchical content:', error);
    } finally {
        mongoose.connection.close();
    }
}

// Run the script
populateHierarchicalContent();