import api from "./api";

export async function fetchTickets(params = {}) {
  const { page = 0, size = 10, status, categoryId, locationId, search } = params;
  const { data } = await api.get("/tickets", {
    params: { page, size, status, categoryId, locationId, search },
  });
  return data;
}

export async function fetchTicketById(id) {
  const { data } = await api.get(`/tickets/${id}`);
  return data;
}

export async function createTicket(payload) {
  const { data } = await api.post("/tickets", payload);
  return data;
}

export async function updateTicket(id, payload) {
  const { data } = await api.put(`/tickets/${id}`, payload);
  return data;
}

// Backend uses PUT for status update
export async function updateTicketStatus(id, status) {
  const { data } = await api.put(`/tickets/${id}/status`, null, {
    params: { status },
  });
  return data;
}

// Backend uses PUT for assignment
export async function assignTicket(id, agentId) {
  const { data } = await api.put(`/tickets/${id}/assign/${agentId}`);
  return data;
}

export async function fetchMyTickets(params = {}) {
  const { page = 0, size = 10, status, priority, search } = params;
  const { data } = await api.get("/tickets/my-tickets", {
    params: { page, size, status, priority, search },
  });
  return data;
}

export async function fetchAgentTickets(params = {}) {
  const { page = 0, size = 10, status } = params;
  const { data } = await api.get("/tickets/agent", {
    params: { page, size, status },
  });
  return data;
}

// ✅ MISSING FUNCTIONS ADDED

export async function fetchAssignedTickets(params = {}) {
  const { page = 0, size = 10, status, search } = params;
  const { data } = await api.get("/tickets/assigned-tickets", {
    params: { page, size, status, search },
  });
  return data;
}

export async function addCommentToTicket(ticketId, comment) {
  // Map "comment" argument to "content" field expected by backend DTO
  // Endpoint is /comments, not /tickets/:id/comments
  const { data } = await api.post("/comments", {
    ticketId,
    content: comment
  });
  return data;
}
