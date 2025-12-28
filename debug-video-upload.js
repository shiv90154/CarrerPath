const axios = require('axios');

// Debug script to check course content structure
async function debugCourseContent() {
    try {
        // Replace with your actual course ID and admin token
        const courseId = 'YOUR_COURSE_ID_HERE';
        const adminToken = 'YOUR_ADMIN_TOKEN_HERE';

        console.log('🔍 Debugging course content structure...\n');

        const response = await axios.get(`https://carrerpath-m48v.onrender.com/api/courses/admin/${courseId}`, {
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });

        const course = response.data;

        console.log('📋 Course Title:', course.title);
        console.log('📊 Content Array Length:', course.content ? course.content.length : 'undefined');
        console.log('📝 Content Structure:');

        if (course.content && course.content.length > 0) {
            course.content.forEach((category, index) => {
                console.log(`  Category ${index}:`, category ? category.categoryName : 'null/undefined');
                if (category && category.subcategories) {
                    category.subcategories.forEach((sub, subIndex) => {
                        console.log(`    Subcategory ${subIndex}:`, sub ? sub.subcategoryName : 'null/undefined');
                    });
                }
            });
        } else {
            console.log('  ❌ No content structure found or empty array');
        }

        console.log('\n🎬 Legacy Videos Array Length:', course.videos ? course.videos.length : 'undefined');

    } catch (error) {
        console.error('❌ Error:', error.response?.data?.message || error.message);
    }
}

// Instructions for use
console.log('📝 Instructions:');
console.log('1. Replace YOUR_COURSE_ID_HERE with the actual course ID');
console.log('2. Replace YOUR_ADMIN_TOKEN_HERE with your admin token');
console.log('3. Run: node debug-video-upload.js\n');

// Uncomment the line below after setting the course ID and token
// debugCourseContent();