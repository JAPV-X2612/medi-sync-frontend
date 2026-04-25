#!/usr/bin/env node
const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3000";

const SEED_PATIENT = {
  firstName: "John",
  lastName: "Miller",
  email: "seed@medisync.local",
  phone: "+1-555-0100",
  birthDate: "1990-05-12",
  documentNumber: "100200300",
  documentType: "CC",
  bloodType: "O+",
};

const SEED_SPECIALTIES = [
  { name: "Cardiology", description: "Heart and cardiovascular system." },
  { name: "Pediatrics", description: "Medical care for children and adolescents." },
  { name: "Dermatology", description: "Skin, hair, and nail health." },
];

const SEED_DOCTORS = [
  {
    firstName: "Sarah",
    lastName: "Jenkins",
    email: "sarah.jenkins@medisync.local",
    phone: "+1-555-0201",
    licenseNumber: "MED-CARD-001",
    specialty: "Cardiology",
    bio: "Senior cardiologist with 15+ years of clinical experience.",
  },
  {
    firstName: "Elena",
    lastName: "Rodriguez",
    email: "elena.rodriguez@medisync.local",
    phone: "+1-555-0202",
    licenseNumber: "MED-PED-002",
    specialty: "Pediatrics",
    bio: "Pediatric specialist focused on early-childhood preventive care.",
  },
  {
    firstName: "Marcus",
    lastName: "Thorne",
    email: "marcus.thorne@medisync.local",
    phone: "+1-555-0203",
    licenseNumber: "MED-DERM-003",
    specialty: "Dermatology",
    bio: "Dermatologist with a focus on skin oncology.",
  },
];

const WEEK_SCHEDULES = [1, 2, 3, 4, 5].flatMap((dayOfWeek) => [
  { dayOfWeek, startTime: "09:00", endTime: "12:00", slotDurationMin: 30 },
  { dayOfWeek, startTime: "13:00", endTime: "17:00", slotDurationMin: 30 },
]);

const request = async (method, path, body) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${method} ${path} → ${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`);
  }
  if (res.status === 204) return null;
  const ct = res.headers.get("content-type") ?? "";
  return ct.includes("application/json") ? res.json() : res.text();
};

const findOrCreatePatient = async () => {
  const all = await request("GET", "/patients");
  const existing = all.find((p) => p.email?.toLowerCase() === SEED_PATIENT.email.toLowerCase());
  if (existing) {
    console.log(`  Patient already exists: ${existing.email} (${existing.id})`);
    return existing;
  }
  const created = await request("POST", "/patients", SEED_PATIENT);
  console.log(`  Patient created: ${created.email} (${created.id})`);
  return created;
};

const findOrCreateSpecialty = async (spec, existingList) => {
  const existing = existingList.find((s) => s.name === spec.name);
  if (existing) {
    console.log(`  Specialty already exists: ${existing.name} (${existing.id})`);
    return existing;
  }
  const created = await request("POST", "/specialties", spec);
  console.log(`  Specialty created: ${created.name} (${created.id})`);
  return created;
};

const findOrCreateDoctor = async (doctorSeed, specialtyId, existingList) => {
  const existing = existingList.find(
    (d) => d.email?.toLowerCase() === doctorSeed.email.toLowerCase(),
  );
  if (existing) {
    console.log(`  Doctor already exists: ${existing.email} (${existing.id})`);
    return existing;
  }
  const { specialty: _ignored, ...rest } = doctorSeed;
  const created = await request("POST", "/doctors", { ...rest, specialtyId });
  console.log(`  Doctor created: ${created.email} (${created.id})`);
  return created;
};

const ensureSchedules = async (doctorId) => {
  const existing = await request("GET", `/doctors/${doctorId}/schedules`);
  if (existing && existing.length > 0) {
    console.log(`  Schedules already configured for doctor ${doctorId} (${existing.length})`);
    return;
  }
  for (const slot of WEEK_SCHEDULES) {
    await request("POST", "/schedules", { ...slot, doctorId });
  }
  console.log(`  Schedules created for doctor ${doctorId} (${WEEK_SCHEDULES.length})`);
};

const main = async () => {
  console.log(`Seeding MediSync against ${BASE_URL}\n`);

  console.log("Patient:");
  await findOrCreatePatient();

  console.log("\nSpecialties:");
  const allSpecialties = await request("GET", "/specialties");
  const createdSpecialties = [];
  for (const s of SEED_SPECIALTIES) {
    createdSpecialties.push(await findOrCreateSpecialty(s, allSpecialties));
  }
  const specialtyByName = new Map(createdSpecialties.map((s) => [s.name, s]));

  console.log("\nDoctors:");
  const allDoctors = await request("GET", "/doctors");
  const doctors = [];
  for (const d of SEED_DOCTORS) {
    const specialty = specialtyByName.get(d.specialty);
    if (!specialty) {
      throw new Error(`Specialty not found for doctor: ${d.specialty}`);
    }
    doctors.push(await findOrCreateDoctor(d, specialty.id, allDoctors));
  }

  console.log("\nSchedules:");
  for (const doc of doctors) {
    await ensureSchedules(doc.id);
  }

  console.log("\nDone. Login email: seed@medisync.local");
};

main().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});
