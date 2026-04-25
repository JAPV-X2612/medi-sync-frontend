import { useEffect, useMemo, useState } from "react";
import PageHeader from "../components/layout/PageHeader";
import Icon from "../components/ui/Icon";
import CalendarDayCell from "../components/booking/CalendarDayCell";
import TimeSlotGroup from "../components/booking/TimeSlotGroup";
import AppointmentBookingPanel from "../components/booking/AppointmentBookingPanel";
import { useAvailableSlots, useBookAppointment } from "../hooks/useApi";
import { buildCurrentWeek, formatHumanDate } from "../utils/time";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const addMinutes = (time, mins) => {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + mins;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

const CalendarNavButton = ({ icon, onClick }) => (
  <button onClick={onClick} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
    <Icon name={icon} className="text-slate-500 text-[20px]" />
  </button>
);

const TimeSlots = ({ setPage, setBookingData, selectedSpecialist }) => {
  const week = useMemo(() => buildCurrentWeek(), []);
  const defaultDay = week.find((d) => !d.disabled) ?? week[0];

  const [selectedDateStr, setSelectedDateStr] = useState(defaultDay.dateStr);
  const [selectedTime, setSelectedTime]       = useState(null);

  const selectedDay = week.find((d) => d.dateStr === selectedDateStr) ?? defaultDay;
  const headerLabel = `${MONTH_NAMES[selectedDay.jsDate.getMonth()]} ${selectedDay.jsDate.getFullYear()}`;
  const displayDate = formatHumanDate(selectedDay.jsDate);
  const displayTime = selectedTime ? `${selectedTime} — ${addMinutes(selectedTime, 45)}` : "—";

  const { slots, loading: slotsLoading } = useAvailableSlots(
    selectedSpecialist?.id,
    selectedDateStr,
  );
  const { book, loading: booking } = useBookAppointment();

  useEffect(() => {
    const allSlots = [...(slots?.morning ?? []), ...(slots?.afternoon ?? [])];
    if (selectedTime && allSlots.includes(selectedTime)) return;
    setSelectedTime(allSlots[0] ?? null);
  }, [slots, selectedTime]);

  const handleConfirm = async () => {
    if (!selectedTime) return;
    try {
      await book({
        specialistId: selectedSpecialist?.id,
        date: selectedDateStr,
        time: selectedTime,
      });

      setBookingData({
        specialist:      selectedSpecialist,
        date:            displayDate,
        time:            displayTime,
        fee:             "$145.00",
        appointmentType: "In-person Consultation",
        address:         "450 Lexington Ave, New York, NY",
      });

      setPage("confirmation");
    } catch (_) {
      // surfaced via the hook's error state
    }
  };

  return (
    <>
      <PageHeader title="Select a time slot" />

      <div className="p-8 grid grid-cols-10 gap-8">
        <section className="col-span-6 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
            <div className="flex justify-between items-center mb-7">
              <h2 className="font-bold text-slate-900 text-lg">{headerLabel}</h2>
              <div className="flex gap-1">
                <CalendarNavButton icon="chevron_left"  />
                <CalendarNavButton icon="chevron_right" />
              </div>
            </div>
            <div className="grid grid-cols-7 gap-3">
              {week.map(({ day, date, dateStr, disabled }) => (
                <CalendarDayCell
                  key={dateStr}
                  day={day}
                  date={date}
                  selected={selectedDateStr === dateStr}
                  disabled={disabled}
                  onClick={() => setSelectedDateStr(dateStr)}
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900">Available Hours</h3>
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Local time
              </span>
            </div>
            <div className="space-y-7">
              {slotsLoading && (
                <p className="text-sm text-slate-500">Loading available hours…</p>
              )}
              {!slotsLoading && (slots?.morning?.length ?? 0) === 0 && (slots?.afternoon?.length ?? 0) === 0 && (
                <p className="text-sm text-slate-500">No availability for this day.</p>
              )}
              {!slotsLoading && slots?.morning?.length > 0 && (
                <TimeSlotGroup
                  label="Morning Sessions"
                  slots={slots.morning}
                  selectedTime={selectedTime}
                  onSelect={setSelectedTime}
                />
              )}
              {!slotsLoading && slots?.afternoon?.length > 0 && (
                <TimeSlotGroup
                  label="Afternoon Sessions"
                  slots={slots.afternoon}
                  selectedTime={selectedTime}
                  onSelect={setSelectedTime}
                />
              )}
            </div>
          </div>
        </section>

        <aside className="col-span-4">
          <AppointmentBookingPanel
            specialist={selectedSpecialist}
            date={displayDate}
            time={displayTime}
            fee="$145.00"
            onConfirm={handleConfirm}
            loading={booking}
          />
        </aside>
      </div>
    </>
  );
};

export default TimeSlots;
