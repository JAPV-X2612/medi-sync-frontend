import { useState } from "react";
import PageHeader from "../components/layout/PageHeader";
import Icon from "../components/ui/Icon";
import CalendarDayCell from "../components/booking/CalendarDayCell";
import TimeSlotGroup from "../components/booking/TimeSlotGroup";
import AppointmentBookingPanel from "../components/booking/AppointmentBookingPanel";
import { useAvailableSlots, useBookAppointment } from "../hooks/useApi";
import { MOCK_WEEK } from "../data/mockData";

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
  const [selectedDate, setSelectedDate] = useState(25);
  const [selectedTime, setSelectedTime] = useState("10:00");

  const dateStr = `2023-10-${String(selectedDate).padStart(2, "0")}`;
  const { slots } = useAvailableSlots(selectedSpecialist?.id, dateStr);
  const { book, loading: booking } = useBookAppointment();

  const displayDate = `Wednesday, Oct ${selectedDate}, 2023`;
  const displayTime = selectedTime ? `${selectedTime} — ${addMinutes(selectedTime, 45)}` : "—";

  const handleConfirm = async () => {
    try {
      await book({
        specialistId: selectedSpecialist?.id,
        date: dateStr,
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
      // error handled inside the hook
    }
  };

  return (
    <>
      <PageHeader title="Select a time slot" />

      <div className="p-8 grid grid-cols-10 gap-8">
        <section className="col-span-6 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
            <div className="flex justify-between items-center mb-7">
              <h2 className="font-bold text-slate-900 text-lg">October 2023</h2>
              <div className="flex gap-1">
                <CalendarNavButton icon="chevron_left"  />
                <CalendarNavButton icon="chevron_right" />
              </div>
            </div>
            <div className="grid grid-cols-7 gap-3">
              {MOCK_WEEK.map(({ day, date, disabled }) => (
                <CalendarDayCell
                  key={date}
                  day={day}
                  date={date}
                  selected={selectedDate === date}
                  disabled={disabled}
                  onClick={() => setSelectedDate(date)}
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900">Available Hours</h3>
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                GMT +1
              </span>
            </div>
            <div className="space-y-7">
              {slots?.morning && (
                <TimeSlotGroup
                  label="Morning Sessions"
                  slots={slots.morning}
                  selectedTime={selectedTime}
                  onSelect={setSelectedTime}
                />
              )}
              {slots?.afternoon && (
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
