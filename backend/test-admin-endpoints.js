const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000/api';

// Test admin endpoints
const testAdminEndpoints = async () => {
    console.log('🧪 Testing Admin Panel Endpoints\n');

    try {
        // Test 1: Create admin user if doesn't exist
        console.log('1️⃣ Setting up admin user...');
        const User = require('./models/User');
        const mongoose = require('mongoose');
        await mongoose.connect(process.env.MONGO_URI);

        let adminUser = await User.findOne({ email: 'admin@test.com' });
        if (!adminUser) {
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            adminUser = new User({
                name: 'Test Admin',
                email: 'admin@test.com',
                phone: '9999999999',
                password: hashedPassword,
                role: 'admin',
                isActive: true,
                emailVerified: true
            });
            await adminUser.save();
            console.log('✅ Admin user created');
        } else {
            console.log('✅ Admin user exists');
        }

        // Test 2: Login as admin
        console.log('\n2️⃣ Testing admin login...');
        const loginResponse = await axios.post(`${BASE_URL}/users/login`, {
            email: 'admin@test.com',
            password: 'admin123'
        });

        if (!loginResponse.data.token) {
            throw new Error('No token received from login');
        }

        const token = loginResponse.data.token;
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        console.log('✅ Admin login successful');

        // Test 3: Test Series Admin API
        console.log('\n3️⃣ Testing Test Series Admin API...');
        try {
            const testSeriesResponse = await axios.get(`${BASE_URL}/testseries/admin`, config);
            console.log(`✅ Test Series API working - Found ${testSeriesResponse.data.length} test series`);

            // Test creating a test series
            const newTestSeries = {
                title: 'Test Series API Test',
                description: 'Testing API functionality',
                fullDescription: 'This is a test test series created via API',
                price: 100,
                category: 'UPSC',
                duration: '30 days',
                tags: ['test', 'api'],
                requirements: ['Basic knowledge'],
                whatYouWillLearn: ['API testing']
            };

            const createResponse = await axios.post(`${BASE_URL}/testseries/admin`, newTestSeries, config);
            console.log(`✅ Test Series creation working - Created: ${createResponse.data.title}`);

            // Clean up - delete the test series
            await axios.delete(`${BASE_URL}/testseries/admin/${createResponse.data._id}`, config);
            console.log('✅ Test Series deletion working');

        } catch (error) {
            console.log(`❌ Test Series API error: ${error.response?.data?.message || error.message}`);
        }

        // Test 4: Ebooks Admin API
        console.log('\n4️⃣ Testing Ebooks Admin API...');
        try {
            const ebooksResponse = await axios.get(`${BASE_URL}/ebooks/admin`, config);
            console.log(`✅ Ebooks API working - Found ${ebooksResponse.data.length} ebooks`);

            // Test creating an ebook
            const newEbook = {
                title: 'Test Ebook API Test',
                description: 'Testing API functionality',
                fullDescription: 'This is a test ebook created via API',
                price: 50,
                category: 'UPSC',
                pages: 100,
                fileSize: '5 MB',
                format: 'PDF',
                tags: ['test', 'api']
            };

            const createResponse = await axios.post(`${BASE_URL}/ebooks/admin`, newEbook, config);
            console.log(`✅ Ebook creation working - Created: ${createResponse.data.title}`);

            // Clean up - delete the test ebook
            await axios.delete(`${BASE_URL}/ebooks/admin/${createResponse.data._id}`, config);
            console.log('✅ Ebook deletion working');

        } catch (error) {
            console.log(`❌ Ebooks API error: ${error.response?.data?.message || error.message}`);
        }

        // Test 5: Notices Admin API
        console.log('\n5️⃣ Testing Notices Admin API...');
        try {
            const noticesResponse = await axios.get(`${BASE_URL}/notices/admin/all`, config);
            console.log(`✅ Notices API working - Found ${noticesResponse.data.data?.length || 0} notices`);

            // Test creating a notice
            const newNotice = {
                title: 'Test Notice API Test',
                description: 'Testing API functionality',
                content: 'This is a test notice created via API',
                badge: 'new',
                category: 'general',
                priority: 1,
                targetAudience: 'all'
            };

            const createResponse = await axios.post(`${BASE_URL}/notices/admin`, newNotice, config);
            console.log(`✅ Notice creation working - Created: ${createResponse.data.data.title}`);

            // Clean up - delete the test notice
            await axios.delete(`${BASE_URL}/notices/admin/${createResponse.data.data._id}`, config);
            console.log('✅ Notice deletion working');

        } catch (error) {
            console.log(`❌ Notices API error: ${error.response?.data?.message || error.message}`);
        }

        // Test 6: Notice Stats API
        console.log('\n6️⃣ Testing Notice Stats API...');
        try {
            const statsResponse = await axios.get(`${BASE_URL}/notices/admin/stats`, config);
            console.log(`✅ Notice Stats API working`);
            console.log(`   Total: ${statsResponse.data.data?.total || 0}`);
            console.log(`   Published: ${statsResponse.data.data?.published || 0}`);
        } catch (error) {
            console.log(`❌ Notice Stats API error: ${error.response?.data?.message || error.message}`);
        }

        // Test 7: File Upload Endpoints
        console.log('\n7️⃣ Testing File Upload Endpoints...');
        try {
            // Test ebook upload endpoint
            const FormData = require('form-data');
            const fs = require('fs');
            const path = require('path');

            // Create a dummy file for testing
            const testFilePath = path.join(__dirname, 'test-file.txt');
            fs.writeFileSync(testFilePath, 'This is a test file for upload testing');

            const formData = new FormData();
            formData.append('ebook', fs.createReadStream(testFilePath));

            try {
                await axios.post(`${BASE_URL}/ebooks/upload/ebook`, formData, {
                    headers: {
                        ...formData.getHeaders(),
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('✅ Ebook upload endpoint working');
            } catch (uploadError) {
                console.log(`❌ Ebook upload endpoint error: ${uploadError.response?.data?.message || uploadError.message}`);
            }

            // Clean up test file
            fs.unlinkSync(testFilePath);

        } catch (error) {
            console.log(`❌ File upload test error: ${error.message}`);
        }

        console.log('\n🎉 Admin Panel API Tests Completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        mongoose.connection.close();
    }
};

testAdminEndpoints().catch(console.error);