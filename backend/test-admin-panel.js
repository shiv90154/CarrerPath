const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000/api';

// Test admin credentials (you'll need to replace with actual admin token)
const testAdminPanel = async () => {
    console.log('🧪 Admin Panel API Tests\n');

    try {
        // First, let's try to login as admin to get a token
        console.log('1️⃣ Testing Admin Login...');

        const loginResponse = await axios.post(`${BASE_URL}/users/login`, {
            email: 'admin@test.com',
            password: 'admin123'
        });

        if (loginResponse.data.token) {
            console.log('✅ Admin login successful');
            const token = loginResponse.data.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            // Test Test Series Admin API
            console.log('\n2️⃣ Testing Test Series Admin API...');
            try {
                const testSeriesResponse = await axios.get(`${BASE_URL}/testseries/admin`, config);
                console.log(`✅ Test Series API working - Found ${testSeriesResponse.data.length} test series`);
            } catch (error) {
                console.log(`❌ Test Series API error: ${error.response?.data?.message || error.message}`);
            }

            // Test Ebooks Admin API
            console.log('\n3️⃣ Testing Ebooks Admin API...');
            try {
                const ebooksResponse = await axios.get(`${BASE_URL}/ebooks/admin`, config);
                console.log(`✅ Ebooks API working - Found ${ebooksResponse.data.length} ebooks`);
            } catch (error) {
                console.log(`❌ Ebooks API error: ${error.response?.data?.message || error.message}`);
            }

            // Test Notices Admin API
            console.log('\n4️⃣ Testing Notices Admin API...');
            try {
                const noticesResponse = await axios.get(`${BASE_URL}/notices/admin/all`, config);
                console.log(`✅ Notices API working - Found ${noticesResponse.data.data?.length || 0} notices`);
            } catch (error) {
                console.log(`❌ Notices API error: ${error.response?.data?.message || error.message}`);
            }

            // Test Notice Stats API
            console.log('\n5️⃣ Testing Notice Stats API...');
            try {
                const statsResponse = await axios.get(`${BASE_URL}/notices/admin/stats`, config);
                console.log(`✅ Notice Stats API working`);
                console.log(`   Total: ${statsResponse.data.stats?.total || 0}`);
                console.log(`   Published: ${statsResponse.data.stats?.published || 0}`);
            } catch (error) {
                console.log(`❌ Notice Stats API error: ${error.response?.data?.message || error.message}`);
            }

        } else {
            console.log('❌ Admin login failed - no token received');
        }

    } catch (loginError) {
        console.log(`❌ Admin login failed: ${loginError.response?.data?.message || loginError.message}`);

        // Try to test without authentication to see what errors we get
        console.log('\n🔍 Testing APIs without authentication...');

        try {
            await axios.get(`${BASE_URL}/testseries/admin`);
        } catch (error) {
            console.log(`❌ Test Series (no auth): ${error.response?.data?.message || error.message}`);
        }

        try {
            await axios.get(`${BASE_URL}/ebooks/admin`);
        } catch (error) {
            console.log(`❌ Ebooks (no auth): ${error.response?.data?.message || error.message}`);
        }

        try {
            await axios.get(`${BASE_URL}/notices/admin/all`);
        } catch (error) {
            console.log(`❌ Notices (no auth): ${error.response?.data?.message || error.message}`);
        }
    }
};

testAdminPanel().catch(console.error);