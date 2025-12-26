
import axios from 'axios';

const BASE_URL = 'http://localhost:8085/support-api/api';
let token = '';

async function run() {
    try {
        console.log("--- Comment API Diagnosis ---");

        // 1. Login
        console.log("1. Logging in...");
        try {
            const loginResp = await axios.post(`${BASE_URL}/auth/login`, {
                email: 'kzibika@gmail.com',
                password: 'Password123!'
            });
            token = loginResp.data.token;
            console.log("   Login Success!");
        } catch (e) {
            try {
                // Fallback
                const loginResp = await axios.post(`${BASE_URL}/auth/login`, {
                    email: 'kzibika@gmail.com',
                    password: 'K100921Z'
                });
                token = loginResp.data.token;
                console.log("   Login Success (fallback)!");
            } catch (e2) {
                console.error("   LOGIN FAILED:", e2.message);
                return;
            }
        }

        const authHeader = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Add Comment
        console.log("\n2. Adding Comment via POST /api/comments...");
        const payload = {
            ticketId: 6,
            content: "Diagnostic comment testing API."
        };

        try {
            const resp = await axios.post(`${BASE_URL}/comments`, payload, authHeader);
            console.log("   Success! Status:", resp.status);
            console.log("   Response:", resp.data);
        } catch (e) {
            console.error("   Comment Failed:", e.response?.status, e.response?.data);
        }

    } catch (err) {
        console.error("FATAL ERROR:", err.message);
    }
}

run();
