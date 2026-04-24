import TimeSlotButton from "./TimeSlotButton";

const TimeSlotGroup = ({ label, slots, selectedTime, onSelect }) => (
  <div>
    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">{label}</p>
    <div className="grid grid-cols-4 gap-2.5">
      {slots.map((slot) => (
        <TimeSlotButton
          key={slot}
          time={slot}
          selected={selectedTime === slot}
          onClick={() => onSelect(slot)}
        />
      ))}
    </div>
  </div>
);

export default TimeSlotGroup;
