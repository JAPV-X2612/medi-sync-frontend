const TimeSlotButton = ({ time, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`py-3 rounded-xl font-semibold text-sm transition-all ${
      selected
        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
    }`}
  >
    {time}
  </button>
);

export default TimeSlotButton;
