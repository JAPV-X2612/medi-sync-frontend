export const MOCK_USER = {
  id: "u1",
  name: "John",
  fullName: "Dr. J. Miller",
  email: "john@email.com",
  role: "Chief Resident",
};

export const MOCK_APPOINTMENTS = [
  {
    id: "a1",
    doctor: "Dr. Sarah Jenkins",
    specialty: "Senior Cardiologist",
    location_detail: "Heart & Vascular Institute",
    time: "10:30 AM – 11:15 AM",
    location: "Building C, Room 402",
    badge: "In 45 mins",
    urgent: true,
    initials: "SJ",
  },
  {
    id: "a2",
    doctor: "Dr. Michael Chen",
    specialty: "Neurologist",
    location_detail: "Clinical Research Wing",
    time: "01:45 PM – 02:30 PM",
    location: "Building A, Lab 12",
    urgent: false,
    initials: "MC",
  },
  {
    id: "a3",
    doctor: "Dr. Elena Rodriguez",
    specialty: "Pediatric Specialist",
    location_detail: "Family Care Plaza",
    time: "04:00 PM – 04:30 PM",
    location: "Building B, Room 205",
    urgent: false,
    initials: "ER",
  },
];

export const MOCK_SPECIALISTS = [
  { id: "s1", name: "Dr. Julian Vance",    specialty: "Senior Cardiologist",  category: "Cardiology",  available: true  },
  { id: "s2", name: "Dr. Elena Rodriguez", specialty: "Pediatric Neurology",  category: "Pediatrics",  available: true  },
  { id: "s3", name: "Dr. Marcus Thorne",   specialty: "Dermatology",          category: "Dermatology", available: true  },
  { id: "s4", name: "Dr. Sarah Jenkins",   specialty: "Neurology Specialist", category: "Neurology",   available: true  },
  { id: "s5", name: "Dr. Amit Patel",      specialty: "General Surgery",      category: "Surgery",     available: true  },
  { id: "s6", name: "Dr. Katherine Moss",  specialty: "Endocrinology",        category: "Oncology",    available: false },
];

export const MOCK_SLOTS = {
  morning:   ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"],
  afternoon: ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"],
};

export const MOCK_WEEK = [
  { day: "Mon", date: 23, disabled: false },
  { day: "Tue", date: 24, disabled: false },
  { day: "Wed", date: 25, disabled: false },
  { day: "Thu", date: 26, disabled: false },
  { day: "Fri", date: 27, disabled: false },
  { day: "Sat", date: 28, disabled: true  },
  { day: "Sun", date: 29, disabled: true  },
];

export const SPECIALTIES = ["All", "Cardiology", "Pediatrics", "Dermatology", "Neurology", "Oncology"];
