import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import {
  MOCK_USER,
  MOCK_APPOINTMENTS,
  MOCK_SPECIALISTS,
  MOCK_SLOTS,
} from "../data/mockData";

const USE_MOCK = false;

export const useUser = () => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (USE_MOCK) { setUser(MOCK_USER); setLoading(false); return; }
    api.getUser()
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { user, loading, error };
};

export const useAppointments = (date) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [refreshIdx, setRefreshIdx]     = useState(0);

  useEffect(() => {
    if (USE_MOCK) { setAppointments(MOCK_APPOINTMENTS); setLoading(false); return; }
    setLoading(true);
    api.getAppointments(date)
      .then(setAppointments)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [date, refreshIdx]);

  const refresh = useCallback(() => setRefreshIdx((i) => i + 1), []);

  return { appointments, loading, error, refresh };
};

export const useSpecialists = (filters = {}) => {
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => {
    if (USE_MOCK) { setSpecialists(MOCK_SPECIALISTS); setLoading(false); return; }
    api.getSpecialists(filters)
      .then(setSpecialists)
      .catch(setError)
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  return { specialists, loading, error };
};

export const useAvailableSlots = (specialistId, date) => {
  const [slots, setSlots]     = useState({ morning: [], afternoon: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!specialistId || !date) { setLoading(false); return; }
    if (USE_MOCK) { setSlots(MOCK_SLOTS); setLoading(false); return; }
    setLoading(true);
    api.getAvailableSlots(specialistId, date)
      .then(setSlots)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [specialistId, date]);

  return { slots, loading, error };
};

export const useBookAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const book = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 800));
        return { success: true, appointmentId: "mock-" + Date.now(), ...payload };
      }
      return await api.bookAppointment(payload);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { book, loading, error };
};
