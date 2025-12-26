
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8085/support-api/api';

// Admin Token or valid token needed. Using the one from previous test if valid, orlogin fresh.
// I will login as admin to ensure I have access to everything.
const LOGIN_URL = `${API_BASE_URL}/auth/login`;

async function testSearch() {
    try {
        console.log('1. Logging in as Admin...');
        // Assuming admin credentials from DataLoader or known
        // 'kzibika@gmail.com' / 'K100921Z'
        const loginRes = await axios.post(LOGIN_URL, {
            email: 'kzibika@gmail.com',
            password: 'K100921Z'
        });
        const token = loginRes.data.token;
        console.log('   Stats: Login Success.');

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        // 2. Test Ticket Search
        console.log('\n2. Testing Ticket Search (/tickets/search?query=network)...');
        try {
            const ticketRes = await axios.get(`${API_BASE_URL}/tickets/search?query=network`, config);
            console.log(`   [PASS] Status: ${ticketRes.status}, Results: ${ticketRes.data.length}`);
        } catch (e) {
            console.log(`   [FAIL] Ticket Search: ${e.response ? e.response.status : e.message}`);
        }

        // 3. Test User Search
        console.log('\n3. Testing User Search (/users/search?query=admin)...');
        try {
            const userRes = await axios.get(`${API_BASE_URL}/users/search?query=admin`, config);
            console.log(`   [PASS] Status: ${userRes.status}, Results: ${userRes.data.length}`);
        } catch (e) {
            console.log(`   [FAIL] User Search: ${e.response ? e.response.status : e.message}`);
        }

        // 4. Test Category Search
        console.log('\n4. Testing Category Search (/categories/search?query=network)...');
        try {
            const catRes = await axios.get(`${API_BASE_URL}/categories/search?query=network`, config);
            console.log(`   [PASS] Status: ${catRes.status}, Results: ${catRes.data.length}`);
        } catch (e) {
            console.log(`   [FAIL] Category Search: ${e.response ? e.response.status : e.message}`);
        }

        // 5. Test Location Search
        console.log('\n5. Testing Location Search (/locations/search?query=kigali)...');
        try {
            const locRes = await axios.get(`${API_BASE_URL}/locations/search?query=kigali`, config);
            console.log(`   [PASS] Status: ${locRes.status}, Results: ${locRes.data.length}`);
        } catch (e) {
            console.log(`   [FAIL] Location Search: ${e.response ? e.response.status : e.message}`);
        }

        // 6. Test Global Search
        console.log('\n6. Testing Global Search (/search)...');
        try {
            const globalRes = await axios.post(`${API_BASE_URL}/search`, {
                query: 'network',
                entityType: 'all',
                page: 0,
                size: 10
            }, config);
            console.log(`   [PASS] Status: ${globalRes.status}`);
        } catch (e) {
            console.log(`   [FAIL] Global Search: ${e.response ? e.response.status : e.message}`);
        }

    } catch (e) {
        console.error('CRITICAL: Login Failed', e.response ? e.response.data : e.message);
    }
}

testSearch();
