const axios = require('axios');

const testContactDirect = async () => {
    console.log('🔍 Testing contact form endpoint directly...');

    try {
        const response = await axios.post('https://carrerpath-m48v.onrender.com/api/contact/send-message', {
            name: 'Test User',
            email: 'test@example.com',
            phone: '+91 9876543210',
            subject: 'Test Contact Form - Direct',
            message: 'This is a direct test of the contact form to verify email functionality is working properly.',
            category: 'general'
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 second timeout
        });

        console.log('✅ Contact form test successful!');
        console.log('Response:', response.data);

    } catch (error) {
        console.log('❌ Contact form test failed!');
        console.log('Status:', error.response?.status);
        console.log('Error:', error.response?.data || error.message);

        if (error.code === 'ECONNABORTED') {
            console.log('⏰ Request timed out - server might be slow');
        }
    }
};

testContactDirect();