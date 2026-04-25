import {
  buildHalfHourGrid,
  formatHHMM,
  toCardShape,
} from "../utils/time";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

const STORAGE_KEY = "medisync_user";

const currentUser = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
};

const isValidPath = (p) => typeof p === "string" && /^\/[\w\-.\/]*$/.test(p);
const isValidId = (id) => id != null && /^[\w\-.]+$/.test(String(id));

const request = async (path, options = {}) => {
  if (!isValidPath(path)) throw new Error(`Invalid API path: ${path}`);
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${res.statusText}${text ? ` — ${text}` : ""}`);
  }
  if (res.status === 204) return null;
  return res.json();
};

const api = {
  findPatientByEmail: async (email) => {
    const all = await request("/patients");
    const target = email.trim().toLowerCase();
    return all.find((p) => p.email?.toLowerCase() === target) ?? null;
  },

  getUser: async () => {
    const u = currentUser();
    if (!u) throw new Error("No active user");
    return {
      id: u.id,
      name: u.firstName,
      fullName: `${u.firstName} ${u.lastName}`,
      email: u.email,
      role: "Patient",
    };
  },

  getSpecialists: async () => {
    const [doctors, specialties] = await Promise.all([
      request("/doctors"),
      request("/specialties"),
    ]);
    const byId = new Map(specialties.map((s) => [s.id, s.name]));
    return doctors.map((d) => {
      const specialtyName = byId.get(d.specialtyId) ?? "General";
      return {
        id: d.id,
        name: `Dr. ${d.firstName} ${d.lastName}`,
        specialty: specialtyName,
        category: specialtyName,
        available: true,
      };
    });
  },

  getSpecialistById: async (id) => {
    const [doctor, specialties] = await Promise.all([
      request(`/doctors/${id}`),
      request("/specialties"),
    ]);
    const specialty =
      specialties.find((s) => s.id === doctor.specialtyId)?.name ?? "General";
    return {
      id: doctor.id,
      name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
      specialty,
      category: specialty,
      available: true,
    };
  },

  getAvailableSlots: async (doctorId, dateStr) => {
    if (!doctorId || !dateStr) return { morning: [], afternoon: [] };
    const dayOfWeek = new Date(`${dateStr}T00:00:00`).getDay();
    const [schedules, allAppointments] = await Promise.all([
      request(`/doctors/${doctorId}/schedules`),
      request("/appointments"),
    ]);
    const today = (schedules ?? []).filter(
      (s) => s.dayOfWeek === dayOfWeek && s.isAvailable !== false,
    );
    const grid = today.flatMap((s) =>
      buildHalfHourGrid(s.startTime, s.endTime),
    );
    const bookedTimes = new Set(
      (allAppointments ?? [])
        .filter(
          (a) =>
            a.doctorId === doctorId &&
            ["PENDING", "CONFIRMED"].includes(a.status) &&
            typeof a.appointmentTime === "string" &&
            a.appointmentTime.startsWith(dateStr),
        )
        .map((a) => formatHHMM(a.appointmentTime)),
    );
    const free = Array.from(new Set(grid)).filter((t) => !bookedTimes.has(t));
    free.sort((a, b) => a.localeCompare(b));
    return {
      morning: free.filter((t) => t < "12:00"),
      afternoon: free.filter((t) => t >= "12:00"),
    };
  },

  getAppointments: async () => {
    const u = currentUser();
    if (!u) return [];
    const list = await request(`/appointments/patient/${u.id}`);
    return (list ?? [])
      .filter((a) => a.status !== "CANCELLED")
      .map(toCardShape);
  },

  getAppointmentById: (id) => {
    if (!isValidId(id)) throw new Error(`Invalid appointment ID: ${id}`);
    return request(`/appointments/${id}`);
  },

  bookAppointment: async ({ specialistId, date, time }) => {
    const u = currentUser();
    if (!u) throw new Error("No active user");
    const doctor = await request(`/doctors/${specialistId}`);
    const appointmentTime = new Date(`${date}T${time}:00`).toISOString();
    return request("/appointments", {
      method: "POST",
      body: JSON.stringify({
        patientId: u.id,
        patientName: `${u.firstName} ${u.lastName}`,
        patientEmail: u.email,
        doctorId: doctor.id,
        doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
        appointmentTime,
        reason: "Consultation",
      }),
    });
  },

  cancelAppointment: (id) => {
    if (!isValidId(id)) throw new Error(`Invalid appointment ID: ${id}`);
    return request(`/appointments/${id}/cancel`, { method: "PATCH" });
  },

  rescheduleAppointment: (id, { date, time }) => {
    if (!isValidId(id)) throw new Error(`Invalid appointment ID: ${id}`);
    const start = new Date(`${date}T${time}:00`);
    const end = new Date(start.getTime() + 30 * 60_000);
    return request(`/appointments/${id}/reschedule`, {
      method: "PUT",
      body: JSON.stringify({
        newSlotStart: start.toISOString(),
        newSlotEnd: end.toISOString(),
        reason: "Reschedule by user",
      }),
    });
  },
};

export default api;
