import api from "./api";

export async function globalSearch(query, entityType = "all", page = 0, size = 10) {
  const { data } = await api.post("/search", {
    query,
    entityType,
    page,
    size,
  });
  return data;
}

export async function searchTickets(query, params = {}) {
  const { data } = await api.get("/tickets/search", {
    params: { query, ...params },
  });
  return data;
}

export async function searchUsers(query, params = {}) {
  const { data } = await api.get("/users/search", {
    params: { query, ...params },
  });
  return data;
}

export async function searchCategories(query, params = {}) {
  const { data } = await api.get("/categories/search", {
    params: { query, ...params },
  });
  return data;
}

export async function searchLocations(query, params = {}) {
  const { data } = await api.get("/locations/search", {
    params: { query, ...params },
  });
  return data;
}
