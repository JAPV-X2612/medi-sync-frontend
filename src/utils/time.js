const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_LABELS_FROM_MONDAY = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const pad2 = (n) => String(n).padStart(2, "0");

export const toIsoDate = (d) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

export const formatHHMM = (input) => {
  if (!input) return "";
  if (typeof input === "string" && /^\d{2}:\d{2}/.test(input)) {
    return input.slice(0, 5);
  }
  const d = input instanceof Date ? input : new Date(input);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

export const formatAmPm = (input) => {
  const d = input instanceof Date ? input : new Date(input);
  const h = d.getHours();
  const m = d.getMinutes();
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${pad2(h12)}:${pad2(m)} ${suffix}`;
};

export const buildHalfHourGrid = (startTime, endTime) => {
  const [sh, sm] = formatHHMM(startTime).split(":").map(Number);
  const [eh, em] = formatHHMM(endTime).split(":").map(Number);
  const startMin = sh * 60 + sm;
  const endMin = eh * 60 + em;
  const out = [];
  for (let t = startMin; t + 30 <= endMin; t += 30) {
    out.push(`${pad2(Math.floor(t / 60))}:${pad2(t % 60)}`);
  }
  return out;
};

export const doctorInitials = (fullName) => {
  if (!fullName) return "DR";
  const parts = fullName.replace(/^Dr\.?\s+/i, "").trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  return initials || "DR";
};

export const buildCurrentWeek = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dow = today.getDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  return DAY_LABELS_FROM_MONDAY.map((day, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dowIdx = d.getDay();
    const isWeekend = dowIdx === 0 || dowIdx === 6;
    const isPast = d.getTime() < today.getTime();
    return {
      day,
      date: d.getDate(),
      dateStr: toIsoDate(d),
      jsDate: d,
      disabled: isPast || isWeekend,
    };
  });
};

const FULL_DAY_LABELS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

export const formatHumanDate = (d) =>
  `${FULL_DAY_LABELS[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

export const formatTodayLabel = () => {
  const d = new Date();
  return `${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()}`;
};

export const toCardShape = (a) => {
  if (!a) return null;
  const start = new Date(a.appointmentTime);
  const end = new Date(start.getTime() + 30 * 60_000);
  const minutesAway = (start.getTime() - Date.now()) / 60_000;
  const urgent = minutesAway > 0 && minutesAway < 60;
  const badge = urgent ? `In ${Math.round(minutesAway)} mins` : undefined;
  return {
    id: a.id,
    doctor: a.doctorName,
    specialty: a.reason || "Consultation",
    location_detail: undefined,
    time: `${formatAmPm(start)} – ${formatAmPm(end)}`,
    location: "Central Medical Plaza",
    badge,
    urgent,
    initials: doctorInitials(a.doctorName),
  };
};
