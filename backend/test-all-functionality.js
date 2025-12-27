const axios = require('axios');

const API_BASE = 'https://carrerpath-m48v.onrender.com';

// Test data
const testUser = {
    email: 'test@example.com',
    password: 'password123'
};

let authToken = '';

const testAllFunctionality = async () => {
    console.log('🚀 Starting comprehensive functionality test...\n');

    try {
        // 1. Test user login
        console.log('1. Testing user login...');
        const loginResponse = await axios.post(`${API_BASE}/api/users/login`, testUser);
        authToken = loginResponse.data.token;
        console.log('✅ Login successful');

        const config = {
            headers: { Authorization: `Bearer ${authToken}` }
        };

        // 2. Test free course access
        console.log('\n2. Testing free course access...');
        const coursesResponse = await axios.get(`${API_BASE}/api/courses`);
        const freeCourse = coursesResponse.data.find(course => course.price === 0);

        if (freeCourse) {
            console.log(`Found free course: ${freeCourse.title}`);

            // Test free course payment (should grant immediate access)
            const freePaymentResponse = await axios.post(
                `${API_BASE}/api/payments/orders`,
                { amount: 0, courseId: freeCourse._id },
                config
            );
            console.log('✅ Free course access granted:', freePaymentResponse.data.message);
        } else {
            console.log('⚠️ No free courses found');
        }

        // 3. Test free study materials
        console.log('\n3. Testing free study materials...');
        const materialsResponse = await axios.get(`${API_BASE}/api/studymaterials`);
        const freeMaterial = materialsResponse.data.find(material => material.type === 'Free');

        if (freeMaterial) {
            console.log(`Found free material: ${freeMaterial.title}`);

            // Test accessing free material
            const materialDetailResponse = await axios.get(
                `${API_BASE}/api/studymaterials/${freeMaterial._id}`,
                config
            );

            if (materialDetailResponse.data.access === 'full') {
                console.log('✅ Free study material accessible');
            } else {
                console.log('❌ Free study material not accessible');
            }
        } else {
            console.log('⚠️ No free study materials found');
        }

        // 4. Test free ebooks
        console.log('\n4. Testing free ebooks...');
        const ebooksResponse = await axios.get(`${API_BASE}/api/ebooks`);
        const freeEbook = ebooksResponse.data.find(ebook => ebook.isFree === true);

        if (freeEbook) {
            console.log(`Found free ebook: ${freeEbook.title}`);

            // Test accessing free ebook
            const ebookDetailResponse = await axios.get(
                `${API_BASE}/api/ebooks/${freeEbook._id}`,
                config
            );

            if (ebookDetailResponse.data.downloadUrl) {
                console.log('✅ Free ebook accessible');
            } else {
                console.log('❌ Free ebook not accessible');
            }
        } else {
            console.log('⚠️ No free ebooks found');
        }

        // 5. Test live tests
        console.log('\n5. Testing live tests...');
        const liveTestsResponse = await axios.get(`${API_BASE}/api/livetests`);
        console.log(`Found ${liveTestsResponse.data.length} live tests`);

        if (liveTestsResponse.data.length > 0) {
            const liveTest = liveTestsResponse.data[0];
            console.log(`Testing live test: ${liveTest.title}`);

            try {
                // Try to join live test (might fail if not in time window)
                const joinResponse = await axios.post(
                    `${API_BASE}/api/livetests/${liveTest._id}/join`,
                    {},
                    config
                );
                console.log('✅ Live test join successful');
            } catch (error) {
                console.log('⚠️ Live test join failed (expected if not in time window):', error.response?.data?.message);
            }
        }

        // 6. Test contact form
        console.log('\n6. Testing contact form...');
        const contactResponse = await axios.post(`${API_BASE}/api/contact/send-message`, {
            name: 'Test User',
            email: 'test@example.com',
            subject: 'Test Message',
            message: 'This is a test message to verify functionality',
            category: 'general'
        });
        console.log('✅ Contact form working:', contactResponse.data.message);

        // 7. Test paid content (should require payment)
        console.log('\n7. Testing paid content access...');
        const paidCourse = coursesResponse.data.find(course => course.price > 0);

        if (paidCourse) {
            console.log(`Found paid course: ${paidCourse.title} - ₹${paidCourse.price}`);

            // Test accessing paid course without purchase
            const courseDetailResponse = await axios.get(
                `${API_BASE}/api/courses/${paidCourse._id}`,
                config
            );

            if (courseDetailResponse.data.accessType === 'limited') {
                console.log('✅ Paid course properly restricted');
            } else {
                console.log('❌ Paid course not properly restricted');
            }
        }

        console.log('\n🎉 All tests completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
};

testAllFunctionality();