const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email templates
const emailTemplates = {
  // Welcome email for new users
  welcomeUser: (userName, userEmail) => ({
    subject: '🎉 Welcome to Career Pathway Institute!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to CPI! 🚀</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName}! 👋</h2>
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            Welcome to Career Pathway Institute! We're thrilled to have you join our learning community.
          </p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">🎯 What's Next?</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>Explore our comprehensive course catalog</li>
              <li>Take practice tests to assess your skills</li>
              <li>Join live sessions and webinars</li>
              <li>Connect with fellow learners</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Start Learning Now! 📚
            </a>
          </div>
          <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
            Need help? Reply to this email or contact our support team.
          </p>
        </div>
      </div>
    `
  }),

  // New course notification
  newCourse: (courseName, courseDescription, instructorName) => ({
    subject: `🆕 New Course Alert: ${courseName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎓 New Course Available!</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">${courseName}</h2>
          <p style="color: #666; line-height: 1.6; font-size: 16px; margin-bottom: 20px;">
            ${courseDescription}
          </p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #333; margin: 0;"><strong>👨‍🏫 Instructor:</strong> ${instructorName}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/courses" 
               style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Enroll Now! 🚀
            </a>
          </div>
          <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
            Don't miss out on this opportunity to advance your career!
          </p>
        </div>
      </div>
    `
  }),

  // New test series notification
  newTestSeries: (testSeriesName, testCount, duration) => ({
    subject: `📝 New Test Series: ${testSeriesName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">📝 New Test Series!</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">${testSeriesName}</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: #333;"><strong>📊 Total Tests:</strong></span>
              <span style="color: #666;">${testCount}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #333;"><strong>⏱️ Duration:</strong></span>
              <span style="color: #666;">${duration} minutes each</span>
            </div>
          </div>
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            Challenge yourself with our latest test series and track your progress!
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/test-series" 
               style="background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Start Testing! 🎯
            </a>
          </div>
        </div>
      </div>
    `
  }),

  // Course enrollment confirmation
  courseEnrollment: (userName, courseName, startDate) => ({
    subject: `✅ Enrollment Confirmed: ${courseName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">✅ Enrollment Confirmed!</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Congratulations ${userName}! 🎉</h2>
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            You have successfully enrolled in <strong>${courseName}</strong>
          </p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #333; margin: 0;"><strong>📅 Course Starts:</strong> ${startDate}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/my-courses" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Access Course 📚
            </a>
          </div>
        </div>
      </div>
    `
  }),

  // Payment confirmation
  paymentConfirmation: (userName, amount, courseName, transactionId) => ({
    subject: `💳 Payment Confirmed - ${courseName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">💳 Payment Successful!</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Thank you ${userName}! 🙏</h2>
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            Your payment has been processed successfully.
          </p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <div style="margin-bottom: 10px;">
              <strong style="color: #333;">Course:</strong> <span style="color: #666;">${courseName}</span>
            </div>
            <div style="margin-bottom: 10px;">
              <strong style="color: #333;">Amount:</strong> <span style="color: #666;">₹${amount}</span>
            </div>
            <div>
              <strong style="color: #333;">Transaction ID:</strong> <span style="color: #666;">${transactionId}</span>
            </div>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/my-courses" 
               style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Start Learning! 🚀
            </a>
          </div>
        </div>
      </div>
    `
  }),

  // Test completion notification
  testCompletion: (userName, testName, score, totalQuestions) => ({
    subject: `📊 Test Results: ${testName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">📊 Test Completed!</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Great job ${userName}! 👏</h2>
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            You have completed <strong>${testName}</strong>
          </p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <div style="font-size: 48px; color: #6c5ce7; margin-bottom: 10px;">${score}/${totalQuestions}</div>
            <div style="color: #333; font-weight: bold;">Your Score</div>
            <div style="color: #666; margin-top: 10px;">${Math.round((score / totalQuestions) * 100)}% Accuracy</div>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/test-results" 
               style="background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              View Detailed Results 📈
            </a>
          </div>
        </div>
      </div>
    `
  }),

  // Course completion certificate
  courseCompletion: (userName, courseName, completionDate, certificateUrl) => ({
    subject: `🏆 Certificate Earned: ${courseName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🏆 Congratulations!</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Certificate Earned! 🎓</h2>
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            Congratulations ${userName}! You have successfully completed <strong>${courseName}</strong>
          </p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #333; margin: 0;"><strong>📅 Completion Date:</strong> ${completionDate}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${certificateUrl}" 
               style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Download Certificate 📜
            </a>
          </div>
        </div>
      </div>
    `
  }),

  // Password reset
  passwordReset: (userName, resetUrl) => ({
    subject: '🔐 Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #ff7675 0%, #fd79a8 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Password Reset</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName}!</h2>
          <p style="color: #666; line-height: 1.6; font-size: 16px;">
            We received a request to reset your password. Click the button below to create a new password.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #ff7675 0%, #fd79a8 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Reset Password 🔑
            </a>
          </div>
          <p style="color: #999; font-size: 14px; text-align: center;">
            If you didn't request this, please ignore this email. The link will expire in 1 hour.
          </p>
        </div>
      </div>
    `
  }),

  // Admin notification for new user registration
  adminNewUser: (userName, userEmail, registrationDate) => ({
    subject: `👤 New User Registration: ${userName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #2d3436 0%, #636e72 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">👤 New User Alert</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">New Registration!</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <div style="margin-bottom: 10px;">
              <strong style="color: #333;">Name:</strong> <span style="color: #666;">${userName}</span>
            </div>
            <div style="margin-bottom: 10px;">
              <strong style="color: #333;">Email:</strong> <span style="color: #666;">${userEmail}</span>
            </div>
            <div>
              <strong style="color: #333;">Registration Date:</strong> <span style="color: #666;">${registrationDate}</span>
            </div>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/users" 
               style="background: linear-gradient(135deg, #2d3436 0%, #636e72 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              View User Details 👥
            </a>
          </div>
        </div>
      </div>
    `
  })
};

// Email service functions
const emailService = {
  // Send welcome email to new users
  sendWelcomeEmail: async (userEmail, userName) => {
    try {
      const transporter = createTransporter();
      const template = emailTemplates.welcomeUser(userName, userEmail);

      await transporter.sendMail({
        from: `"Career Pathway Institute" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: template.subject,
        html: template.html
      });

      // Welcome email sent successfully
      return { success: true, message: 'Welcome email sent successfully' };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
    }
  },

  // Send new course notification to all users
  sendNewCourseNotification: async (userEmails, courseName, courseDescription, instructorName) => {
    try {
      const transporter = createTransporter();
      const template = emailTemplates.newCourse(courseName, courseDescription, instructorName);

      const emailPromises = userEmails.map(email =>
        transporter.sendMail({
          from: `"Career Pathway Institute" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: template.subject,
          html: template.html
        })
      );

      await Promise.all(emailPromises);
      // Course notification sent successfully
      return { success: true, message: 'Course notification sent successfully' };
    } catch (error) {
      console.error('Error sending course notification:', error);
      return { success: false, error: error.message };
    }
  },

  // Send new test series notification
  sendNewTestSeriesNotification: async (userEmails, testSeriesName, testCount, duration) => {
    try {
      const transporter = createTransporter();
      const template = emailTemplates.newTestSeries(testSeriesName, testCount, duration);

      const emailPromises = userEmails.map(email =>
        transporter.sendMail({
          from: `"Career Pathway Institute" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: template.subject,
          html: template.html
        })
      );

      await Promise.all(emailPromises);
      // Test series notification sent successfully
      return { success: true, message: 'Test series notification sent successfully' };
    } catch (error) {
      console.error('Error sending test series notification:', error);
      return { success: false, error: error.message };
    }
  },

  // Send course enrollment confirmation
  sendEnrollmentConfirmation: async (userEmail, userName, courseName, startDate) => {
    try {
      const transporter = createTransporter();
      const template = emailTemplates.courseEnrollment(userName, courseName, startDate);

      await transporter.sendMail({
        from: `"Career Pathway Institute" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: template.subject,
        html: template.html
      });

      // Enrollment confirmation sent successfully
      return { success: true, message: 'Enrollment confirmation sent successfully' };
    } catch (error) {
      console.error('Error sending enrollment confirmation:', error);
      return { success: false, error: error.message };
    }
  },

  // Send payment confirmation
  sendPaymentConfirmation: async (userEmail, userName, amount, courseName, transactionId) => {
    try {
      const transporter = createTransporter();
      const template = emailTemplates.paymentConfirmation(userName, amount, courseName, transactionId);

      await transporter.sendMail({
        from: `"Career Pathway Institute" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: template.subject,
        html: template.html
      });

      // Payment confirmation sent successfully
      return { success: true, message: 'Payment confirmation sent successfully' };
    } catch (error) {
      console.error('Error sending payment confirmation:', error);
      return { success: false, error: error.message };
    }
  },

  // Send test completion notification
  sendTestCompletionNotification: async (userEmail, userName, testName, score, totalQuestions) => {
    try {
      const transporter = createTransporter();
      const template = emailTemplates.testCompletion(userName, testName, score, totalQuestions);

      await transporter.sendMail({
        from: `"Career Pathway Institute" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: template.subject,
        html: template.html
      });

      // Test completion notification sent successfully
      return { success: true, message: 'Test completion notification sent successfully' };
    } catch (error) {
      console.error('Error sending test completion notification:', error);
      return { success: false, error: error.message };
    }
  },

  // Send course completion certificate
  sendCourseCompletionCertificate: async (userEmail, userName, courseName, completionDate, certificateUrl) => {
    try {
      const transporter = createTransporter();
      const template = emailTemplates.courseCompletion(userName, courseName, completionDate, certificateUrl);

      await transporter.sendMail({
        from: `"Career Pathway Institute" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: template.subject,
        html: template.html
      });

      // Course completion certificate sent successfully
      return { success: true, message: 'Course completion certificate sent successfully' };
    } catch (error) {
      console.error('Error sending course completion certificate:', error);
      return { success: false, error: error.message };
    }
  },

  // Send password reset email
  sendPasswordResetEmail: async (userEmail, userName, resetUrl) => {
    try {
      const transporter = createTransporter();
      const template = emailTemplates.passwordReset(userName, resetUrl);

      await transporter.sendMail({
        from: `"Career Pathway Institute" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: template.subject,
        html: template.html
      });

      // Password reset email sent successfully
      return { success: true, message: 'Password reset email sent successfully' };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error: error.message };
    }
  },

  // Send admin notification for new user registration
  sendAdminNewUserNotification: async (userName, userEmail, registrationDate) => {
    try {
      const transporter = createTransporter();
      const template = emailTemplates.adminNewUser(userName, userEmail, registrationDate);
      const adminEmail = process.env.CONTACT_EMAIL || process.env.EMAIL_USER;

      await transporter.sendMail({
        from: `"Career Pathway Institute" <${process.env.EMAIL_USER}>`,
        to: adminEmail,
        subject: template.subject,
        html: template.html
      });

      // Admin notification sent successfully
      return { success: true, message: 'Admin notification sent successfully' };
    } catch (error) {
      console.error('Error sending admin notification:', error);
      return { success: false, error: error.message };
    }
  },

  // Bulk email sender for announcements
  sendBulkEmail: async (userEmails, subject, htmlContent) => {
    try {
      const transporter = createTransporter();

      const emailPromises = userEmails.map(email =>
        transporter.sendMail({
          from: `"Career Pathway Institute" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: subject,
          html: htmlContent
        })
      );

      await Promise.all(emailPromises);
      // Bulk email sent successfully
      return { success: true, message: 'Bulk email sent successfully' };
    } catch (error) {
      console.error('Error sending bulk email:', error);
      return { success: false, error: error.message };
    }
  }
};

module.exports = emailService;