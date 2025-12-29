const mongoose = require('mongoose');
const Video = require('../models/Video');
require('dotenv').config();

// Get command line arguments
const args = process.argv.slice(2);
const videoId = args[0];
const youtubeVideoId = args[1];

if (!videoId || !youtubeVideoId) {
    console.log('❌ Usage: node update-video-youtube-id.js <videoId> <youtubeVideoId>');
    console.log('Example: node update-video-youtube-id.js 507f1f77bcf86cd799439011 dQw4w9WgXcQ');
    process.exit(1);
}

// Validate YouTube video ID format
if (youtubeVideoId.length !== 11) {
    console.log('❌ Invalid YouTube video ID. Must be exactly 11 characters.');
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewParser: true,
    useUnifiedTopology: true,
});

const updateVideoYouTubeId = async () => {
    try {
        console.log(`🔄 Updating video ${videoId} with YouTube ID: ${youtubeVideoId}`);

        // Find the video
        const video = await Video.findById(videoId);
        if (!video) {
            console.log('❌ Video not found');
            return;
        }

        console.log(`📹 Found video: "${video.title}"`);
        console.log(`   Current videoUrl: ${video.videoUrl || 'None'}`);
        console.log(`   Current youtubeVideoId: ${video.youtubeVideoId || 'None'}`);

        // Update the video
        video.youtubeVideoId = youtubeVideoId;

        // Remove old fields if they exist
        if (video.videoUrl) {
            video.videoUrl = undefined;
        }
        if (video.thumbnailUrl) {
            video.thumbnailUrl = undefined;
        }
        if (video.isFree !== undefined) {
            video.isFree = undefined;
        }
        if (video.isPreview !== undefined) {
            video.isPreview = undefined;
        }

        await video.save();

        console.log('✅ Video updated successfully!');
        console.log(`   New youtubeVideoId: ${video.youtubeVideoId}`);
        console.log('   Old fields removed: videoUrl, thumbnailUrl, isFree, isPreview');

        // Test YouTube URL
        console.log(`\n🔗 YouTube URL: https://www.youtube.com/watch?v=${youtubeVideoId}`);
        console.log('⚠️  Make sure this video is UNLISTED or PRIVATE!');

    } catch (error) {
        console.error('❌ Update failed:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Run the update
updateVideoYouTubeId();