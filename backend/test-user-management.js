const axios = require('axios');

// Test configuration
const BASE_URL = 'https://carrerpath-m48v.onrender.com/api';
const ADMIN_TOKEN = 'your-admin-token-here'; // Replace with actual admin token

async function testUserManagement() {
    console.log('🔍 Testing User Management API...\n');

    try {
        // 1. Test server health
        console.log('1. Testing server health...');
        try {
            const healthResponse = await axios.get(`${BASE_URL.replace('/api', '')}/health`);
            console.log('✅ Server is healthy:', healthResponse.data.status);
        } catch (error) {
            console.log('❌ Server health check failed:', error.message);
        }

        // 2. Test admin routes health
        console.log('\n2. Testing admin routes health...');
        try {
            const adminHealthResponse = await axios.get(`${BASE_URL}/admin/health`);
            console.log('✅ Admin routes are healthy:', adminHealthResponse.data.status);
        } catch (error) {
            console.log('❌ Admin routes health check failed:', error.message);
        }

        // 3. Test admin authentication (without token)
        console.log('\n3. Testing admin routes without authentication...');
        try {
            const noAuthResponse = await axios.get(`${BASE_URL}/admin/users`);
            console.log('❌ This should not work - no authentication required!');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Authentication is properly required (401 Unauthorized)');
            } else {
                console.log('❌ Unexpected error:', error.response?.status, error.message);
            }
        }

        // 4. Test with invalid token
        console.log('\n4. Testing with invalid token...');
        try {
            const invalidTokenResponse = await axios.get(`${BASE_URL}/admin/users`, {
                headers: { 'Authorization': 'Bearer invalid-token' }
            });
            console.log('❌ This should not work - invalid token accepted!');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Invalid token properly rejected (401 Unauthorized)');
            } else {
                console.log('❌ Unexpected error:', error.response?.status, error.message);
            }
        }

        // 5. Test admin test endpoint
        console.log('\n5. Testing admin test endpoint...');
        if (ADMIN_TOKEN !== 'your-admin-token-here') {
            try {
                const testResponse = await axios.get(`${BASE_URL}/admin/test`, {
                    headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
                });
                console.log('✅ Admin test endpoint working:', testResponse.data.message);
                console.log('   User:', testResponse.data.user.name, '- Role:', testResponse.data.user.role);
            } catch (error) {
                console.log('❌ Admin test endpoint failed:', error.response?.status, error.response?.data?.message || error.message);
            }
        } else {
            console.log('⚠️  Skipping authenticated tests - please provide valid admin token');
        }

        // 6. Test users endpoint
        console.log('\n6. Testing users endpoint...');
        if (ADMIN_TOKEN !== 'your-admin-token-here') {
            try {
                const usersResponse = await axios.get(`${BASE_URL}/admin/users?page=1&limit=5`, {
                    headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
                });
                console.log('✅ Users endpoint working');
                console.log(`   Found ${usersResponse.data.users.length} users`);
                console.log(`   Total users: ${usersResponse.data.total}`);
                console.log(`   Stats:`, usersResponse.data.stats);

                if (usersResponse.data.users.length > 0) {
                    console.log('   Sample user:', {
                        name: usersResponse.data.users[0].name,
                        email: usersResponse.data.users[0].email,
                        role: usersResponse.data.users[0].role
                    });
                }
            } catch (error) {
                console.log('❌ Users endpoint failed:', error.response?.status, error.response?.data?.message || error.message);
            }
        } else {
            console.log('⚠️  Skipping users test - please provide valid admin token');
        }

    } catch (error) {
        console.error('❌ Unexpected error during testing:', error.message);
    }
}

async function testFrontendIssues() {
    console.log('\n📱 Checking Frontend Issues...\n');

    console.log('Common issues that prevent users from showing:');
    console.log('1. ❌ Invalid or expired admin token');
    console.log('2. ❌ CORS issues between frontend and backend');
    console.log('3. ❌ Network connectivity problems');
    console.log('4. ❌ Backend server not responding');
    console.log('5. ❌ Database connection issues');
    console.log('6. ❌ Frontend API URL misconfiguration');
    console.log('7. ❌ Authentication context not properly set');

    console.log('\n🔧 Debugging steps:');
    console.log('1. Check browser console for errors');
    console.log('2. Verify admin token in localStorage/sessionStorage');
    console.log('3. Check network tab for failed API calls');
    console.log('4. Verify backend server is running');
    console.log('5. Test API endpoints directly');
}

async function generateTestToken() {
    console.log('\n🔑 To get a valid admin token:');
    console.log('1. Login as admin through the frontend');
    console.log('2. Open browser developer tools');
    console.log('3. Go to Application/Storage tab');
    console.log('4. Look for "user" in localStorage');
    console.log('5. Copy the "token" value');
    console.log('6. Replace ADMIN_TOKEN in this script');
}

// Main test runner
async function runAllTests() {
    console.log('🚀 User Management Debugging Tool\n');
    console.log('='.repeat(50));

    await testUserManagement();
    await testFrontendIssues();
    await generateTestToken();

    console.log('\n' + '='.repeat(50));
    console.log('✅ Testing completed!\n');
}

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = {
    testUserManagement,
    testFrontendIssues,
    runAllTests
};