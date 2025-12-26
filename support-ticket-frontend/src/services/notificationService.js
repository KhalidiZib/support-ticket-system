import api from "./api";

export async function fetchMyNotifications(params = {}) {
    const { page = 0, size = 10 } = params;
    const { data } = await api.get("/notifications", {
        params: { page, size }
    });
    return data;
}

export async function fetchUnreadCount() {
    const { data } = await api.get("/notifications/unread-count");
    return data;
}

export async function markNotificationRead(id) {
    const { data } = await api.put(`/notifications/${id}/read`);
    return data;
}
