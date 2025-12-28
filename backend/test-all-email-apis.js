const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const BASE_URL = 'http://localhost:5000';

// Test data
const testData = {
    adminToken: null, // We'll need to get this from login
    testUser: {
        email: 'test@example.com',
        name: 'Test User'
    },
    announcement: {
        subject: '🎉 Test Announcement from API',
        message: '<h2>This is a test announcement!</h2><p>Testing the email API system.</p>'
    },
    course: {
        title: 'Test Course API',
        description: 'This is a test course created via API',
        instructor: 'API Test Instructor'
    },
    testSeries: {
        title: 'Test Series API',
        testCount: 5,
        duration: 30
    }
};

// Helper function to make authenticated requests
const makeAuthRequest = (method, url, data = null) => {
    const config = {
        method,
        url: `${BASE_URL}${url}`,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (testData.adminToken) {
        config.headers['Authorization'] = `Bearer ${testData.adminToken}`;
    }

    if (data) {
        config.data = data;
    }

    return axios(config);
};

// Test functions
const testEmailAPIs = async () => {
    console.log('🚀 Starting Email API Tests...\n');

    try {
        // Step 1: Login as admin to get token
        console.log('1️⃣ Testing Admin Login...');

        const adminCredentials = [
            { email: 'testadmin@example.com', password: 'testadmin123' },
            { email: 'admin@example.com', password: 'admin123' },
            { email: 'admin@institute.com', password: 'admin123' },
            { email: 'admin@institute.com', password: 'password123' },
            { email: 'admin@example.com', password: 'password123' }
        ];

        for (const creds of adminCredentials) {
            try {
                console.log(`   Trying ${creds.email}...`);
                const loginResponse = await axios.post(`${BASE_URL}/api/users/login`, creds);

                if (loginResponse.data.token) {
                    testData.adminToken = loginResponse.data.token;
                    console.log(`✅ Admin login successful with ${creds.email}`);
                    break;
                }
            } catch (error) {
                console.log(`   ❌ Failed with ${creds.email}: ${error.response?.data?.message || error.message}`);
            }
        }

        if (!testData.adminToken) {
            console.log('⚠️ All admin login attempts failed, continuing with public endpoints only');
        }

        console.log('\n📧 Testing Email API Endpoints...\n');

        // Test 2: Email Stats (Admin only)
        if (testData.adminToken) {
            console.log('2️⃣ Testing GET /api/email/stats');
            try {
                const response = await makeAuthRequest('GET', '/api/email/stats');
                console.log('✅ Email stats retrieved successfully');
                console.log('   Stats:', response.data.stats);
            } catch (error) {
                console.log('❌ Email stats failed');
                console.log('   Error:', error.response?.data?.message || error.message);
            }
        }

        // Test 3: Test Email Configuration (Admin only)
        if (testData.adminToken) {
            console.log('\n3️⃣ Testing POST /api/email/test');
            try {
                const response = await makeAuthRequest('POST', '/api/email/test', {});
                console.log('✅ Test email sent successfully');
                console.log('   Response:', response.data.message);
            } catch (error) {
                console.log('❌ Test email failed');
                console.log('   Error:', error.response?.data?.message || error.message);
            }
        }

        // Test 4: Send Welcome Email (Admin only)
        if (testData.adminToken) {
            console.log('\n4️⃣ Testing POST /api/email/welcome');
            try {
                const response = await makeAuthRequest('POST', '/api/email/welcome', testData.testUser);
                console.log('✅ Welcome email sent successfully');
                console.log('   Response:', response.data.message);
            } catch (error) {
                console.log('❌ Welcome email failed');
                console.log('   Error:', error.response?.data?.message || error.message);
            }
        }

        // Test 5: Send Announcement (Admin only)
        if (testData.adminToken) {
            console.log('\n5️⃣ Testing POST /api/email/announcement');
            try {
                const response = await makeAuthRequest('POST', '/api/email/announcement', testData.announcement);
                console.log('✅ Announcement sent successfully');
                console.log('   Response:', response.data.message);
                console.log('   Users notified:', response.data.notifiedUsers);
            } catch (error) {
                console.log('❌ Announcement failed');
                console.log('   Error:', error.response?.data?.message || error.message);
            }
        }

        // Test 6: Send Course Notification (Admin only)
        if (testData.adminToken) {
            console.log('\n6️⃣ Testing POST /api/email/new-course');
            try {
                const response = await makeAuthRequest('POST', '/api/email/new-course', testData.course);
                console.log('✅ Course notification sent successfully');
                console.log('   Response:', response.data.message);
                console.log('   Users notified:', response.data.notifiedUsers);
            } catch (error) {
                console.log('❌ Course notification failed');
                console.log('   Error:', error.response?.data?.message || error.message);
            }
        }

        // Test 7: Send Test Series Notification (Admin only)
        if (testData.adminToken) {
            console.log('\n7️⃣ Testing POST /api/email/new-test-series');
            try {
                const response = await makeAuthRequest('POST', '/api/email/new-test-series', testData.testSeries);
                console.log('✅ Test series notification sent successfully');
                console.log('   Response:', response.data.message);
                console.log('   Users notified:', response.data.notifiedUsers);
            } catch (error) {
                console.log('❌ Test series notification failed');
                console.log('   Error:', error.response?.data?.message || error.message);
            }
        }

        // Test 8: Password Reset Email (Public)
        console.log('\n8️⃣ Testing POST /api/email/password-reset');
        try {
            const response = await axios.post(`${BASE_URL}/api/email/password-reset`, {
                email: 'test@example.com'
            });
            console.log('✅ Password reset email sent successfully');
            console.log('   Response:', response.data.message);
        } catch (error) {
            console.log('❌ Password reset email failed');
            console.log('   Error:', error.response?.data?.message || error.message);
        }

        // Test 9: Test Email Service Functions Directly
        console.log('\n9️⃣ Testing Email Service Functions Directly...');
        try {
            const emailService = require('./utils/emailService');

            // Test welcome email
            console.log('   Testing welcome email service...');
            const welcomeResult = await emailService.sendWelcomeEmail('test@example.com', 'API Test User');
            console.log('   Welcome email result:', welcomeResult.success ? '✅ Success' : '❌ Failed');

            // Test payment confirmation
            console.log('   Testing payment confirmation service...');
            const paymentResult = await emailService.sendPaymentConfirmation(
                'test@example.com',
                'API Test User',
                2999,
                'Test Course',
                'test_payment_123'
            );
            console.log('   Payment confirmation result:', paymentResult.success ? '✅ Success' : '❌ Failed');

        } catch (error) {
            console.log('❌ Direct email service test failed');
            console.log('   Error:', error.message);
        }

        console.log('\n📊 API Test Summary:');
        console.log('====================');

        if (!testData.adminToken) {
            console.log('⚠️  Admin authentication failed - some tests were skipped');
            console.log('💡 To test admin endpoints:');
            console.log('   1. Create an admin user first');
            console.log('   2. Update the login credentials in this script');
            console.log('   3. Run the test again');
        } else {
            console.log('✅ All admin endpoints tested');
        }

        console.log('✅ Public endpoints tested');
        console.log('✅ Direct email service functions tested');

        console.log('\n🎯 Next Steps:');
        console.log('- Check your email inbox for test emails');
        console.log('- Verify email templates are rendering correctly');
        console.log('- Test the frontend admin panel');
        console.log('- Monitor email delivery rates');

    } catch (error) {
        console.error('💥 Unexpected error during API testing:', error.message);
    }
};

// Run the tests
testEmailAPIs();