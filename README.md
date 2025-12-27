# Professional Course Platform

A comprehensive MERN stack educational platform with video courses, payment integration, and professional dashboards.

## Features

### 🎓 Course Management
- **Dynamic Course Listing**: Browse courses with advanced filtering and search
- **Video Player**: Custom video player with progress tracking
- **Content Locking**: Free preview videos, paid content protection
- **Course Progress**: Track student progress through courses

### 🔐 Authentication & Authorization
- **JWT Authentication**: Secure login/registration system
- **Email OTP Verification**: Two-step registration with email verification
- **Profile Management**: Complete profile editing with personal, address, education, and preferences
- **Password Management**: Secure password change with strength validation
- **Role-based Access**: Student and Admin roles
- **Protected Routes**: Secure access to premium content

### 💳 Payment Integration
- **Razorpay Integration**: Secure payment processing
- **Order Management**: Complete order tracking system
- **Purchase History**: Detailed payment records

### 📊 Professional Dashboards
- **Student Dashboard**: Course progress, test results, payment history, profile management
- **Profile Management**: Complete profile viewing and editing with comprehensive information display
- **Profile Editing**: Comprehensive profile management with tabbed interface
- **Password Security**: Password change with strength indicators and requirements
- **Admin Dashboard**: User management, content management, analytics
- **Real-time Stats**: Live dashboard statistics

### 📞 Contact & Support
- **Contact Form**: Professional contact form with email integration
- **Auto-reply System**: Automated responses to user inquiries
- **Category-based Routing**: Organized inquiry handling by category
- **Interactive Map**: Google Maps integration for location display
- **Social Media Links**: Complete social media integration
- **Office Information**: Comprehensive contact details and hours

### 🎯 Content Types
- **Video Courses**: Professional video learning content
- **Test Series**: Practice tests and assessments
- **E-Books**: Digital study materials
- **Current Affairs**: Daily updates and news
- **Study Materials**: Additional learning resources

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Nodemailer** for email services (OTP verification)
- **Razorpay** for payments
- **Cloudinary** for media storage
- **Multer** for file uploads

### Frontend
- **React 18** with TypeScript
- **React Router v6** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Context API** for state management

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Cloudinary account
- Razorpay account

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your values:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/institute-website
   JWT_SECRET=your_jwt_secret_here
   RAZORPAY_KEY_ID=your_razorpay_key_id_here
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # Email Configuration for OTP verification
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password_here
   ```

   **Email Setup Instructions:**
   - For Gmail: Enable 2-factor authentication
   - Generate App Password from Google Account settings
   - Use App Password (not regular password) in EMAIL_PASS
   - Other email providers: Configure SMTP settings accordingly

4. **Start the server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your values:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/users/register` - User registration (legacy)
- `POST /api/users/send-otp` - Send OTP for email verification
- `POST /api/users/resend-otp` - Resend OTP for email verification
- `POST /api/users/verify-otp` - Verify OTP and register user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change user password

### Courses
- `GET /api/courses` - Get all courses (public)
- `GET /api/courses/:id` - Get course details with access control
- `GET /api/courses/:courseId/videos/:videoId` - Get video with access control
- `POST /api/courses` - Create course (admin)
- `PUT /api/courses/:id` - Update course (admin)
- `DELETE /api/courses/:id` - Delete course (admin)

### Contact & Support
- `POST /api/contact/send-message` - Send contact form message
- `GET /api/contact/info` - Get contact information

### Student Dashboard
- `GET /api/student/courses` - Get purchased courses
- `GET /api/student/testseries` - Get purchased test series
- `GET /api/student/ebooks` - Get purchased ebooks
- `GET /api/student/results` - Get test results
- `GET /api/student/payments` - Get payment history
- `GET /api/student/stats` - Get dashboard statistics

### Payments
- `POST /api/payments/orders` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/myorders` - Get user payments

## Key Features Implementation

### 🔒 Video Content Protection
- Free videos accessible to all users
- Preview videos for course promotion
- Paid videos require course purchase
- Automatic redirect to login for unauthorized access

### 💰 Payment Flow
1. User selects course to purchase
2. Razorpay order created on backend
3. Payment gateway opens
4. Payment verification on success
5. Course access granted automatically

### 📱 Responsive Design
- Mobile-first approach
- Tailwind CSS for consistent styling
- Professional UI/UX design
- Optimized for all screen sizes

### 🎯 User Experience
- Intuitive navigation
- Real-time feedback
- Loading states and error handling
- Professional course presentation

## Database Models

### User Model
- Personal information
- Authentication details
- Purchased courses tracking
- Progress monitoring
- Subscription management

### Course Model
- Course metadata
- Pricing and discounts
- Video references
- Instructor information
- Student enrollment tracking

### Video Model
- Video details and URLs
- Access control flags
- Progress tracking
- View statistics

### Order Model
- Purchase records
- Payment status
- Product references
- Transaction history

## Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: Server-side validation
- **CORS Protection**: Cross-origin request security
- **Payment Security**: Razorpay signature verification

## Deployment

### Backend Deployment
1. Set production environment variables
2. Configure MongoDB Atlas
3. Deploy to Heroku/Railway/DigitalOcean
4. Set up Cloudinary for media storage

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to Vercel/Netlify
3. Configure environment variables
4. Set up custom domain (optional)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**Built with ❤️ for educational excellence**#   C a r r e r P a t h  
 