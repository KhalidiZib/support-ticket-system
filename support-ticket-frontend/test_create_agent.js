
import axios from 'axios';

const BASE_URL = 'http://localhost:8085/support-api/api';
let token = '';

async function run() {
    try {
        console.log("--- Agent Creation Diagnosis ---");

        // 1. Login
        console.log("1. Logging in...");
        try {
            const loginResp = await axios.post(`${BASE_URL}/auth/login`, {
                email: 'kzibika@gmail.com',
                password: 'Password123!'
            });
            token = loginResp.data.token;
            console.log("   Login Success! Token obtained.");
        } catch (e) {
            console.log("   Default password failed, trying K100921Z...");
            try {
                const loginResp = await axios.post(`${BASE_URL}/auth/login`, {
                    email: 'kzibika@gmail.com',
                    password: 'K100921Z'
                });
                token = loginResp.data.token;
                console.log("   Login Success with K100921Z!");
            } catch (e2) {
                console.error("   LOGIN FAILED:", e2.message);
                return;
            }
        }

        const authHeader = { headers: { Authorization: `Bearer ${token}` } };

        // 2. Create Agent
        console.log("\n2. Creating Agent 'Agent Script'...");
        const agentData = {
            fullName: "Agent Script",
            email: `agentscript_${Date.now()}@test.com`,
            password: "password123"
        };

        try {
            const createResp = await axios.post(`${BASE_URL}/auth/register-agent`, agentData, authHeader);
            console.log("   Creation Response:", createResp.status, createResp.data);
        } catch (e) {
            console.error("   Creation FAILED:", e.response?.status, e.response?.data);
        }

        // 3. List Agents (GET /users?role=AGENT) - Testing the fix
        console.log("\n3. Verifying Agents List (GET /users?role=AGENT)...");
        try {
            const listResp = await axios.get(`${BASE_URL}/users?role=AGENT`, authHeader);
            console.log(`   Found ${listResp.data.length} agents.`);
            listResp.data.forEach(a => console.log(`   - [${a.id}] ${a.name} (${a.email})`));
        } catch (e) {
            console.error("   Listing FAILED:", e.response?.status, e.response?.data);
        }

    } catch (err) {
        console.error("FATAL ERROR:", err.message);
        if (err.response) console.error("Response:", err.response.data);
    }
}

run();
