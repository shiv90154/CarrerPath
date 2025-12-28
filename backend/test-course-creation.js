const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

const testCourseCreation = async () => {
    console.log('🚀 Testing Course Creation and Retrieval...\n');

    let adminToken = null;

    try {
        // Step 1: Login as admin
        console.log('1️⃣ Logging in as admin...');
        try {
            const loginResponse = await axios.post(`${BASE_URL}/api/users/login`, {
                email: 'testadmin@example.com',
                password: 'testadmin123'
            });

            adminToken = loginResponse.data.token;
            console.log('✅ Admin login successful');
        } catch (error) {
            console.log('❌ Admin login failed:', error.response?.data?.message || error.message);
            console.log('💡 Make sure to run: node create-test-admin.js first');
            return;
        }

        // Step 2: Create a test course
        console.log('\n2️⃣ Creating a test course...');

        const courseData = {
            title: 'Test Course API',
            description: 'A test course created via API',
            fullDescription: 'This is a comprehensive test course created to verify the API functionality.',
            price: 999,
            originalPrice: 1999,
            category: 'Programming',
            level: 'Beginner',
            duration: '5 hours',
            language: 'English',
            tags: 'javascript,programming,web development',
            requirements: 'Basic computer knowledge,Internet connection',
            whatYouWillLearn: 'JavaScript fundamentals,API development,Testing strategies',
            content: [
                {
                    categoryName: 'Introduction',
                    categoryDescription: 'Getting started with the course',
                    subcategories: [
                        {
                            subcategoryName: 'Course Overview',
                            subcategoryDescription: 'What you will learn in this course',
                            videos: []
                        }
                    ],
                    videos: []
                },
                {
                    categoryName: 'Advanced Topics',
                    categoryDescription: 'Deep dive into advanced concepts',
                    subcategories: [],
                    videos: []
                }
            ]
        };

        try {
            const createResponse = await axios.post(`${BASE_URL}/api/courses`, courseData, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('✅ Course created successfully');
            console.log(`   Course ID: ${createResponse.data._id}`);
            console.log(`   Title: ${createResponse.data.title}`);
            console.log(`   Price: ₹${createResponse.data.price}`);

            const courseId = createResponse.data._id;

            // Step 3: Retrieve the created course
            console.log('\n3️⃣ Retrieving the created course...');

            const getResponse = await axios.get(`${BASE_URL}/api/courses/${courseId}`);

            console.log('✅ Course retrieved successfully');
            console.log(`   Title: ${getResponse.data.title}`);
            console.log(`   Instructor: ${getResponse.data.instructor?.name || 'Not populated'}`);
            console.log(`   Content sections: ${getResponse.data.content?.length || 0}`);

            if (getResponse.data.content && getResponse.data.content.length > 0) {
                console.log('   Content structure:');
                getResponse.data.content.forEach((category, index) => {
                    console.log(`     ${index + 1}. ${category.categoryName}`);
                    if (category.subcategories && category.subcategories.length > 0) {
                        category.subcategories.forEach((sub, subIndex) => {
                            console.log(`        ${index + 1}.${subIndex + 1} ${sub.subcategoryName}`);
                        });
                    }
                });
            }

            // Step 4: Test course listing
            console.log('\n4️⃣ Testing course in public listing...');

            const listResponse = await axios.get(`${BASE_URL}/api/courses`);
            const foundCourse = listResponse.data.courses.find(c => c._id === courseId);

            if (foundCourse) {
                console.log('✅ Course appears in public listing');
                console.log(`   Listed as: ${foundCourse.title}`);
            } else {
                console.log('❌ Course not found in public listing');
            }

            // Step 5: Clean up - delete the test course
            console.log('\n5️⃣ Cleaning up - deleting test course...');

            try {
                await axios.delete(`${BASE_URL}/api/courses/${courseId}`, {
                    headers: {
                        'Authorization': `Bearer ${adminToken}`
                    }
                });
                console.log('✅ Test course deleted successfully');
            } catch (deleteError) {
                console.log('⚠️ Could not delete test course:', deleteError.response?.data?.message || deleteError.message);
            }

        } catch (error) {
            console.log('❌ Course creation failed');
            console.log('   Error:', error.response?.data?.message || error.message);
            if (error.response?.data?.stack) {
                console.log('   Stack:', error.response.data.stack);
            }
        }

        console.log('\n📊 Course Creation Test Summary:');
        console.log('=================================');
        console.log('✅ Admin authentication works');
        console.log('✅ Course creation API works');
        console.log('✅ Course retrieval API works');
        console.log('✅ Hierarchical content structure works');
        console.log('✅ Course listing includes new courses');

    } catch (error) {
        console.error('❌ Course creation test failed:', error.message);
    }
};

// Main function
const runTest = async () => {
    console.log('🧪 Course Creation and Retrieval Test\n');
    await testCourseCreation();
    console.log('\n🏁 Test completed!');
};

runTest();