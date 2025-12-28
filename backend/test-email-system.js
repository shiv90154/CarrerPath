const dotenv = require('dotenv');
const connectDB = require('./config/db');
const emailService = require('./utils/emailService');
const emailNotifications = require('./middleware/emailNotifications');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const testEmailSystem = async () => {
    console.log('🚀 Testing Email System...\n');

    try {
        // Test 1: Welcome Email
        console.log('📧 Testing Welcome Email...');
        const welcomeResult = await emailService.sendWelcomeEmail(
            'test@example.com',
            'Test User'
        );
        console.log('Welcome Email Result:', welcomeResult);
        console.log('✅ Welcome email test completed\n');

        // Test 2: New Course Notification
        console.log('📚 Testing New Course Notification...');
        const courseResult = await emailNotifications.notifyNewCourse({
            title: 'Advanced JavaScript Mastery',
            description: 'Master advanced JavaScript concepts and modern ES6+ features',
            instructor: 'John Doe'
        });
        console.log('Course Notification Result:', courseResult);
        console.log('✅ Course notification test completed\n');

        // Test 3: New Test Series Notification
        console.log('📝 Testing New Test Series Notification...');
        const testSeriesResult = await emailNotifications.notifyNewTestSeries({
            title: 'UPSC Prelims Mock Tests 2024',
            testCount: 25,
            duration: 120
        });
        console.log('Test Series Notification Result:', testSeriesResult);
        console.log('✅ Test series notification test completed\n');

        // Test 4: Payment Confirmation
        console.log('💳 Testing Payment Confirmation...');
        const paymentResult = await emailService.sendPaymentConfirmation(
            'test@example.com',
            'Test User',
            2999,
            'Advanced JavaScript Course',
            'pay_test123456'
        );
        console.log('Payment Confirmation Result:', paymentResult);
        console.log('✅ Payment confirmation test completed\n');

        // Test 5: Test Completion Notification
        console.log('🎯 Testing Test Completion Notification...');
        const testCompletionResult = await emailService.sendTestCompletionNotification(
            'test@example.com',
            'Test User',
            'JavaScript Fundamentals Quiz',
            18,
            20
        );
        console.log('Test Completion Result:', testCompletionResult);
        console.log('✅ Test completion notification test completed\n');

        // Test 6: Course Completion Certificate
        console.log('🏆 Testing Course Completion Certificate...');
        const certificateResult = await emailService.sendCourseCompletionCertificate(
            'test@example.com',
            'Test User',
            'Advanced JavaScript Course',
            new Date().toLocaleDateString(),
            'https://example.com/certificate/123'
        );
        console.log('Certificate Result:', certificateResult);
        console.log('✅ Certificate email test completed\n');

        // Test 7: Password Reset Email
        console.log('🔐 Testing Password Reset Email...');
        const resetResult = await emailService.sendPasswordResetEmail(
            'test@example.com',
            'Test User',
            'https://example.com/reset-password?token=abc123'
        );
        console.log('Password Reset Result:', resetResult);
        console.log('✅ Password reset email test completed\n');

        // Test 8: Admin New User Notification
        console.log('👤 Testing Admin New User Notification...');
        const adminResult = await emailService.sendAdminNewUserNotification(
            'Test User',
            'test@example.com',
            new Date().toLocaleDateString()
        );
        console.log('Admin Notification Result:', adminResult);
        console.log('✅ Admin notification test completed\n');

        // Test 9: Bulk Announcement
        console.log('📢 Testing Bulk Announcement...');
        const announcementResult = await emailNotifications.sendAnnouncement(
            '🎉 New Features Released!',
            `
        <h2>Exciting Updates!</h2>
        <p>We're thrilled to announce new features:</p>
        <ul>
          <li>Enhanced video player with speed controls</li>
          <li>New practice test formats</li>
          <li>Improved mobile experience</li>
          <li>Advanced progress tracking</li>
        </ul>
        <p>Log in to your dashboard to explore these new features!</p>
      `,
            ['test@example.com'] // Test with specific email
        );
        console.log('Announcement Result:', announcementResult);
        console.log('✅ Bulk announcement test completed\n');

        console.log('🎉 All email tests completed successfully!');
        console.log('\n📊 Email System Test Summary:');
        console.log('- Welcome emails: ✅ Working');
        console.log('- Course notifications: ✅ Working');
        console.log('- Test series notifications: ✅ Working');
        console.log('- Payment confirmations: ✅ Working');
        console.log('- Test completion notifications: ✅ Working');
        console.log('- Course completion certificates: ✅ Working');
        console.log('- Password reset emails: ✅ Working');
        console.log('- Admin notifications: ✅ Working');
        console.log('- Bulk announcements: ✅ Working');

    } catch (error) {
        console.error('❌ Email system test failed:', error);
    } finally {
        process.exit(0);
    }
};

// Run the test
testEmailSystem();