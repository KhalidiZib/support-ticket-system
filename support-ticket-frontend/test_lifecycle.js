
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8085/support-api/api';

// Credentials
const ADMIN = { email: 'kzibika@gmail.com', password: 'K100921Z' };
const AGENT = { email: 'agent@example.com', password: 'agent123' };
const CUSTOMER = { email: 'customer@example.com', password: 'customer123' };

async function login(user) {
    try {
        const res = await axios.post(`${API_BASE_URL}/auth/login`, user);
        return res.data.token;
    } catch (error) {
        console.error(`[FAIL] Login failed for ${user.email}:`, error.message);
        return null;
    }
}

async function runTests() {
    console.log("=== STARTING LIFECYCLE DIAGNOSTIC ===");

    // 1. Login all roles
    const adminToken = await login(ADMIN);
    const agentToken = await login(AGENT);
    const customerToken = await login(CUSTOMER);

    if (!adminToken || !agentToken || !customerToken) {
        console.error("Stopping due to login failure.");
        return;
    }

    // 2. Setup: Create a test ticket as Customer
    let ticketId;
    try {
        const res = await axios.post(
            `${API_BASE_URL}/tickets`,
            {
                title: "Lifecycle Test Ticket",
                description: "Testing assignment and status flow.",
                priority: "MEDIUM",
                categoryId: 1, // Assuming General Inquiry
                locationId: 1  // Assuming Kigali
            },
            { headers: { Authorization: `Bearer ${customerToken}` } }
        );
        ticketId = res.data.id;
        console.log(`[PASS] Customer created ticket #${ticketId}`);
    } catch (error) {
        console.error(`[FAIL] Customer create ticket:`, error.response?.data || error.message);
        return;
    }

    // 3. Test: Admin Assigns Ticket to Agent
    // We need an agent ID. Let's assume the agent we logged in as has ID 2 (or fetch it).
    // For this test, we'll try to fetch the agent profile to get their ID.
    let agentId;
    try {
        const me = await axios.get(`${API_BASE_URL}/auth/me`, { headers: { Authorization: `Bearer ${agentToken}` } });
        agentId = me.data.id;
    } catch (e) {
        console.error("[FAIL] Could not get Agent ID");
        return;
    }

    try {
        console.log(`Debug: Assigning Ticket ${ticketId} to Agent ${agentId} using URL: ${API_BASE_URL}/tickets/${ticketId}/assign/${agentId}`);
        await axios.put(
            `${API_BASE_URL}/tickets/${ticketId}/assign/${agentId}`,
            {},
            { headers: { Authorization: `Bearer ${adminToken}` } }
        );
        console.log(`[PASS] Admin assigned ticket #${ticketId} to Agent #${agentId}`);
    } catch (error) {
        console.error(`[FAIL] Admin assign ticket:`, error.response?.data || error.message);
    }

    // 4. Test: Agent Updates Status to IN_PROGRESS
    try {
        await axios.put(
            `${API_BASE_URL}/tickets/${ticketId}/status?status=IN_PROGRESS`,
            {},
            { headers: { Authorization: `Bearer ${agentToken}` } }
        );
        console.log(`[PASS] Agent updated status to IN_PROGRESS`);
    } catch (error) {
        console.error(`[FAIL] Agent update status:`, error.response?.data || error.message);
    }

    // 5. Test: Customer Tries to Update Status (Should Fail)
    try {
        await axios.put(
            `${API_BASE_URL}/tickets/${ticketId}/status?status=CLOSED`,
            {},
            { headers: { Authorization: `Bearer ${customerToken}` } }
        );
        console.error(`[FAIL] Customer was able to update status (Security Hole!)`);
    } catch (error) {
        if (error.response?.status === 403 || error.response?.status === 401) {
            console.log(`[PASS] Customer blocked from updating status (403/401)`);
        } else {
            console.error(`[FAIL] Unexpected error for customer update:`, error.message);
        }
    }

    // 6. Test: Customer Tries to Assign Agent (Should Fail)
    try {
        await axios.put(
            `${API_BASE_URL}/tickets/${ticketId}/assign/${agentId}`,
            {},
            { headers: { Authorization: `Bearer ${customerToken}` } }
        );
        console.error(`[FAIL] Customer was able to assign agent (Security Hole!)`);
    } catch (error) {
        if (error.response?.status === 403 || error.response?.status === 401) {
            console.log(`[PASS] Customer blocked from assigning agent (403/401)`);
        } else {
            console.error(`[FAIL] Unexpected error for customer assign:`, error.message);
        }
    }

    console.log("=== DIAGNOSTIC COMPLETE ===");
}

runTests();
