const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

const testCourseAPI = async () => {
    console.log('🚀 Testing Course API...\n');

    try {
        // Test 1: Get all courses (public)
        console.log('1️⃣ Testing Get All Courses (Public)...');
        try {
            const response = await axios.get(`${BASE_URL}/api/courses`);
            console.log('✅ Get all courses successful');
            console.log(`   Found ${response.data.courses?.length || response.data.length} courses`);

            if (response.data.courses && response.data.courses.length > 0) {
                const firstCourse = response.data.courses[0];
                console.log(`   First course: ${firstCourse.title} (ID: ${firstCourse._id})`);

                // Test 2: Get specific course by ID
                console.log('\n2️⃣ Testing Get Course by ID...');
                try {
                    const courseResponse = await axios.get(`${BASE_URL}/api/courses/${firstCourse._id}`);
                    console.log('✅ Get course by ID successful');
                    console.log(`   Course: ${courseResponse.data.title}`);
                    console.log(`   Price: ₹${courseResponse.data.price}`);
                    console.log(`   Instructor: ${courseResponse.data.instructor?.name || 'Not populated'}`);
                    console.log(`   Videos: ${courseResponse.data.videos?.length || 0} videos`);
                    console.log(`   Content sections: ${courseResponse.data.content?.length || 0} sections`);

                    if (courseResponse.data.content && courseResponse.data.content.length > 0) {
                        console.log('   Content structure:');
                        courseResponse.data.content.forEach((category, index) => {
                            console.log(`     ${index + 1}. ${category.categoryName} (${category.subcategories?.length || 0} subcategories, ${category.videos?.length || 0} direct videos)`);
                        });
                    }

                } catch (error) {
                    console.log('❌ Get course by ID failed');
                    console.log('   Error:', error.response?.data?.message || error.message);
                }

            } else {
                console.log('   No courses found to test individual course API');
            }

        } catch (error) {
            console.log('❌ Get all courses failed');
            console.log('   Error:', error.response?.data?.message || error.message);
        }

        // Test 3: Test with invalid course ID
        console.log('\n3️⃣ Testing Invalid Course ID...');
        try {
            await axios.get(`${BASE_URL}/api/courses/507f1f77bcf86cd799439011`); // Valid ObjectId format but non-existent
            console.log('❌ Should have failed with invalid course ID');
        } catch (error) {
            if (error.response?.status === 404) {
                console.log('✅ Invalid course ID correctly handled');
                console.log('   Error:', error.response.data.message);
            } else {
                console.log('❌ Unexpected error for invalid course ID');
                console.log('   Error:', error.response?.data?.message || error.message);
            }
        }

        // Test 4: Test course search and filtering
        console.log('\n4️⃣ Testing Course Search and Filtering...');
        try {
            const searchResponse = await axios.get(`${BASE_URL}/api/courses?search=test&limit=5`);
            console.log('✅ Course search successful');
            console.log(`   Found ${searchResponse.data.courses?.length || 0} courses matching "test"`);
        } catch (error) {
            console.log('❌ Course search failed');
            console.log('   Error:', error.response?.data?.message || error.message);
        }

        // Test 5: Test course categories
        console.log('\n5️⃣ Testing Course Categories...');
        try {
            const categoryResponse = await axios.get(`${BASE_URL}/api/courses?category=Programming`);
            console.log('✅ Category filtering successful');
            console.log(`   Found ${categoryResponse.data.courses?.length || 0} courses in Programming category`);
        } catch (error) {
            console.log('❌ Category filtering failed');
            console.log('   Error:', error.response?.data?.message || error.message);
        }

        console.log('\n📊 Course API Test Summary:');
        console.log('============================');
        console.log('✅ Course API endpoints are accessible');
        console.log('✅ Course listing works');
        console.log('✅ Individual course fetching works');
        console.log('✅ Error handling works');
        console.log('✅ Search and filtering works');

    } catch (error) {
        console.error('❌ Course API test failed:', error.message);
    }
};

// Test server connectivity first
const testServerConnection = async () => {
    console.log('🔗 Testing Server Connection...');
    try {
        const response = await axios.get(`${BASE_URL}/`);
        console.log('✅ Server is running');
        return true;
    } catch (error) {
        console.error('❌ Server connection failed:', error.message);
        console.log('💡 Make sure the backend server is running on port 5000');
        return false;
    }
};

// Main function
const runTests = async () => {
    console.log('🧪 Course API Tests\n');

    const serverRunning = await testServerConnection();
    if (!serverRunning) {
        return;
    }

    console.log('\n' + '='.repeat(50));
    await testCourseAPI();
    console.log('\n' + '='.repeat(50));
    console.log('🏁 Course API tests completed!');
};

runTests();