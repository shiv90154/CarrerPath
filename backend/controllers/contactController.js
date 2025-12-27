const asyncHandler = require('express-async-handler');
const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// @desc    Send contact message
// @route   POST /api/contact/send-message
// @access  Public
const sendContactMessage = asyncHandler(async (req, res) => {
    const { name, email, phone, subject, message, category } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
        res.status(400);
        throw new Error('Please provide a valid email address');
    }

    if (message.length < 10) {
        res.status(400);
        throw new Error('Message must be at least 10 characters long');
    }

    // Category labels for better email formatting
    const categoryLabels = {
        general: 'General Inquiry',
        courses: 'Course Information',
        technical: 'Technical Support',
        billing: 'Billing & Payments',
        admission: 'Admission Process',
        feedback: 'Feedback & Suggestions'
    };

    const categoryLabel = categoryLabels[category] || 'General Inquiry';

    // Email to admin/support team
    const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
        subject: `[${categoryLabel}] ${subject}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">EduTech Institute</h1>
          <p style="color: white; margin: 5px 0 0 0;">New Contact Form Submission</p>
        </div>
        
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333; margin-bottom: 20px;">Contact Form Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Name:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Email:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">
                  <a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a>
                </td>
              </tr>
              ${phone ? `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Phone:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">
                  <a href="tel:${phone}" style="color: #667eea; text-decoration: none;">${phone}</a>
                </td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Category:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">${categoryLabel}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Subject:</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; color: #333;">${subject}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #555; vertical-align: top;">Message:</td>
                <td style="padding: 10px; color: #333; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 4px solid #2196f3;">
            <p style="margin: 0; color: #1565c0; font-size: 14px;">
              <strong>Action Required:</strong> Please respond to this inquiry within 24 hours.
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              This message was sent from the EduTech Institute contact form.<br>
              Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
            </p>
          </div>
        </div>
      </div>
    `
    };

    // Auto-reply email to user
    const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Thank you for contacting EduTech Institute - ${subject}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">EduTech Institute</h1>
          <p style="color: white; margin: 5px 0 0 0;">Thank You for Your Message</p>
        </div>
        
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Hello ${name}!</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Thank you for reaching out to EduTech Institute. We have received your message regarding 
            "<strong>${subject}</strong>" and our team will review it carefully.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
            <h3 style="color: #333; margin-top: 0;">What happens next?</h3>
            <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
              <li>Our support team will review your inquiry within 24 hours</li>
              <li>You'll receive a detailed response at <strong>${email}</strong></li>
              <li>For urgent matters, you can call us at <strong>+91 12345 67890</strong></li>
            </ul>
          </div>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #2e7d32; margin-top: 0;">Your Message Summary:</h4>
            <p style="color: #555; margin: 5px 0;"><strong>Category:</strong> ${categoryLabel}</p>
            <p style="color: #555; margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
            <p style="color: #555; margin: 5px 0;"><strong>Reference ID:</strong> #${Date.now().toString().slice(-8)}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:5173" 
               style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Visit Our Website
            </a>
          </div>
          
          <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #f57c00; margin-top: 0;">📚 While you wait, explore our resources:</h4>
            <ul style="color: #666; line-height: 1.6; padding-left: 20px;">
              <li><a href="http://localhost:5173/courses" style="color: #667eea;">Browse our courses</a></li>
              <li><a href="http://localhost:5173/test-series" style="color: #667eea;">Practice with test series</a></li>
              <li><a href="http://localhost:5173/e-books" style="color: #667eea;">Download e-books</a></li>
              <li><a href="http://localhost:5173/current-affairs" style="color: #667eea;">Stay updated with current affairs</a></li>
            </ul>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              This is an automated response. Please do not reply to this email.<br>
              For immediate assistance, contact us at <a href="mailto:support@edutech.com" style="color: #667eea;">support@edutech.com</a>
            </p>
          </div>
        </div>
      </div>
    `
    };

    try {
        // Send email to admin/support team
        await transporter.sendMail(adminMailOptions);

        // Send auto-reply to user
        await transporter.sendMail(userMailOptions);

        res.json({
            message: 'Message sent successfully! We will get back to you within 24 hours.',
            referenceId: `#${Date.now().toString().slice(-8)}`
        });
    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500);
        throw new Error('Failed to send message. Please try again or contact us directly.');
    }
});

// @desc    Get contact information
// @route   GET /api/contact/info
// @access  Public
const getContactInfo = asyncHandler(async (req, res) => {
    const contactInfo = {
        address: {
            street: '123 Education Street',
            area: 'Knowledge District',
            city: 'New Delhi',
            state: 'Delhi',
            pincode: '110001',
            country: 'India'
        },
        phone: ['+91 12345 67890', '+91 12345 67891'],
        email: ['info@edutech.com', 'support@edutech.com'],
        hours: {
            weekdays: 'Monday - Friday: 9:00 AM - 6:00 PM',
            saturday: 'Saturday: 10:00 AM - 4:00 PM',
            sunday: 'Sunday: Closed'
        },
        social: {
            facebook: 'https://facebook.com/edutech',
            twitter: 'https://twitter.com/edutech',
            instagram: 'https://instagram.com/edutech',
            linkedin: 'https://linkedin.com/company/edutech',
            youtube: 'https://youtube.com/edutech'
        },
        map: {
            latitude: 28.613939,
            longitude: 77.209027,
            embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.582274327718!2d77.20902731508236!3d28.613939282431586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd368f3e1c1d%3A0x8b8b8b8b8b8b8b8b!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1635789012345!5m2!1sen!2sin'
        }
    };

    res.json(contactInfo);
});

module.exports = {
    sendContactMessage,
    getContactInfo,
};