const nodemailer = require('nodemailer');
require('dotenv').config();

const testEmailCredentials = async () => {
    console.log('🔍 Testing email credentials...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***hidden***' : 'NOT SET');

    try {
        // Configure nodemailer with your credentials
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Verify the connection
        console.log('📧 Verifying email connection...');
        await transporter.verify();
        console.log('✅ Email connection verified successfully!');

        // Send a test email
        console.log('📤 Sending test email...');
        const testEmail = {
            from: process.env.EMAIL_USER,
            to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
            subject: 'Test Email - Career Pathway Institute',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #0B1F33 0%, #1E3A8A 100%); padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">Career Pathway Institute</h1>
                        <p style="color: white; margin: 5px 0 0 0;">Email Configuration Test</p>
                    </div>
                    
                    <div style="padding: 30px; background-color: #f9f9f9;">
                        <h2 style="color: #333;">Email Test Successful! 🎉</h2>
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            This is a test email to verify that your email configuration is working correctly.
                        </p>
                        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <p><strong>Configuration Details:</strong></p>
                            <p>Email Service: Gmail</p>
                            <p>From: ${process.env.EMAIL_USER}</p>
                            <p>To: ${process.env.CONTACT_EMAIL || process.env.EMAIL_USER}</p>
                            <p>Timestamp: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                        </div>
                        <p style="color: #666;">
                            If you received this email, your contact form should now work properly!
                        </p>
                    </div>
                </div>
            `
        };

        const result = await transporter.sendMail(testEmail);
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', result.messageId);

        return true;
    } catch (error) {
        console.error('❌ Email test failed:', error.message);

        if (error.code === 'EAUTH') {
            console.log('\n🔧 Authentication failed. Please check:');
            console.log('1. Email address is correct');
            console.log('2. App password is correct (no spaces)');
            console.log('3. 2-factor authentication is enabled on Gmail');
            console.log('4. App password was generated correctly');
        }

        return false;
    }
};

testEmailCredentials();