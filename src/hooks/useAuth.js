import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

const STORAGE_KEY = "medisync_user";

const readStoredUser = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
};

const normalize = (patient) => ({
  ...patient,
  name: patient.firstName,
  fullName: `${patient.firstName} ${patient.lastName}`,
  role: "Patient",
});

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    const stored = readStoredUser();
    return stored ? normalize(stored) : null;
  });

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEY) return;
      const next = readStoredUser();
      setUser(next ? normalize(next) : null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback(async (email) => {
    const patient = await api.findPatientByEmail(email);
    if (!patient) throw new Error("No patient registered with that email.");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patient));
    const normalized = normalize(patient);
    setUser(normalized);
    return normalized;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return { user, login, logout };
};
