// Native fetch used in Node 18+

const API_URL = "http://localhost:8085/support-api/api";

async function run() {
    console.log("=== STARTING TICKET ACCESS VERIFICATION ===");

    // 1. Credentials
    const adminCreds = { email: "kzibika@gmail.com", password: "K100921Z" };
    const agentCreds = { email: "agent@example.com", password: "agent123" };
    const customerCreds = { email: "customer@example.com", password: "customer123" };

    try {
        // 2. Login All
        const adminAuth = await login(adminCreds, "ADMIN");
        const agentAuth = await login(agentCreds, "AGENT");
        const customerAuth = await login(customerCreds, "CUSTOMER");

        if (!adminAuth || !agentAuth || !customerAuth) {
            console.error("FAILED to login one or more users. Aborting.");
            return;
        }

        const adminToken = adminAuth.token;
        const agentToken = agentAuth.token;
        const agentId = agentAuth.id;
        const customerToken = customerAuth.token;

        if (!adminToken || !agentToken || !customerToken) {
            console.error("FAILED to login one or more users. Aborting.");
            return;
        }

        // 3. Create Ticket as Customer
        console.log("\n--- Creating Ticket (Customer) ---");
        const ticketData = {
            title: "Access Test Ticket " + Date.now(),
            description: "Testing who can view this.",
            priority: "MEDIUM",
            categoryId: 1,
            locationId: 1
        };

        const createRes = await fetch(`${API_URL}/tickets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
            body: JSON.stringify(ticketData)
        });

        if (createRes.status !== 200) {
            console.error("Failed to create ticket:", await createRes.text());
            return;
        }
        const ticket = await createRes.json();
        const ticketId = ticket.id;
        console.log(`Ticket Created: ID ${ticketId}`);

        // 4. Assign to Agent (by Admin)
        console.log(`\n--- Assigning Ticket ${ticketId} to Agent ${agentId} ---`);
        const assignRes = await fetch(`${API_URL}/tickets/${ticketId}/assign/${agentId}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        if (assignRes.status !== 200) {
            console.error("Failed to assign ticket:", await assignRes.text());
        } else {
            console.log("Ticket Assigned.");
        }

        // 5. Verify Access
        console.log("\n--- Verifying Access ---");

        // A. Customer (Owner) -> SHOULD SUCCESS
        await checkAccess("Customer (Owner)", ticketId, customerToken, 200);

        // B. Agent (Assigned) -> SHOULD SUCCESS
        await checkAccess("Agent (Assigned)", ticketId, agentToken, 200);

        // C. Admin -> SHOULD SUCCESS
        await checkAccess("Admin", ticketId, adminToken, 200);

        // 6. Negative Test: Create Unassigned Ticket
        console.log("\n--- Negative Test: Unassigned Ticket ---");
        const ticket2Res = await fetch(`${API_URL}/tickets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerToken}` },
            body: JSON.stringify({ ...ticketData, title: "Unassigned Ticket" })
        });
        const ticket2 = await ticket2Res.json();
        console.log(`Ticket 2 Created: ID ${ticket2.id} (Unassigned)`);

        // D. Agent -> Unassigned Ticket -> SHOULD FAIL (403)
        // Wait... TicketController logic says: 
        // allowed = admin || (agent && assigned && agent.id == currentUser.id) || (customer && owner)
        // So unassigned ticket viewed by Agent should be 403.
        await checkAccess("Agent (Unassigned)", ticket2.id, agentToken, 403);

    } catch (e) {
        console.error("Script Error:", e);
    }
}

async function login(creds, roleName) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds)
    });
    if (res.status !== 200) {
        const text = await res.text();
        console.error(`Login failed for ${roleName}: ${res.status} - ${text}`);
        return null;
    }
    const data = await res.json();
    console.log(`Logged in as ${roleName} (ID: ${data.id})`);
    return { token: data.token, id: data.id };
}

async function checkAccess(testerName, ticketId, token, expectedStatus) {
    const res = await fetch(`${API_URL}/tickets/${ticketId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const status = res.status;
    const result = status === expectedStatus ? "PASS" : "FAIL";
    console.log(`${testerName} viewing Ticket ${ticketId}: ${status} (Expected: ${expectedStatus}) -> ${result}`);
}

run();
