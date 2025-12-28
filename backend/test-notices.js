const mongoose = require('mongoose');
const Notice = require('./models/Notice');
const User = require('./models/User');
require('dotenv').config();

const testNotices = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check if notices exist
        const totalNotices = await Notice.countDocuments();
        console.log(`📊 Total notices in database: ${totalNotices}`);

        if (totalNotices === 0) {
            console.log('⚠️  No notices found. Creating sample notices...');
            await createSampleNotices();
        } else {
            console.log('📋 Existing notices:');
            const notices = await Notice.find().populate('author', 'name email').limit(5);
            notices.forEach((notice, index) => {
                console.log(`${index + 1}. ${notice.title} - ${notice.isPublished ? 'Published' : 'Draft'} - ${notice.category}`);
            });
        }

        // Test the API endpoints
        console.log('\n🔍 Testing Notice API endpoints...');

        // Check published notices
        const publishedNotices = await Notice.find({ isPublished: true, isActive: true });
        console.log(`✅ Published notices: ${publishedNotices.length}`);

        // Check stats
        const stats = {
            total: await Notice.countDocuments(),
            published: await Notice.countDocuments({ isPublished: true }),
            active: await Notice.countDocuments({ isActive: true }),
            expired: await Notice.countDocuments({ expiryDate: { $lt: new Date() } })
        };
        console.log('📈 Notice Statistics:', stats);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        mongoose.connection.close();
    }
};

const createSampleNotices = async () => {
    try {
        // Find an admin user to be the author
        let adminUser = await User.findOne({ role: 'admin' });

        if (!adminUser) {
            console.log('⚠️  No admin user found. Creating one...');
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            adminUser = new User({
                name: 'Admin User',
                email: 'admin@notices.com',
                phone: '9999999999',
                password: hashedPassword,
                role: 'admin',
                isActive: true,
                emailVerified: true
            });
            await adminUser.save();
            console.log('✅ Admin user created for notices');
        }

        const sampleNotices = [
            {
                title: 'Welcome to Our Institute',
                description: 'We are excited to welcome all new students to our institute.',
                content: 'This is a detailed welcome message for all new students joining our institute. We hope you have a great learning experience.',
                badge: 'new',
                category: 'general',
                priority: 2,
                targetAudience: 'students',
                isPublished: true,
                isActive: true,
                author: adminUser._id,
                updatedBy: adminUser._id
            },
            {
                title: 'Exam Schedule Released',
                description: 'The examination schedule for this semester has been released.',
                content: 'Please check the detailed examination schedule on our website. Make sure to prepare accordingly.',
                badge: 'important',
                category: 'exam',
                priority: 3,
                targetAudience: 'students',
                isPublished: true,
                isActive: true,
                author: adminUser._id,
                updatedBy: adminUser._id
            },
            {
                title: 'Holiday Notice',
                description: 'Institute will remain closed on account of national holiday.',
                content: 'The institute will be closed tomorrow due to national holiday. Regular classes will resume the day after.',
                badge: 'urgent',
                category: 'holiday',
                priority: 2,
                targetAudience: 'all',
                isPublished: true,
                isActive: true,
                author: adminUser._id,
                updatedBy: adminUser._id
            },
            {
                title: 'New Course Launch',
                description: 'We are launching a new advanced course in Data Science.',
                content: 'Join our new Data Science course starting next month. Limited seats available.',
                badge: 'new',
                category: 'course',
                priority: 2,
                targetAudience: 'students',
                isPublished: false, // Draft notice
                isActive: true,
                author: adminUser._id,
                updatedBy: adminUser._id
            },
            {
                title: 'Scholarship Opportunity',
                description: 'Merit-based scholarships available for eligible students.',
                content: 'Apply for our merit-based scholarship program. Deadline is next Friday.',
                badge: 'important',
                category: 'scholarship',
                priority: 3,
                targetAudience: 'students',
                isPublished: true,
                isActive: true,
                expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                author: adminUser._id,
                updatedBy: adminUser._id
            }
        ];

        for (const noticeData of sampleNotices) {
            const existingNotice = await Notice.findOne({ title: noticeData.title });
            if (!existingNotice) {
                const notice = new Notice(noticeData);
                await notice.save();
                console.log(`✅ Created notice: ${noticeData.title}`);
            } else {
                console.log(`⚠️  Notice already exists: ${noticeData.title}`);
            }
        }

        console.log('✅ Sample notices creation completed!');

    } catch (error) {
        console.error('❌ Error creating sample notices:', error.message);
    }
};

// Run the test
testNotices().catch(console.error);