const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const videoRoutes = require('./routes/videoRoutes');
const studentRoutes = require('./routes/studentRoutes');
const testSeriesRoutes = require('./routes/testSeriesRoutes');
const ebookRoutes = require('./routes/ebookRoutes');
const liveTestRoutes = require('./routes/liveTestRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const resultRoutes = require('./routes/resultRoutes'); // New line
const studyMaterialRoutes = require('./routes/studyMaterialRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminVideoRoutes = require('./routes/adminVideoRoutes');
const contactRoutes = require('./routes/contactRoutes');
// Add after other routes
const currentAffairRoutes = require('./routes/currentAffairRoutes');
const emailRoutes = require('./routes/emailRoutes');

const cors = require('cors');

dotenv.config();

connectDB();

const app = express();

app.use(express.json()); // To accept JSON data
app.use(cors());

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api/users', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/testseries', testSeriesRoutes);
app.use('/api/ebooks', ebookRoutes);
app.use('/api/livetests', liveTestRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/current-affairs', currentAffairRoutes);
app.use('/api/studymaterials', studyMaterialRoutes);
app.use('/api/notices', require('./routes/noticeRoutes'));
app.use('/api/admin', adminRoutes);
app.use('/api/admin/videos', adminVideoRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/email', emailRoutes);

// Error Handling Middleware
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));

