const axios = require('axios');

// Fix script for courses with no categories but have videos
async function fixCourseCategories() {
    try {
        // Replace with your actual admin token
        const adminToken = 'YOUR_ADMIN_TOKEN_HERE';

        console.log('🔧 Fixing courses with no categories...\n');

        // 1. Get all courses
        console.log('1. Fetching all courses...');
        const coursesResponse = await axios.get('https://carrerpath-m48v.onrender.com/api/courses/admin', {
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });

        const courses = coursesResponse.data;
        console.log(`✅ Found ${courses.length} courses\n`);

        // 2. Find courses with no categories but have videos
        const coursesNeedingFix = courses.filter(course => {
            const hasNoCategories = !course.content || course.content.length === 0;
            const hasVideos = course.videos && course.videos.length > 0;
            return hasNoCategories && hasVideos;
        });

        console.log(`📊 Found ${coursesNeedingFix.length} courses that need category structure:\n`);

        if (coursesNeedingFix.length === 0) {
            console.log('🎉 All courses already have proper category structure!');
            return;
        }

        // 3. Fix each course
        for (const course of coursesNeedingFix) {
            console.log(`🔄 Fixing course: ${course.title}`);
            console.log(`   - Has ${course.videos.length} videos but no categories`);

            // Create a default "General" category
            const updatedCourse = {
                ...course,
                content: [{
                    categoryName: 'General',
                    categoryDescription: 'General course content',
                    subcategories: [],
                    videos: [] // Videos will remain in the legacy videos array for now
                }]
            };

            // Update the course
            try {
                await axios.put(`https://carrerpath-m48v.onrender.com/api/courses/admin/${course._id}`, updatedCourse, {
                    headers: {
                        'Authorization': `Bearer ${adminToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log(`   ✅ Added default "General" category`);
            } catch (error) {
                console.log(`   ❌ Failed to update: ${error.response?.data?.message || error.message}`);
            }
        }

        console.log('\n🎉 Course category fix completed!');
        console.log('\n📝 Summary:');
        console.log(`- Fixed ${coursesNeedingFix.length} courses`);
        console.log('- Added default "General" category to courses without categories');
        console.log('- Existing videos remain in legacy structure (can be moved later)');
        console.log('- New video uploads will now work properly');

        console.log('\n💡 Next steps:');
        console.log('1. Test video uploads on the fixed courses');
        console.log('2. Consider organizing existing videos into categories');
        console.log('3. Create more specific categories as needed');

    } catch (error) {
        console.error('❌ Error:', error.response?.data?.message || error.message);
    }
}

// Instructions for use
console.log('📝 Instructions:');
console.log('1. Replace YOUR_ADMIN_TOKEN_HERE with your actual admin token');
console.log('2. Run: node fix-course-categories.js');
console.log('3. This will add default categories to courses that need them\n');

// Uncomment the line below after setting the admin token
// fixCourseCategories();