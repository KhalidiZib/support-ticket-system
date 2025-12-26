import axios from 'axios';

(async () => {
    try {
        console.log('Attemping Login...');
        const res = await axios.post('http://localhost:8085/support-api/api/auth/login', {
            email: 'customer@example.com',
            password: 'customer123'
        });
        console.log('Login Success. Token:', res.data.token.substring(0, 20) + '...');

        // Now try dashboard
        const token = res.data.token;
        console.log('Attemping Dashboard Access with Token:', token);

        try {
            const res2 = await axios.get('http://localhost:8085/support-api/api/dashboard/customer', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Dashboard Success:', res2.data);
        } catch (e) {
            console.error('Dashboard Error:', e.response ? e.response.status : e.message);
            console.error('Dashboard Data:', e.response ? e.response.data : '');
        }

    } catch (e) {
        console.error('Login Error:', e.response ? e.response.status : e.message);
        if (e.response && e.response.data) {
            console.error('Login Response Data:', JSON.stringify(e.response.data, null, 2));
        }
    }
})();
