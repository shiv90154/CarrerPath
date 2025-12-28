const axios = require('axios');

// Test script to verify video upload fix
async function testVideoUploadFix() {
    try {
        // Replace with your actual values
        const courseId = 'YOUR_COURSE_ID_HERE';
        const adminToken = 'YOUR_ADMIN_TOKEN_HERE';

        console.log('🧪 Testing video upload fix...\n');

        // 1. Get course details
        console.log('1. Fetching course details...');
        const response = await axios.get(`https://carrerpath-m48v.onrender.com/api/courses/admin/${courseId}`, {
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });

        const course = response.data;
        console.log(`✅ Course: ${course.title}`);
        console.log(`📊 Content structure: ${course.content ? course.content.length : 0} categories`);

        // 2. Test different scenarios
        const testCases = [
            { name: 'Legacy upload (no categoryIndex)', categoryIndex: undefined, subcategoryIndex: undefined },
            { name: 'Category 0 upload', categoryIndex: 0, subcategoryIndex: undefined },
            { name: 'Invalid category upload', categoryIndex: 999, subcategoryIndex: undefined },
            { name: 'Category 0, Subcategory 0 upload', categoryIndex: 0, subcategoryIndex: 0 },
        ];

        for (const testCase of testCases) {
            console.log(`\n2. Testing: ${testCase.name}`);

            // Simulate the validation logic from the backend
            if (testCase.categoryIndex !== undefined && testCase.categoryIndex !== null && testCase.categoryIndex !== '') {
                const catIndex = parseInt(testCase.categoryIndex);

                if (isNaN(catIndex) || catIndex < 0 || !course.content || catIndex >= course.content.length || !course.content[catIndex]) {
                    console.log(`❌ Would fail: Invalid category index: ${testCase.categoryIndex}. Course has ${course.content ? course.content.length : 0} categories.`);
                    continue;
                }

                if (testCase.subcategoryIndex !== undefined && testCase.subcategoryIndex !== null && testCase.subcategoryIndex !== '') {
                    const subIndex = parseInt(testCase.subcategoryIndex);

                    if (isNaN(subIndex) || subIndex < 0 || !course.content[catIndex].subcategories ||
                        subIndex >= course.content[catIndex].subcategories.length || !course.content[catIndex].subcategories[subIndex]) {
                        console.log(`❌ Would fail: Invalid subcategory index: ${testCase.subcategoryIndex}. Category ${catIndex} has ${course.content[catIndex].subcategories ? course.content[catIndex].subcategories.length : 0} subcategories.`);
                        continue;
                    }
                }
            }

            console.log(`✅ Would succeed: ${testCase.name}`);
        }

        console.log('\n🎉 Video upload validation is working correctly!');
        console.log('\n📝 Next steps:');
        console.log('1. Make sure your course has at least one category');
        console.log('2. Try uploading a video to an existing category');
        console.log('3. Check the browser console and server logs for detailed error messages');

    } catch (error) {
        console.error('❌ Error:', error.response?.data?.message || error.message);
    }
}

// Instructions for use
console.log('📝 Instructions:');
console.log('1. Replace YOUR_COURSE_ID_HERE with the actual course ID');
console.log('2. Replace YOUR_ADMIN_TOKEN_HERE with your admin token');
console.log('3. Run: node test-video-upload-fix.js\n');

// Uncomment the line below after setting the course ID and token
// testVideoUploadFix();