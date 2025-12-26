import api from "./api";

// ADMIN: Fetch users (supports role filter, pagination, search)
export const fetchUsers = async (params) => {
  // If search query is present, use search endpoint (unless filtering by role too? backend search doesn't take role)
  // Logic: The frontend Users.jsx passes { page, size, search, role }.
  // The Backend has: GET / (role, page, size) and GET /search (query).
  // Implementation choice: If search is present, call /search?query=...
  // BEWARE: Backend /search returns List<UserResponseDTO>, not Page. Pagination might break on frontend if it expects Page.
  // But Users.jsx expects `data.content` and `data.page`.
  // If we search, we get a list. We might need to mock page structure or backend search needs upgrade.
  // For now, let's replicate likely previous behavior: 
  if (params.search) {
    const { data } = await api.get(`/users/search`, { params: { query: params.search } });
    // Wrap list in page structure to avoid crash
    return {
      content: data,
      page: 0,
      size: data.length,
      totalElements: data.length,
      totalPages: 1
    };
  }

  const { data } = await api.get("/users", { params });

  // Handle List response (when no role filter is applied)
  if (Array.isArray(data)) {
    return {
      content: data,
      page: 0,
      size: data.length,
      totalElements: data.length,
      totalPages: 1
    };
  }

  return data;
};

// ADMIN: Get user by ID
export const fetchUserById = async (id) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

// ADMIN: Create user
export const createUser = async (userData) => {
  const { data } = await api.post("/users", userData);
  return data;
};

// ADMIN: Update user
export const updateUser = async (id, userData) => {
  const { data } = await api.put(`/users/${id}`, userData);
  return data;
};

// ADMIN: Delete user
export const deleteUser = async (id) => {
  await api.delete(`/users/${id}`);
};

// ADMIN: Toggle user status
export const toggleUserEnabled = async (id, enabled) => {
  // Backend toggles status, so we just hit the endpoint.
  // We ignore 'enabled' arg as backend toggles based on current state.
  const { data } = await api.patch(`/users/${id}/status`);
  return data;
};



// Aliases for specific creation if needed
export const createAgent = createUser; // Used by CreateAgent.jsx

// PROFILE: Get my profile
export const getMyProfile = async () => {
  const { data } = await api.get("/users/me");
  return data;
};

// PROFILE: Update my profile
export const updateMyProfile = async (userData) => {
  const { data } = await api.put("/users/me", userData);
  return data;
};

// PROFILE: Upload avatar
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post("/users/me/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};
