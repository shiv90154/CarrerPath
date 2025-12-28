const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin user already exists
        const existingAdmin = await User.findOne({ email: 'admin@example.com' });
        if (existingAdmin) {
            console.log('❌ Admin user already exists with email: admin@example.com');
            console.log('   Name:', existingAdmin.name);
            console.log('   Role:', existingAdmin.role);
            console.log('   Active:', existingAdmin.isActive !== false);

            // Update to admin role if not already
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('✅ Updated user role to admin');
            }

            process.exit(0);
        }

        // Create admin user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            phone: '9999999999',
            password: hashedPassword,
            role: 'admin',
            isActive: true,
            emailVerified: true,
            phoneVerified: true
        });

        await adminUser.save();
        console.log('✅ Admin user created successfully!');
        console.log('   Email: admin@example.com');
        console.log('   Password: admin123');
        console.log('   Role: admin');
        console.log('');
        console.log('🔑 You can now login with these credentials to access user management.');

    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
    } finally {
        mongoose.connection.close();
    }
};

const createTestUsers = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Create some test users
        const testUsers = [
            {
                name: 'John Student',
                email: 'student1@example.com',
                phone: '9876543210',
                role: 'student'
            },
            {
                name: 'Jane Student',
                email: 'student2@example.com',
                phone: '9876543211',
                role: 'student'
            },
            {
                name: 'Bob Instructor',
                email: 'instructor1@example.com',
                phone: '9876543212',
                role: 'instructor'
            }
        ];

        const salt = await bcrypt.genSalt(10);

        for (const userData of testUsers) {
            const existingUser = await User.findOne({ email: userData.email });
            if (!existingUser) {
                const hashedPassword = await bcrypt.hash('password123', salt);

                const user = new User({
                    ...userData,
                    password: hashedPassword,
                    isActive: true,
                    emailVerified: true
                });

                await user.save();
                console.log(`✅ Created test user: ${userData.name} (${userData.role})`);
            } else {
                console.log(`⚠️  User already exists: ${userData.email}`);
            }
        }

        console.log('✅ Test users creation completed!');

    } catch (error) {
        console.error('❌ Error creating test users:', error.message);
    } finally {
        mongoose.connection.close();
    }
};

const showUserStats = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const totalUsers = await User.countDocuments();
        const adminUsers = await User.countDocuments({ role: 'admin' });
        const studentUsers = await User.countDocuments({ role: 'student' });
        const instructorUsers = await User.countDocuments({ role: 'instructor' });
        const activeUsers = await User.countDocuments({ isActive: { $ne: false } });

        console.log('📊 User Statistics:');
        console.log(`   Total Users: ${totalUsers}`);
        console.log(`   Admins: ${adminUsers}`);
        console.log(`   Students: ${studentUsers}`);
        console.log(`   Instructors: ${instructorUsers}`);
        console.log(`   Active Users: ${activeUsers}`);

        if (totalUsers > 0) {
            console.log('\n👥 Sample Users:');
            const sampleUsers = await User.find().select('name email role isActive').limit(5);
            sampleUsers.forEach(user => {
                console.log(`   ${user.name} (${user.email}) - ${user.role} - ${user.isActive !== false ? 'Active' : 'Inactive'}`);
            });
        }

    } catch (error) {
        console.error('❌ Error fetching user stats:', error.message);
    } finally {
        mongoose.connection.close();
    }
};

// Main function
const main = async () => {
    const action = process.argv[2];

    switch (action) {
        case 'create-admin':
            await createAdminUser();
            break;
        case 'create-test-users':
            await createTestUsers();
            break;
        case 'stats':
            await showUserStats();
            break;
        case 'all':
            await createAdminUser();
            await createTestUsers();
            await showUserStats();
            break;
        default:
            console.log('Usage:');
            console.log('  node create-admin-user.js create-admin     # Create admin user');
            console.log('  node create-admin-user.js create-test-users # Create test users');
            console.log('  node create-admin-user.js stats           # Show user statistics');
            console.log('  node create-admin-user.js all             # Do everything');
    }
};

main().catch(console.error);