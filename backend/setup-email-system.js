const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Email System for Career Pathway Institute...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found!');
    console.log('📋 Please create a .env file based on .env.example\n');

    if (fs.existsSync(envExamplePath)) {
        console.log('📄 .env.example content:');
        console.log(fs.readFileSync(envExamplePath, 'utf8'));
    }
    process.exit(1);
}

// Read .env file
const envContent = fs.readFileSync(envPath, 'utf8');

// Check required email variables
const requiredVars = [
    'EMAIL_USER',
    'EMAIL_PASS',
    'CONTACT_EMAIL'
];

const missingVars = [];
const presentVars = [];

requiredVars.forEach(varName => {
    if (envContent.includes(`${varName}=`) && !envContent.includes(`${varName}=your_`)) {
        presentVars.push(varName);
    } else {
        missingVars.push(varName);
    }
});

console.log('📧 Email Configuration Check:');
console.log('================================');

presentVars.forEach(varName => {
    console.log(`✅ ${varName}: Configured`);
});

missingVars.forEach(varName => {
    console.log(`❌ ${varName}: Missing or using placeholder`);
});

if (missingVars.length > 0) {
    console.log('\n🔧 Setup Instructions:');
    console.log('======================');

    if (missingVars.includes('EMAIL_USER')) {
        console.log('1. EMAIL_USER: Set to your Gmail address (e.g., yourname@gmail.com)');
    }

    if (missingVars.includes('EMAIL_PASS')) {
        console.log('2. EMAIL_PASS: Set to your Gmail App Password');
        console.log('   - Enable 2-factor authentication on Gmail');
        console.log('   - Go to Google Account > Security > App passwords');
        console.log('   - Generate app password for "Mail"');
        console.log('   - Use the generated 16-character password');
    }

    if (missingVars.includes('CONTACT_EMAIL')) {
        console.log('3. CONTACT_EMAIL: Set to admin email for notifications');
    }

    console.log('\n📝 Example configuration:');
    console.log('EMAIL_USER=yourname@gmail.com');
    console.log('EMAIL_PASS=abcd efgh ijkl mnop');
    console.log('CONTACT_EMAIL=admin@yoursite.com');
    console.log('FRONTEND_URL=http://localhost:3000');

} else {
    console.log('\n✅ All email variables are configured!');

    console.log('\n🧪 Next Steps:');
    console.log('==============');
    console.log('1. Test the email system:');
    console.log('   node backend/test-email-system.js');
    console.log('');
    console.log('2. Start your server:');
    console.log('   npm run dev');
    console.log('');
    console.log('3. Test email endpoints:');
    console.log('   POST /api/email/test (Admin only)');
    console.log('   POST /api/email/announcement (Admin only)');
    console.log('');
    console.log('4. Check automatic emails:');
    console.log('   - Register a new user → Welcome email');
    console.log('   - Create a course → Course notification');
    console.log('   - Make a payment → Payment confirmation');
}

console.log('\n📚 Documentation:');
console.log('==================');
console.log('📖 Full documentation: EMAIL_SYSTEM_DOCUMENTATION.md');
console.log('🔧 Email service: backend/utils/emailService.js');
console.log('🛠️ Email routes: backend/routes/emailRoutes.js');
console.log('📧 Email middleware: backend/middleware/emailNotifications.js');

console.log('\n🎯 Email Templates Available:');
console.log('==============================');
const templates = [
    '📧 Welcome Email',
    '📚 New Course Notification',
    '📝 New Test Series Notification',
    '✅ Course Enrollment Confirmation',
    '💳 Payment Confirmation',
    '🎯 Test Completion Notification',
    '🏆 Course Completion Certificate',
    '🔐 Password Reset Email',
    '👤 Admin New User Notification',
    '📢 Bulk Announcements'
];

templates.forEach(template => {
    console.log(`  ${template}`);
});

console.log('\n🚀 Email System Setup Complete!');

if (missingVars.length > 0) {
    console.log('⚠️  Please configure missing variables and run this script again.');
    process.exit(1);
} else {
    console.log('✅ Ready to send beautiful emails!');
    process.exit(0);
}