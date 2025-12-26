// Native fetch used.
const BASE_URL = 'http://127.0.0.1:8085/support-api';

async function run() {
    try {
        // 1. Admin Login
        console.log("Logging in Admin at " + BASE_URL + "...");
        const loginRes = await fetch(BASE_URL + '/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@example.com', password: 'password123' })
        });

        if (!loginRes.ok) throw new Error("Admin login failed: " + loginRes.status + " " + await loginRes.text());
        const adminData = await loginRes.json();
        const adminToken = adminData.token;
        console.log("Admin Token obtained.");

        // 2. Assign Ticket
        console.log("Assigning Ticket 7 to Agent 27...");
        // Path Variable: /api/tickets/7/assign/27
        const assignRes = await fetch(BASE_URL + '/api/tickets/7/assign/27', {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        console.log("Assignment Status:", assignRes.status);
        if (!assignRes.ok) console.log("Assignment Text:", await assignRes.text());

        // 3. Agent Login
        console.log("Logging in Agent...");
        const agentLoginRes = await fetch(BASE_URL + '/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'agent.user@example.com', password: 'password123' })
        });
        if (!agentLoginRes.ok) throw new Error("Agent login failed " + agentLoginRes.status);
        const agentData = await agentLoginRes.json();
        const agentToken = agentData.token;

        // 4. Check Agent Tickets
        console.log("Checking Agent Tickets...");
        const ticketsRes = await fetch(BASE_URL + '/api/tickets/assigned-tickets?page=0&size=10', {
            headers: { 'Authorization': `Bearer ${agentToken}` }
        });
        const ticketsData = await ticketsRes.json();
        console.log("Full JSON:", JSON.stringify(ticketsData, null, 2));
        console.log("Agent Tickets Found:", ticketsData.totalElements);
        if (ticketsData.content) {
            console.log("Ticket IDs:", ticketsData.content.map(t => t.id));
        }

    } catch (e) {
        console.error("Error:", e);
    }
}
run();
