const mongoose = require('mongoose');
const Video = require('../models/Video');
const Course = require('../models/Course');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const migrateVideosToYouTube = async () => {
    try {
        console.log('🔄 Starting video migration to YouTube-based system...');

        // Find all videos that still have videoUrl (old system)
        const oldVideos = await Video.find({
            videoUrl: { $exists: true },
            youtubeVideoId: { $exists: false }
        });

        console.log(`📹 Found ${oldVideos.length} videos to migrate`);

        if (oldVideos.length === 0) {
            console.log('✅ No videos need migration. All videos are already using YouTube IDs.');
            return;
        }

        console.log('\n⚠️  MIGRATION REQUIRED:');
        console.log('This script will help you migrate from the old video upload system to YouTube-based system.');
        console.log('You need to:');
        console.log('1. Upload each video to YouTube as UNLISTED or PRIVATE');
        console.log('2. Update each video record with the YouTube video ID');
        console.log('3. Remove the old videoUrl field');

        console.log('\n📋 Videos that need YouTube IDs:');
        console.log('=====================================');

        for (let i = 0; i < oldVideos.length; i++) {
            const video = oldVideos[i];
            const course = await Course.findById(video.course);

            console.log(`\n${i + 1}. Video: "${video.title}"`);
            console.log(`   Course: "${course ? course.title : 'Unknown'}"`);
            console.log(`   Current URL: ${video.videoUrl}`);
            console.log(`   Duration: ${video.duration}`);
            console.log(`   Order: ${video.order}`);
            console.log(`   Created: ${video.createdAt}`);
            console.log('   ⚠️  Action needed: Upload to YouTube and get video ID');
        }

        console.log('\n🔧 MANUAL STEPS REQUIRED:');
        console.log('1. For each video above:');
        console.log('   a. Download the video from the current URL');
        console.log('   b. Upload to YouTube as UNLISTED or PRIVATE');
        console.log('   c. Copy the 11-character YouTube video ID');
        console.log('   d. Update the database using the update script');

        console.log('\n📝 To update a video with YouTube ID, run:');
        console.log('node scripts/update-video-youtube-id.js <videoId> <youtubeVideoId>');

        console.log('\n⚠️  SECURITY REMINDER:');
        console.log('- NEVER use PUBLIC YouTube videos for paid courses');
        console.log('- Always use UNLISTED or PRIVATE videos');
        console.log('- Test video access after migration');

    } catch (error) {
        console.error('❌ Migration check failed:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Run the migration check
migrateVideosToYouTube();