const axios = require('axios');

const testContactForm = async () => {
    try {
        console.log('Testing contact form...');

        const response = await axios.post('https://carrerpath-m48v.onrender.com/api/contact/send-message', {
            name: 'Test User',
            email: 'test@example.com',
            phone: '+91 9876543210',
            subject: 'Test Contact Form',
            message: 'This is a test message to verify that the contact form is working properly and emails are being sent.',
            category: 'general'
        });

        console.log('✅ Contact form test successful!');
        console.log('Response:', response.data);

    } catch (error) {
        console.log('❌ Contact form test failed!');
        console.log('Error:', error.response?.data || error.message);
    }
};

testContactForm();