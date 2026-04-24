const CalendarDayCell = ({ day, date, selected, disabled, onClick }) => (
  <div className={`flex flex-col items-center gap-2 ${disabled ? "opacity-30 pointer-events-none" : ""}`}>
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{day}</span>
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-12 h-14 flex items-center justify-center rounded-xl font-bold text-lg transition-all ${
        selected
          ? "bg-blue-600 text-white shadow-md shadow-blue-200"
          : "bg-slate-50 text-slate-800 hover:bg-slate-100"
      }`}
    >
      {date}
    </button>
  </div>
);

export default CalendarDayCell;
