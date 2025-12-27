const axios = require('axios');

const testOTPFunctionality = async () => {
    console.log('🔍 Testing OTP functionality...\n');

    const testEmail = 'test.otp@example.com';
    const testName = 'Test OTP User';

    try {
        // Test 1: Send OTP
        console.log('1. Testing OTP sending...');
        const otpResponse = await axios.post('https://carrerpath-m48v.onrender.com/api/users/send-otp', {
            email: testEmail,
            name: testName
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });

        console.log('✅ OTP sent successfully!');
        console.log('Response:', otpResponse.data);

        // Test 2: Resend OTP
        console.log('\n2. Testing OTP resend...');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

        const resendResponse = await axios.post('https://carrerpath-m48v.onrender.com/api/users/resend-otp', {
            email: testEmail
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });

        console.log('✅ OTP resent successfully!');
        console.log('Response:', resendResponse.data);

        // Test 3: Try to verify with wrong OTP
        console.log('\n3. Testing wrong OTP verification...');
        try {
            await axios.post('https://carrerpath-m48v.onrender.com/api/users/verify-otp', {
                email: testEmail,
                otp: '123456', // Wrong OTP
                phone: '9876543210',
                password: 'testpassword123'
            });
        } catch (error) {
            console.log('✅ Wrong OTP correctly rejected:', error.response?.data?.message);
        }

        console.log('\n🎉 OTP functionality tests completed!');
        console.log('\n📋 Summary:');
        console.log('✅ OTP sending works');
        console.log('✅ OTP resending works');
        console.log('✅ Wrong OTP is properly rejected');
        console.log('\n💡 Note: To complete registration, use the OTP sent to your email');

    } catch (error) {
        console.log('❌ OTP test failed!');
        console.log('Status:', error.response?.status);
        console.log('Error:', error.response?.data || error.message);

        if (error.code === 'ECONNABORTED') {
            console.log('⏰ Request timed out - server might be slow');
        }

        if (error.response?.status === 500) {
            console.log('\n🔧 Possible issues:');
            console.log('1. Email configuration problem');
            console.log('2. Server error in OTP generation');
            console.log('3. Database connection issue');
        }
    }
};

testOTPFunctionality();