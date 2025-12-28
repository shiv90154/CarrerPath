const mongoose = require('mongoose');

// Fix script for slug-related errors
async function fixSlugErrors() {
    try {
        console.log('🔧 Fixing slug-related errors...\n');

        // Connect to MongoDB (replace with your connection string)
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database';

        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Import models
        const Course = require('./backend/models/Course');
        const TestSeries = require('./backend/models/TestSeries');
        const Ebook = require('./backend/models/Ebook');
        const CurrentAffair = require('./backend/models/CurrentAffair');

        console.log('📋 Models loaded successfully\n');

        // Fix courses without slugs
        console.log('1. Fixing courses without slugs...');
        const coursesWithoutSlugs = await Course.find({
            $or: [
                { slug: { $exists: false } },
                { slug: null },
                { slug: '' }
            ]
        });

        for (const course of coursesWithoutSlugs) {
            if (course.title) {
                course.slug = course.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
                    .substring(0, 100);
                await course.save();
                console.log(`  ✅ Fixed slug for course: ${course.title}`);
            }
        }
        console.log(`✅ Fixed ${coursesWithoutSlugs.length} courses\n`);

        // Fix test series without slugs
        console.log('2. Fixing test series without slugs...');
        const testSeriesWithoutSlugs = await TestSeries.find({
            $or: [
                { slug: { $exists: false } },
                { slug: null },
                { slug: '' }
            ]
        });

        for (const testSeries of testSeriesWithoutSlugs) {
            if (testSeries.title) {
                testSeries.slug = testSeries.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
                    .substring(0, 100);
                await testSeries.save();
                console.log(`  ✅ Fixed slug for test series: ${testSeries.title}`);
            }
        }
        console.log(`✅ Fixed ${testSeriesWithoutSlugs.length} test series\n`);

        // Fix ebooks without slugs
        console.log('3. Fixing ebooks without slugs...');
        const ebooksWithoutSlugs = await Ebook.find({
            $or: [
                { slug: { $exists: false } },
                { slug: null },
                { slug: '' }
            ]
        });

        for (const ebook of ebooksWithoutSlugs) {
            if (ebook.title) {
                ebook.slug = ebook.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
                    .substring(0, 100);
                await ebook.save();
                console.log(`  ✅ Fixed slug for ebook: ${ebook.title}`);
            }
        }
        console.log(`✅ Fixed ${ebooksWithoutSlugs.length} ebooks\n`);

        // Fix current affairs without slugs
        console.log('4. Fixing current affairs without slugs...');
        const currentAffairsWithoutSlugs = await CurrentAffair.find({
            $or: [
                { slug: { $exists: false } },
                { slug: null },
                { slug: '' }
            ]
        });

        for (const currentAffair of currentAffairsWithoutSlugs) {
            if (currentAffair.title) {
                currentAffair.slug = currentAffair.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
                    .substring(0, 100);
                await currentAffair.save();
                console.log(`  ✅ Fixed slug for current affair: ${currentAffair.title}`);
            }
        }
        console.log(`✅ Fixed ${currentAffairsWithoutSlugs.length} current affairs\n`);

        // Check for duplicate slugs and fix them
        console.log('5. Checking for duplicate slugs...');
        const models = [
            { name: 'Course', model: Course },
            { name: 'TestSeries', model: TestSeries },
            { name: 'Ebook', model: Ebook },
            { name: 'CurrentAffair', model: CurrentAffair }
        ];

        for (const { name, model } of models) {
            const duplicates = await model.aggregate([
                { $match: { slug: { $ne: null, $ne: '' } } },
                { $group: { _id: '$slug', count: { $sum: 1 }, docs: { $push: '$_id' } } },
                { $match: { count: { $gt: 1 } } }
            ]);

            for (const duplicate of duplicates) {
                console.log(`  ⚠️  Found duplicate slug in ${name}: ${duplicate._id}`);
                // Fix duplicates by adding a number suffix
                for (let i = 1; i < duplicate.docs.length; i++) {
                    const doc = await model.findById(duplicate.docs[i]);
                    if (doc) {
                        doc.slug = `${duplicate._id}-${i}`;
                        await doc.save();
                        console.log(`    ✅ Fixed duplicate: ${doc.title} -> ${doc.slug}`);
                    }
                }
            }
        }

        console.log('\n🎉 All slug errors have been fixed!');
        console.log('\n📝 Summary:');
        console.log('- Added slug fields to Course, TestSeries, and Ebook models');
        console.log('- Generated slugs for existing records without slugs');
        console.log('- Fixed duplicate slug issues');
        console.log('- All models now have consistent slug functionality');

        // Disconnect
        await mongoose.disconnect();
        console.log('\n📡 Disconnected from MongoDB');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Instructions
console.log('📝 Instructions:');
console.log('1. Make sure MongoDB is running');
console.log('2. Set MONGODB_URI environment variable or update the connection string');
console.log('3. Run: node fix-slug-errors.js');
console.log('4. This will add slug functionality to all models and fix existing data\n');

// Uncomment to run the fix
// fixSlugErrors();