import api from "./api";

export async function fetchAdminDashboard() {
  const res = await api.get("/dashboard/admin");
  return res.data;
}

export async function fetchAgentDashboard() {
  const res = await api.get("/dashboard/agent");
  return res.data;
}

export async function fetchCustomerDashboard() {
  const res = await api.get("/dashboard/customer");
  return res.data;
}
