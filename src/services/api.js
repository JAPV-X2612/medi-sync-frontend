export const API_BASE_URL = "https://api.your-backend.com";

const request = async (path, options = {}) => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json();
};

const api = {
  getUser: () =>
    request("/user/me"),

  getSpecialists: (filters = {}) =>
    request(`/specialists?${new URLSearchParams(filters)}`),

  getSpecialistById: (id) =>
    request(`/specialists/${id}`),

  getAvailableSlots: (specialistId, date) =>
    request(`/specialists/${specialistId}/slots?date=${date}`),

  getAppointments: (date) =>
    request(`/appointments${date ? `?date=${date}` : ""}`),

  getAppointmentById: (id) =>
    request(`/appointments/${id}`),

  bookAppointment: (payload) =>
    request("/appointments", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  cancelAppointment: (id) =>
    request(`/appointments/${id}`, { method: "DELETE" }),

  rescheduleAppointment: (id, payload) =>
    request(`/appointments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};

export default api;
