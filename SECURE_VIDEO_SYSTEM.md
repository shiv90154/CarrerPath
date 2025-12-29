# Secure Video Access System Documentation

## Overview

This system implements a secure, backend-controlled video access system using YouTube unlisted/private videos, without server-side video hosting, and with strong frontend protection.

## 🔒 Security Architecture

### 1. Video Storage (YouTube Only)
- **NO VIDEO UPLOAD ON SERVER**: Videos are never uploaded or stored on the website server
- **YouTube Hosting**: All videos are uploaded to YouTube as UNLISTED or PRIVATE
- **Database Storage**: Only the 11-character YouTube video ID is stored in the database
- **No Public URLs**: Full YouTube URLs are never stored or exposed

### 2. Access Control (Backend Only)
- **Authentication Required**: User must be logged in
- **Purchase Verification**: User must have purchased the related course
- **Course Association**: Video must belong to the purchased course
- **Secure API**: Video IDs are only returned after all checks pass

### 3. Frontend Security
- **Right-click Disabled**: Context menu disabled on video pages
- **Keyboard Shortcuts Blocked**: F12, Ctrl+U, Ctrl+S, Ctrl+Shift+I disabled
- **No Hardcoded IDs**: Video IDs never appear in frontend code
- **Dynamic Loading**: Video IDs fetched from backend API only after verification

## 📁 File Structure

### Backend Files
```
backend/
├── models/Video.js                 # Updated video model (YouTube ID only)
├── controllers/videoController.js  # Secure video access controller
├── routes/videoRoutes.js           # Protected video routes
├── controllers/courseController.js # Updated course controller
└── scripts/
    ├── migrate-videos-to-youtube.js    # Migration helper
    └── update-video-youtube-id.js      # Video update script
```

### Frontend Files
```
frontend/src/
├── components/
│   ├── SecureVideoPlayer.tsx       # Secure YouTube iframe player
│   └── AdminVideoForm.tsx          # Admin interface for adding videos
├── pages/
│   ├── CourseVideoPage.tsx         # Secure video viewing page
│   └── SingleCoursePage.tsx        # Updated course page with security
└── config/api.ts                   # Updated API endpoints
```

## 🛠 Implementation Details

### Database Schema (Video Model)
```javascript
{
  title: String,           // Video title
  description: String,     // Video description  
  youtubeVideoId: String,  // 11-character YouTube ID (ONLY field for video access)
  duration: String,        // e.g., "15:30"
  order: Number,           // Video order in course
  course: ObjectId,        // Reference to course
  views: Number,           // View count
  isActive: Boolean        // Active status
}
```

### API Endpoints

#### Secure Video Access
```
GET /api/videos/:videoId/access
- Requires: Authentication
- Verifies: Course purchase
- Returns: YouTube video ID (only if authorized)
```

#### Course Videos List
```
GET /api/videos/course/:courseId  
- Requires: Authentication
- Verifies: Course purchase
- Returns: Video metadata (no YouTube IDs)
```

#### Admin Video Management
```
POST /api/courses/admin/:id/videos
- Requires: Admin authentication
- Accepts: YouTube video ID or URL
- Stores: Only the 11-character video ID
```

### Frontend Security Implementation

#### SecureVideoPlayer Component
```typescript
// Security features:
- Disables right-click context menu
- Blocks developer tools shortcuts
- Fetches video ID from backend API
- Shows access denied for unauthorized users
- Uses YouTube iframe embed (no direct video URLs)
```

#### CourseVideoPage Component
```typescript
// Security features:
- Authentication required
- Purchase verification
- Secure video player integration
- Navigation between course videos
- Progress tracking
```

## 🚀 Setup Instructions

### 1. Backend Setup

1. **Update Video Model**: The Video model now uses `youtubeVideoId` instead of `videoUrl`

2. **Add Video Routes**: Include video routes in server.js:
```javascript
app.use('/api/videos', videoRoutes);
```

3. **Migration**: Run migration script to identify videos needing YouTube IDs:
```bash
node scripts/migrate-videos-to-youtube.js
```

### 2. Frontend Setup

1. **Add New Routes**: Update App.tsx with video page route:
```typescript
<Route path="/courses/:courseId/videos/:videoId" element={<CourseVideoPage />} />
```

2. **Update Course Pages**: Course pages now show purchase requirements for video access

### 3. Admin Workflow

1. **Upload to YouTube**:
   - Upload video to YouTube
   - Set visibility to UNLISTED or PRIVATE
   - Copy the 11-character video ID

2. **Add to Course**:
   - Use AdminVideoForm component
   - Paste YouTube URL or video ID
   - Fill in title, description, duration, order

3. **Verify Access**:
   - Test with purchased user account
   - Ensure video loads correctly
   - Verify access denied for non-purchasers

## 🔐 Security Measures

### Video Access Control
1. **Authentication Check**: User must be logged in
2. **Purchase Verification**: Check Order collection for paid course purchase
3. **Course Association**: Verify video belongs to purchased course
4. **Active Status**: Only active videos are accessible

### Frontend Protection
1. **Context Menu Disabled**: Right-click prevention
2. **Developer Tools Blocked**: Key combinations disabled
3. **Source Code Protection**: No video IDs in page source
4. **Dynamic Loading**: Video IDs fetched via authenticated API calls

### YouTube Security
1. **Unlisted/Private Videos**: Never use public videos for paid content
2. **No Direct URLs**: Only store video IDs, never full URLs
3. **Iframe Embedding**: Use YouTube's secure embed system
4. **Access Control**: YouTube handles video serving, we control access

## 📊 Usage Analytics

### Video Tracking
- View count incremented on each access
- User progress tracking (completed videos)
- Course completion percentage calculation

### Security Monitoring
- Failed access attempts logged
- Purchase verification results tracked
- Video access patterns monitored

## 🚨 Security Warnings

### Critical Requirements
1. **NEVER use PUBLIC YouTube videos** for paid courses
2. **ALWAYS verify video is UNLISTED or PRIVATE** before adding
3. **TEST video access** after adding to course
4. **MONITOR for unauthorized access** attempts

### Best Practices
1. **Regular Security Audits**: Check video visibility settings
2. **Access Log Monitoring**: Review video access patterns
3. **Purchase Verification**: Ensure all video access requires valid purchase
4. **Frontend Security**: Keep security measures updated

## 🔧 Troubleshooting

### Common Issues

1. **Video Not Loading**:
   - Check if video is unlisted/private
   - Verify YouTube video ID is correct (11 characters)
   - Ensure user has purchased the course

2. **Access Denied**:
   - Verify user authentication
   - Check course purchase in Order collection
   - Confirm video belongs to correct course

3. **Security Bypass Attempts**:
   - Monitor for disabled JavaScript
   - Check for browser extension interference
   - Verify frontend security measures are active

### Debug Commands

```bash
# Check video migration status
node scripts/migrate-videos-to-youtube.js

# Update video with YouTube ID
node scripts/update-video-youtube-id.js <videoId> <youtubeVideoId>

# Test video access (requires authentication)
curl -H "Authorization: Bearer <token>" /api/videos/<videoId>/access
```

## 📈 Performance Considerations

### Optimization
- YouTube handles video streaming (no server bandwidth usage)
- Minimal database storage (only video IDs)
- Efficient purchase verification queries
- Cached video metadata for navigation

### Scalability
- No video storage limits on server
- YouTube's global CDN for video delivery
- Database queries optimized for course access
- Frontend security measures don't impact performance

## 🔄 Migration Guide

### From Old System
1. Run migration script to identify videos
2. Upload each video to YouTube (unlisted/private)
3. Update database with YouTube video IDs
4. Test video access for each course
5. Remove old video files from server

### Verification Steps
1. Confirm all videos have YouTube IDs
2. Test purchase verification works
3. Verify frontend security measures active
4. Check video playback in all browsers
5. Monitor for any access issues

This secure video system ensures that your educational content is protected while providing a seamless learning experience for legitimate users.