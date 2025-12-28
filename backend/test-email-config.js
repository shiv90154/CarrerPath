const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

// Load environment variables
dotenv.config();

console.log('🔧 Testing Email Configuration...\n');

// Check environment variables
console.log('📧 Environment Variables:');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing');
console.log('CONTACT_EMAIL:', process.env.CONTACT_EMAIL ? '✅ Set' : '❌ Missing');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL ? '✅ Set' : '❌ Missing');

// Test transporter creation
try {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    console.log('\n✅ Email transporter created successfully!');

    // Verify connection (this will test the credentials)
    transporter.verify((error, success) => {
        if (error) {
            console.log('❌ Email connection failed:', error.message);
            if (error.message.includes('Invalid login')) {
                console.log('\n🔧 Troubleshooting:');
                console.log('1. Make sure 2-factor authentication is enabled on Gmail');
                console.log('2. Generate an App Password from Google Account settings');
                console.log('3. Use the App Password (not your regular password) in EMAIL_PASS');
            }
        } else {
            console.log('✅ Email connection verified successfully!');
            console.log('\n🎉 Email system is ready to send emails!');

            console.log('\n📧 Available Email Templates:');
            console.log('- Welcome Email');
            console.log('- New Course Notification');
            console.log('- New Test Series Notification');
            console.log('- Payment Confirmation');
            console.log('- Test Completion Notification');
            console.log('- Course Completion Certificate');
            console.log('- Password Reset Email');
            console.log('- Admin New User Notification');
            console.log('- Bulk Announcements');

            console.log('\n🚀 Next Steps:');
            console.log('1. Start your server: npm run dev');
            console.log('2. Register a new user to test welcome email');
            console.log('3. Create a course to test course notifications');
            console.log('4. Use admin email endpoints for manual testing');
        }
        process.exit(0);
    });

} catch (error) {
    console.log('❌ Failed to create email transporter:', error.message);
    process.exit(1);
}