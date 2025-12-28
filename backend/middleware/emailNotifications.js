const emailService = require('../utils/emailService');
const User = require('../models/User');

// Middleware to send email notifications after specific actions
const emailNotifications = {
    // Send welcome email after user registration
    afterUserRegistration: async (req, res, next) => {
        try {
            if (res.locals.newUser) {
                const { name, email } = res.locals.newUser;

                // Send welcome email to user
                await emailService.sendWelcomeEmail(email, name);

                // Send admin notification
                const registrationDate = new Date().toLocaleDateString();
                await emailService.sendAdminNewUserNotification(name, email, registrationDate);
            }
            next();
        } catch (error) {
            console.error('Email notification error:', error);
            // Don't block the response if email fails
            next();
        }
    },

    // Send course enrollment confirmation
    afterCourseEnrollment: async (req, res, next) => {
        try {
            if (res.locals.enrollment) {
                const { user, course } = res.locals.enrollment;
                const startDate = course.startDate ? new Date(course.startDate).toLocaleDateString() : 'Immediately';

                await emailService.sendEnrollmentConfirmation(
                    user.email,
                    user.name,
                    course.title,
                    startDate
                );
            }
            next();
        } catch (error) {
            console.error('Enrollment email notification error:', error);
            next();
        }
    },

    // Send payment confirmation
    afterPaymentSuccess: async (req, res, next) => {
        try {
            if (res.locals.payment) {
                const { user, amount, course, transactionId } = res.locals.payment;

                await emailService.sendPaymentConfirmation(
                    user.email,
                    user.name,
                    amount,
                    course.title,
                    transactionId
                );
            }
            next();
        } catch (error) {
            console.error('Payment email notification error:', error);
            next();
        }
    },

    // Send test completion notification
    afterTestCompletion: async (req, res, next) => {
        try {
            if (res.locals.testResult) {
                const { user, test, score, totalQuestions } = res.locals.testResult;

                await emailService.sendTestCompletionNotification(
                    user.email,
                    user.name,
                    test.title,
                    score,
                    totalQuestions
                );
            }
            next();
        } catch (error) {
            console.error('Test completion email notification error:', error);
            next();
        }
    },

    // Send course completion certificate
    afterCourseCompletion: async (req, res, next) => {
        try {
            if (res.locals.courseCompletion) {
                const { user, course, certificateUrl } = res.locals.courseCompletion;
                const completionDate = new Date().toLocaleDateString();

                await emailService.sendCourseCompletionCertificate(
                    user.email,
                    user.name,
                    course.title,
                    completionDate,
                    certificateUrl
                );
            }
            next();
        } catch (error) {
            console.error('Course completion email notification error:', error);
            next();
        }
    },

    // Notify all users about new course
    notifyNewCourse: async (courseData) => {
        try {
            // Get all active user emails
            const users = await User.find({ isActive: true }, 'email');
            const userEmails = users.map(user => user.email);

            if (userEmails.length > 0) {
                await emailService.sendNewCourseNotification(
                    userEmails,
                    courseData.title,
                    courseData.description,
                    courseData.instructor
                );
            }

            return { success: true, notifiedUsers: userEmails.length };
        } catch (error) {
            console.error('New course notification error:', error);
            return { success: false, error: error.message };
        }
    },

    // Notify all users about new test series
    notifyNewTestSeries: async (testSeriesData) => {
        try {
            // Get all active user emails
            const users = await User.find({ isActive: true }, 'email');
            const userEmails = users.map(user => user.email);

            if (userEmails.length > 0) {
                await emailService.sendNewTestSeriesNotification(
                    userEmails,
                    testSeriesData.title,
                    testSeriesData.testCount || 10,
                    testSeriesData.duration || 60
                );
            }

            return { success: true, notifiedUsers: userEmails.length };
        } catch (error) {
            console.error('New test series notification error:', error);
            return { success: false, error: error.message };
        }
    },

    // Send bulk announcement to all users
    sendAnnouncement: async (subject, message, targetUsers = 'all') => {
        try {
            let users;

            if (targetUsers === 'all') {
                users = await User.find({ isActive: true }, 'email');
            } else if (Array.isArray(targetUsers)) {
                users = await User.find({ email: { $in: targetUsers }, isActive: true }, 'email');
            } else {
                throw new Error('Invalid target users parameter');
            }

            const userEmails = users.map(user => user.email);

            if (userEmails.length > 0) {
                // Create announcement template
                const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">📢 Announcement</h1>
            </div>
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <div style="color: #333; line-height: 1.6; font-size: 16px;">
                ${message}
              </div>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" 
                   style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                  Visit Dashboard 🚀
                </a>
              </div>
              <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
                Career Pathway Institute - Empowering Your Future
              </p>
            </div>
          </div>
        `;

                await emailService.sendBulkEmail(userEmails, subject, htmlContent);
            }

            return { success: true, notifiedUsers: userEmails.length };
        } catch (error) {
            console.error('Announcement email error:', error);
            return { success: false, error: error.message };
        }
    }
};

module.exports = emailNotifications;