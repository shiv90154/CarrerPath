const nodemailer = require('nodemailer');
require('dotenv').config();

const debugEmail = async () => {
    console.log('🔍 Debugging Email Configuration...\n');

    console.log('📧 Environment Variables:');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'Not set');
    console.log('');

    try {
        console.log('🔧 Creating transporter...');
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            debug: true, // Enable debug output
            logger: true // Log to console
        });

        console.log('✅ Transporter created');

        console.log('\n🔍 Verifying connection...');

        // Set a timeout for the verification
        const verifyPromise = transporter.verify();
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Verification timeout after 10 seconds')), 10000)
        );

        await Promise.race([verifyPromise, timeoutPromise]);

        console.log('✅ Email connection verified successfully!');

        // Try sending a test email
        console.log('\n📤 Sending test email...');

        const testEmail = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to self
            subject: 'Test Email - Registration System',
            text: 'This is a test email from the registration system.',
            html: '<h1>Test Email</h1><p>This is a test email from the registration system.</p>'
        };

        const sendPromise = transporter.sendMail(testEmail);
        const sendTimeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Send timeout after 15 seconds')), 15000)
        );

        const result = await Promise.race([sendPromise, sendTimeoutPromise]);

        console.log('✅ Test email sent successfully!');
        console.log('   Message ID:', result.messageId);

    } catch (error) {
        console.error('❌ Email configuration error:');
        console.error('   Error code:', error.code);
        console.error('   Error message:', error.message);

        if (error.code === 'EAUTH') {
            console.log('\n💡 Authentication Error Solutions:');
            console.log('1. Make sure 2-factor authentication is enabled on Gmail');
            console.log('2. Generate a new App Password:');
            console.log('   - Go to Google Account settings');
            console.log('   - Security > 2-Step Verification > App passwords');
            console.log('   - Generate password for "Mail"');
            console.log('   - Use the 16-character password (no spaces)');
            console.log('3. Update EMAIL_PASS in your .env file');
        } else if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
            console.log('\n💡 Timeout Error Solutions:');
            console.log('1. Check your internet connection');
            console.log('2. Try again in a few minutes');
            console.log('3. Check if Gmail SMTP is accessible from your network');
        } else {
            console.log('\n💡 General Solutions:');
            console.log('1. Verify EMAIL_USER is a valid Gmail address');
            console.log('2. Verify EMAIL_PASS is the correct App Password');
            console.log('3. Check firewall/antivirus settings');
        }
    }
};

debugEmail();