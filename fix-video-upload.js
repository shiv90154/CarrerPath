const axios = require('axios');

// Fix script for video upload issues
async function fixVideoUploadIssues() {
    try {
        // Replace with your actual course ID and admin token
        const courseId = 'YOUR_COURSE_ID_HERE';
        const adminToken = 'YOUR_ADMIN_TOKEN_HERE';

        console.log('🔧 Fixing video upload issues...\n');

        // 1. Get course details
        const response = await axios.get(`https://carrerpath-m48v.onrender.com/api/courses/admin/${courseId}`, {
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });

        const course = response.data;
        console.log('📋 Course:', course.title);

        // 2. Check and fix content structure
        let needsUpdate = false;

        if (!course.content || course.content.length === 0) {
            console.log('❌ No content structure found. Creating default structure...');
            course.content = [{
                categoryName: 'General',
                categoryDescription: 'General course content',
                subcategories: [],
                videos: []
            }];
            needsUpdate = true;
        } else {
            // Check for null/undefined categories
            course.content = course.content.map((category, index) => {
                if (!category) {
                    console.log(`❌ Found null category at index ${index}. Fixing...`);
                    return {
                        categoryName: `Category ${index + 1}`,
                        categoryDescription: '',
                        subcategories: [],
                        videos: []
                    };
                }

                // Ensure required fields exist
                if (!category.videos) {
                    category.videos = [];
                    needsUpdate = true;
                }
                if (!category.subcategories) {
                    category.subcategories = [];
                    needsUpdate = true;
                }

                // Fix subcategories
                if (category.subcategories) {
                    category.subcategories = category.subcategories.map((sub, subIndex) => {
                        if (!sub) {
                            console.log(`❌ Found null subcategory at category ${index}, subcategory ${subIndex}. Fixing...`);
                            return {
                                subcategoryName: `Subcategory ${subIndex + 1}`,
                                subcategoryDescription: '',
                                videos: []
                            };
                        }
                        if (!sub.videos) {
                            sub.videos = [];
                            needsUpdate = true;
                        }
                        return sub;
                    });
                }

                return category;
            });
        }

        // 3. Update course if needed
        if (needsUpdate) {
            console.log('🔄 Updating course structure...');
            await axios.put(`https://carrerpath-m48v.onrender.com/api/courses/admin/${courseId}`, {
                ...course,
                content: course.content
            }, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('✅ Course structure updated successfully!');
        } else {
            console.log('✅ Course structure is already valid.');
        }

        // 4. Display final structure
        console.log('\n📊 Final content structure:');
        course.content.forEach((category, index) => {
            console.log(`  Category ${index}: ${category.categoryName}`);
            if (category.subcategories && category.subcategories.length > 0) {
                category.subcategories.forEach((sub, subIndex) => {
                    console.log(`    Subcategory ${subIndex}: ${sub.subcategoryName}`);
                });
            }
        });

        console.log('\n🎉 Video upload should now work properly!');

    } catch (error) {
        console.error('❌ Error:', error.response?.data?.message || error.message);
    }
}

// Instructions for use
console.log('📝 Instructions:');
console.log('1. Replace YOUR_COURSE_ID_HERE with the actual course ID');
console.log('2. Replace YOUR_ADMIN_TOKEN_HERE with your admin token');
console.log('3. Run: node fix-video-upload.js\n');

// Uncomment the line below after setting the course ID and token
// fixVideoUploadIssues();