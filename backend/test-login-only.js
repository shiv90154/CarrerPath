const axios = require('axios');

const testLogin = async () => {
    try {
        console.log('Testing login endpoint...');

        const response = await axios.post('http://localhost:5000/api/users/login', {
            email: 'testadmin@example.com',
            password: 'testadmin123'
        });

        console.log('Login successful!');
        console.log('Response:', response.data);

    } catch (error) {
        console.log('Login failed!');
        console.log('Status:', error.response?.status);
        console.log('Error:', error.response?.data);
        console.log('Full error:', error.message);
    }
};

testLogin();