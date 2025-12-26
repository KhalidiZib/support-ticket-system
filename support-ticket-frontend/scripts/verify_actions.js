const API_URL = "http://localhost:8085/support-api/api";
const _fetch = fetch; // Native fetch in Node 22

async function run() {
    console.log("=== VERIFYING ACTIONS ===");

    // 1. Login
    const adminAuth = await login("kzibika@gmail.com", "K100921Z");
    const customerAuth = await login("customer@example.com", "customer123");

    if (!adminAuth || !customerAuth) return;

    // 2. Create Ticket
    const ticketRes = await _fetch(`${API_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${customerAuth.token}` },
        body: JSON.stringify({ title: "Action Test", description: "Testing actions", priority: "HIGH", categoryId: 1, locationId: 1 })
    });
    const ticket = await ticketRes.json();
    console.log(`Created Ticket ID: ${ticket.id}`);

    // 3. Add Comment (as Admin)
    console.log("Adding comment...");
    const commentRes = await _fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminAuth.token}` },
        body: JSON.stringify({ ticketId: ticket.id, content: "Test Comment Content" })
    });

    if (commentRes.status === 200) {
        const comment = await commentRes.json();
        console.log(`Comment Added: ${comment.content} (ID: ${comment.id})`);
    } else {
        console.error("Failed to add comment:", await commentRes.text());
    }

    // 4. Verify Ticket Fetch includes Comments correctly
    const fetchRes = await _fetch(`${API_URL}/tickets/${ticket.id}`, {
        headers: { 'Authorization': `Bearer ${adminAuth.token}` }
    });
    const fetchedTicket = await fetchRes.json();
    console.log("Fetched Ticket Comments:");
    console.log(JSON.stringify(fetchedTicket.comments, null, 2));

    if (Array.isArray(fetchedTicket.comments) && fetchedTicket.comments.length > 0 && fetchedTicket.comments[0].content === "Test Comment Content") {
        console.log("SUCCESS: Comments mapped correctly!");
    } else {
        console.error("FAILURE: Comments not mapped correctly.");
    }

    // 5. Update Status
    console.log("Updating Status to IN_PROGRESS...");
    const statusRes = await _fetch(`${API_URL}/tickets/${ticket.id}/status?status=IN_PROGRESS`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${adminAuth.token}` }
    });
    if (statusRes.status === 200) {
        const updatedTicket = await statusRes.json();
        console.log(`Status Updated: ${updatedTicket.status}`);
        if (updatedTicket.status === 'IN_PROGRESS') console.log("SUCCESS: Status update works.");
    } else {
        console.error("Failed to update status:", await statusRes.text());
    }
}

async function login(email, password) {
    const res = await _fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (res.status !== 200) {
        console.error("Login failed");
        return null;
    }
    return res.json();
}

run();
